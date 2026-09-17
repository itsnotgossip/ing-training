import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/AppHeader";
import { CsvButton } from "@/components/CsvButton";
import { getModule, MODULES } from "@/lib/modules";

type SurveyAnswers = Record<string, number>;

function avg(nums: number[]): string {
  if (!nums.length) return "–";
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("full_name, is_admin")
    .eq("id", user.id)
    .single();
  if (!me?.is_admin) redirect("/dashboard");

  const [{ data: profiles }, { data: progress }, { data: surveys }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, salon_name, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("module_progress")
        .select("user_id, module_slug, current_step, completed_at"),
      supabase
        .from("survey_responses")
        .select("user_id, module_slug, phase, answers"),
    ]);

  const progressByUser = new Map<
    string,
    { module_slug: string; current_step: number; completed_at: string | null }[]
  >();
  for (const p of progress ?? []) {
    const list = progressByUser.get(p.user_id) ?? [];
    list.push(p);
    progressByUser.set(p.user_id, list);
  }

  const surveyByUserModule = new Map<string, SurveyAnswers>();
  for (const s of surveys ?? []) {
    surveyByUserModule.set(
      `${s.user_id}|${s.module_slug}|${s.phase}`,
      s.answers as SurveyAnswers
    );
  }

  function surveyTotal(a?: SurveyAnswers): number | null {
    if (!a) return null;
    const vals = Object.values(a);
    if (!vals.length) return null;
    return vals.reduce((x, y) => x + y, 0);
  }

  // Impact stats per module
  const impact = MODULES.map((mod) => {
    const pre: number[] = [];
    const post: number[] = [];
    for (const s of surveys ?? []) {
      if (s.module_slug !== mod.slug) continue;
      const total = surveyTotal(s.answers as SurveyAnswers);
      if (total === null) continue;
      if (s.phase === "pre") pre.push(total);
      else post.push(total);
    }
    const completions = (progress ?? []).filter(
      (p) => p.module_slug === mod.slug && p.completed_at
    ).length;
    const started = (progress ?? []).filter(
      (p) => p.module_slug === mod.slug
    ).length;
    return { mod, pre, post, completions, started };
  });

  const maxScore = (slug: string) =>
    (getModule(slug)?.surveyQuestions.length ?? 0) * 10;

  // Flat rows for the table and CSV
  const rows = (profiles ?? []).flatMap((p) => {
    const userProgress = progressByUser.get(p.id) ?? [];
    if (!userProgress.length) {
      return [
        {
          name: p.full_name,
          salon: p.salon_name,
          registered: p.created_at,
          module: "",
          status: "Registered only",
          completedAt: null as string | null,
          pre: null as number | null,
          post: null as number | null,
        },
      ];
    }
    return userProgress.map((up) => ({
      name: p.full_name,
      salon: p.salon_name,
      registered: p.created_at,
      module: getModule(up.module_slug)?.title ?? up.module_slug,
      status: up.completed_at ? "Completed" : "In progress",
      completedAt: up.completed_at,
      pre: surveyTotal(
        surveyByUserModule.get(`${p.id}|${up.module_slug}|pre`)
      ),
      post: surveyTotal(
        surveyByUserModule.get(`${p.id}|${up.module_slug}|post`)
      ),
    }));
  });

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "";

  const csvRows: (string | number | null)[][] = [
    [
      "Name",
      "Salon",
      "Registered",
      "Module",
      "Status",
      "Completed on",
      "Pre-training score",
      "Post-training score",
    ],
    ...rows.map((r) => [
      r.name,
      r.salon,
      fmtDate(r.registered),
      r.module,
      r.status,
      fmtDate(r.completedAt),
      r.pre,
      r.post,
    ]),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader firstName={me.full_name?.split(" ")[0]} isAdmin />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="mb-1 text-3xl font-extrabold text-brand">Admin</h1>
        <p className="mb-8 text-ink-soft">
          Everyone who has registered, their progress, and the impact of the
          training.
        </p>

        {/* Impact summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {impact.map(({ mod, pre, post, completions, started }) => (
            <div
              key={mod.slug}
              className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(70,45,115,0.08)]"
            >
              <h2 className="mb-3 font-extrabold text-brand-dark">
                {mod.title}
              </h2>
              <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                <div className="rounded-xl bg-lav p-3">
                  <p className="text-2xl font-extrabold text-brand">
                    {started}
                  </p>
                  <p className="text-xs font-semibold text-ink-soft">
                    Started
                  </p>
                </div>
                <div className="rounded-xl bg-lav p-3">
                  <p className="text-2xl font-extrabold text-brand">
                    {completions}
                  </p>
                  <p className="text-xs font-semibold text-ink-soft">
                    Completed
                  </p>
                </div>
                <div className="rounded-xl bg-lav p-3">
                  <p className="text-2xl font-extrabold text-brand">
                    {avg(pre)}
                  </p>
                  <p className="text-xs font-semibold text-ink-soft">
                    Avg before (of {maxScore(mod.slug)})
                  </p>
                </div>
                <div className="rounded-xl bg-pink-soft p-3">
                  <p className="text-2xl font-extrabold text-pink-dark">
                    {avg(post)}
                  </p>
                  <p className="text-xs font-semibold text-ink-soft">
                    Avg after (of {maxScore(mod.slug)})
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User table */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-brand">
            Users ({profiles?.length ?? 0})
          </h2>
          <CsvButton rows={csvRows} filename="ing-training-report.csv" />
        </div>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_2px_10px_rgba(70,45,115,0.08)]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-lav-deep text-xs font-extrabold uppercase tracking-wide text-brand">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Salon</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Before</th>
                <th className="px-4 py-3">After</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-lav last:border-0">
                  <td className="px-4 py-3 font-bold text-brand-deep">
                    {r.name}
                  </td>
                  <td className="px-4 py-3">{r.salon}</td>
                  <td className="px-4 py-3">{r.module}</td>
                  <td className="px-4 py-3">
                    {r.status === "Completed" ? (
                      <span className="rounded-full bg-ok-bg px-2.5 py-0.5 text-xs font-extrabold text-ok">
                        Completed
                      </span>
                    ) : r.status === "In progress" ? (
                      <span className="rounded-full bg-pink-soft px-2.5 py-0.5 text-xs font-extrabold text-pink-dark">
                        In progress
                      </span>
                    ) : (
                      <span className="rounded-full bg-lav-deep px-2.5 py-0.5 text-xs font-extrabold text-brand">
                        Registered
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{fmtDate(r.completedAt)}</td>
                  <td className="px-4 py-3">{r.pre ?? ""}</td>
                  <td className="px-4 py-3">{r.post ?? ""}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-ink-soft"
                  >
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
