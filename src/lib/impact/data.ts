import { createClient } from "@/lib/supabase/server";
import { MODULES } from "@/lib/modules";

// ---------------------------------------------------------------------------
// DEMO MODE
//
// The training has not launched yet, so there is nothing real to report. While
// this is true the page shows invented figures and says so, loudly, at the top.
//
// To go live: set this to false. Everything below already reads the real
// tables, so no other change is needed. Worth checking the page once with real
// data before linking it from the navigation, since the queries below have
// only ever run against an empty database.
// ---------------------------------------------------------------------------
export const DEMO_MODE = true;

export type Uplift = {
  id: string;
  /** Short label for the chart axis. */
  label: string;
  /** The question as the learner saw it. */
  question: string;
  /** Mean score out of 10 before the training. */
  before: number;
  /** Mean score out of 10 after the training. */
  after: number;
};

export type MonthPoint = { month: string; signups: number };

export type ImpactStats = {
  /** People who have created an account. */
  registered: number;
  /** People who have opened a module. */
  started: number;
  /** People who have finished a module and earned a certificate. */
  completed: number;
  /** Distinct salons and businesses named on those accounts. */
  salons: number;
  /** Median minutes from opening a module to finishing it. */
  medianMinutes: number | null;
  /** New sign-ups per calendar month, oldest first. */
  signupsByMonth: MonthPoint[];
  /** Mean before and after score for each self-assessment question. */
  uplift: Uplift[];
  /** How many people answered both the before and after questions. */
  upliftSample: number;
};

// ---------------------------------------------------------------------------
// Demo figures. Invented, but shaped like a real first year: slow at first,
// climbing as word spreads between salons, with a completion rate and an
// uplift in the range these programmes usually report.
// ---------------------------------------------------------------------------
const DEMO: ImpactStats = {
  registered: 451,
  started: 398,
  completed: 312,
  salons: 184,
  medianMinutes: 23,
  signupsByMonth: [
    { month: "2026-03", signups: 12 },
    { month: "2026-04", signups: 28 },
    { month: "2026-05", signups: 41 },
    { month: "2026-06", signups: 66 },
    { month: "2026-07", signups: 83 },
    { month: "2026-08", signups: 97 },
    { month: "2026-09", signups: 124 },
  ],
  uplift: [
    {
      id: "knowledge",
      label: "Knowledge of domestic abuse",
      question: "How would you rate your knowledge of domestic abuse?",
      before: 4.2,
      after: 8.1,
    },
    {
      id: "spotting",
      label: "Confidence spotting the signs",
      question:
        "How confident are you that you would spot the signs of domestic abuse?",
      before: 3.8,
      after: 8.4,
    },
    {
      id: "responding",
      label: "Confidence responding",
      question:
        "How confident would you feel responding if a client opened up to you?",
      before: 3.1,
      after: 8.0,
    },
  ],
  upliftSample: 287,
};

/** Mean of a list, or null when there is nothing to average. */
function mean(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Middle value of a list, or null when empty. */
function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Every month between the first sign-up and now, so quiet months show as zero. */
function monthsBetween(first: Date, last: Date): string[] {
  const out: string[] = [];
  const cursor = new Date(first.getFullYear(), first.getMonth(), 1);
  const end = new Date(last.getFullYear(), last.getMonth(), 1);
  while (cursor <= end) {
    out.push(
      `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`,
    );
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return out;
}

/**
 * Real figures, from the live tables.
 *
 * Reads only aggregate counts and averages, never anything that identifies a
 * person. Note that row level security limits what this can see: it returns
 * full numbers when called by an admin, and only the caller's own rows
 * otherwise. Before linking this page publicly, move these reads to a database
 * view or an admin-side job so the numbers are complete for every visitor.
 */
async function getRealStats(): Promise<ImpactStats> {
  const supabase = await createClient();
  const slugs = MODULES.map((m) => m.slug);

  const [{ data: profiles }, { data: progress }, { data: surveys }] =
    await Promise.all([
      supabase.from("profiles").select("salon_name, created_at"),
      supabase
        .from("module_progress")
        .select("user_id, started_at, completed_at"),
      supabase
        .from("survey_responses")
        .select("user_id, phase, answers")
        .in("module_slug", slugs),
    ]);

  const people = profiles ?? [];
  const runs = progress ?? [];
  const answers = surveys ?? [];

  // Sign-ups per month, with empty months filled in so the line has no gaps.
  const dates = people
    .map((p) => new Date(p.created_at as string))
    .filter((d) => !Number.isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());
  const counts = new Map<string, number>();
  for (const d of dates) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const signupsByMonth = dates.length
    ? monthsBetween(dates[0], new Date()).map((month) => ({
        month,
        signups: counts.get(month) ?? 0,
      }))
    : [];

  // One person can hold several module rows, so count people, not rows.
  const startedUsers = new Set(runs.map((r) => r.user_id as string));
  const completedUsers = new Set(
    runs.filter((r) => r.completed_at).map((r) => r.user_id as string),
  );

  const durations = runs
    .filter((r) => r.completed_at && r.started_at)
    .map(
      (r) =>
        (new Date(r.completed_at as string).getTime() -
          new Date(r.started_at as string).getTime()) /
        60000,
    )
    .filter((mins) => mins > 0 && mins < 60 * 24);

  const salons = new Set(
    people
      .map((p) => (p.salon_name as string | null)?.trim().toLowerCase())
      .filter((s): s is string => Boolean(s)),
  );

  // Only count people who answered both times, so before and after describe
  // the same group and the comparison is honest.
  const byPhase = { pre: new Map(), post: new Map() } as Record<
    "pre" | "post",
    Map<string, Record<string, number>>
  >;
  for (const row of answers) {
    const phase = row.phase as "pre" | "post";
    if (phase !== "pre" && phase !== "post") continue;
    byPhase[phase].set(
      row.user_id as string,
      (row.answers ?? {}) as Record<string, number>,
    );
  }
  const bothPhases = [...byPhase.pre.keys()].filter((id) =>
    byPhase.post.has(id),
  );

  const questions = MODULES[0]?.surveyQuestions ?? [];
  const uplift: Uplift[] = questions.map((q) => {
    const before = bothPhases
      .map((id) => byPhase.pre.get(id)?.[q.id])
      .filter((n): n is number => typeof n === "number");
    const after = bothPhases
      .map((id) => byPhase.post.get(id)?.[q.id])
      .filter((n): n is number => typeof n === "number");
    return {
      id: q.id,
      label: q.label,
      question: q.label,
      before: mean(before) ?? 0,
      after: mean(after) ?? 0,
    };
  });

  return {
    registered: people.length,
    started: startedUsers.size,
    completed: completedUsers.size,
    salons: salons.size,
    medianMinutes:
      median(durations) === null ? null : Math.round(median(durations)!),
    signupsByMonth,
    uplift,
    upliftSample: bothPhases.length,
  };
}

export async function getImpactStats(): Promise<ImpactStats> {
  if (DEMO_MODE) return DEMO;
  return getRealStats();
}
