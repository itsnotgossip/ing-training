"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Step, TrainingModule } from "@/lib/modules/types";
import { BlockRenderer } from "@/components/BlockRenderer";
import { QuickExit } from "@/components/QuickExit";
import { HelplineBar } from "@/components/HelplineBar";
import { Rich } from "@/components/Rich";

type Props = {
  module: TrainingModule;
  userId: string;
  initialStep: number;
  initialQuizCorrect: Record<string, boolean>;
  initialSurveysDone: { pre: boolean; post: boolean };
  alreadyCompleted: boolean;
  // Preview mode: no database writes, nothing is saved.
  preview?: boolean;
};

const SCALE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function ModulePlayer({
  module: mod,
  userId,
  initialStep,
  initialQuizCorrect,
  initialSurveysDone,
  alreadyCompleted,
  preview = false,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const steps = mod.steps;

  const [cur, setCur] = useState(
    Math.max(0, Math.min(initialStep, steps.length - 1))
  );
  // "stepIdx-questionIdx" -> answered correctly
  const [quizCorrect, setQuizCorrect] = useState(initialQuizCorrect);
  // Wrong options clicked this session: "stepIdx-questionIdx" -> option indices
  const [wrongPicks, setWrongPicks] = useState<Record<string, number[]>>({});
  const [surveysDone, setSurveysDone] = useState(initialSurveysDone);
  const [surveyDraft, setSurveyDraft] = useState<Record<string, number>>({});
  const [surveySaving, setSurveySaving] = useState(false);
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [saveError, setSaveError] = useState<string | null>(null);
  const completing = useRef(false);

  const saveProgress = useCallback(
    (step: number, correct: Record<string, boolean>) => {
      if (preview) return;
      void supabase
        .from("module_progress")
        .upsert(
          {
            user_id: userId,
            module_slug: mod.slug,
            current_step: step,
            answers: correct,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,module_slug" }
        )
        .then(({ error }) => {
          if (error) {
            setSaveError(
              `Your progress isn't saving (${error.code || "error"}): ${error.message}`
            );
          }
        });
    },
    [supabase, userId, mod.slug, preview]
  );

  const markComplete = useCallback(async () => {
    if (completed || completing.current) return;
    if (preview) {
      setCompleted(true);
      return;
    }
    completing.current = true;
    const { error } = await supabase
      .from("module_progress")
      .update({ completed_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("module_slug", mod.slug)
      .is("completed_at", null);
    if (!error) {
      setCompleted(true);
      router.refresh();
    }
    completing.current = false;
  }, [completed, supabase, userId, mod.slug, router, preview]);

  const step = steps[cur];

  function stepSatisfied(s: Step, idx: number): boolean {
    if (s.type === "quiz") {
      return s.questions.every((_, qi) => quizCorrect[`${idx}-${qi}`]);
    }
    if (s.type === "survey") {
      return surveysDone[s.phase];
    }
    return true;
  }

  const canNext = cur < steps.length - 1 && stepSatisfied(step, cur);

  const go = useCallback(
    (delta: number) => {
      setCur((prev) => {
        const target = Math.max(
          0,
          Math.min(prev + delta, steps.length - 1)
        );
        if (delta > 0 && !stepSatisfied(steps[prev], prev)) return prev;
        if (target !== prev) {
          saveProgress(target, quizCorrect);
          window.scrollTo({ top: 0 });
        }
        return target;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [steps, quizCorrect, surveysDone, saveProgress]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Reaching the final step completes the module.
  useEffect(() => {
    if (steps[cur].type === "finish") void markComplete();
  }, [cur, steps, markComplete]);

  function answerQuiz(stepIdx: number, qIdx: number, optIdx: number) {
    const s = steps[stepIdx];
    if (s.type !== "quiz") return;
    const key = `${stepIdx}-${qIdx}`;
    if (quizCorrect[key]) return;
    if (s.questions[qIdx].a === optIdx) {
      const next = { ...quizCorrect, [key]: true };
      setQuizCorrect(next);
      saveProgress(stepIdx, next);
    } else {
      setWrongPicks((w) => ({
        ...w,
        [key]: [...(w[key] ?? []), optIdx],
      }));
    }
  }

  async function submitSurvey(phase: "pre" | "post") {
    if (preview) {
      setSurveysDone((d) => ({ ...d, [phase]: true }));
      setSurveyDraft({});
      return;
    }
    setSurveySaving(true);
    setSaveError(null);

    // Confirm the browser session is really authenticated before writing.
    const {
      data: { user: browserUser },
    } = await supabase.auth.getUser();
    if (!browserUser) {
      setSurveySaving(false);
      setSaveError(
        "You appear to be signed out in this browser. Please log out and log back in, then try again."
      );
      return;
    }

    const answers: Record<string, number> = {};
    for (const q of mod.surveyQuestions) answers[q.id] = surveyDraft[q.id];
    const { error } = await supabase.from("survey_responses").upsert(
      {
        user_id: browserUser.id,
        module_slug: mod.slug,
        phase,
        answers,
      },
      { onConflict: "user_id,module_slug,phase" }
    );
    setSurveySaving(false);
    if (!error) {
      setSurveysDone((d) => ({ ...d, [phase]: true }));
      setSurveyDraft({});
    } else {
      setSaveError(`Could not save (${error.code || "error"}): ${error.message}`);
    }
  }

  const pct = Math.round((cur / (steps.length - 1)) * 100);

  return (
    <div className="flex min-h-screen flex-col pb-16">
      {preview && (
        <div className="bg-pink px-4 py-1.5 text-center text-xs font-extrabold text-white">
          Preview mode: nothing is saved. Accounts, saved progress and
          certificates switch on once Supabase is set up.
        </div>
      )}
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center gap-3 bg-white px-4 py-2 shadow-[0_2px_8px_rgba(70,45,115,0.08)] sm:px-5">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-2"
          title="Back to my modules"
        >
          <Image src="/logo.png" alt="It's Not Gossip" width={42} height={36} />
        </Link>
        <span className="hidden truncate text-sm font-bold text-brand sm:block">
          {mod.title}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/dashboard"
            className="rounded-full border-2 border-brand-soft px-4 py-1.5 text-sm font-bold text-brand transition hover:border-brand"
          >
            Save &amp; exit
          </Link>
          <QuickExit />
        </div>
      </header>

      {/* Progress */}
      <div className="sticky top-[54px] z-40 bg-lav px-4 pb-1.5 pt-2.5">
        <div className="mx-auto h-2 max-w-3xl overflow-hidden rounded-full bg-lav-deep">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-pink transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mx-auto mt-1 max-w-3xl text-right text-[0.7rem] font-bold text-brand">
          {cur + 1} of {steps.length} · {step.navTitle}
        </p>
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-10 pt-4">
        {saveError && step.type !== "survey" && (
          <p className="mb-4 rounded-xl bg-warn-bg px-4 py-3 text-sm font-semibold text-warn">
            {saveError}
          </p>
        )}
        <StepView
          key={cur}
          step={step}
          stepIdx={cur}
          mod={mod}
          quizCorrect={quizCorrect}
          wrongPicks={wrongPicks}
          onAnswer={answerQuiz}
          surveysDone={surveysDone}
          surveyDraft={surveyDraft}
          setSurveyDraft={setSurveyDraft}
          surveySaving={surveySaving}
          submitSurvey={submitSurvey}
          saveError={saveError}
          completed={completed}
          preview={preview}
        />

        {/* Nav buttons */}
        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={() => go(-1)}
            disabled={cur === 0}
            className="rounded-full border-2 border-brand-soft px-6 py-2.5 font-extrabold text-brand transition hover:border-brand disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            ← Back
          </button>
          {cur < steps.length - 1 && (
            <button
              onClick={() => go(1)}
              disabled={!canNext}
              className="rounded-full bg-brand px-7 py-2.5 font-extrabold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              Next →
            </button>
          )}
        </div>
        {!canNext && cur < steps.length - 1 && (
          <p className="mt-2 text-right text-xs font-semibold text-ink-soft">
            {step.type === "quiz"
              ? "Answer every question correctly to continue."
              : step.type === "survey"
                ? "Answer and save the questions to continue."
                : ""}
          </p>
        )}
      </main>

      <HelplineBar />
    </div>
  );
}

function StepView({
  step,
  stepIdx,
  mod,
  quizCorrect,
  wrongPicks,
  onAnswer,
  surveysDone,
  surveyDraft,
  setSurveyDraft,
  surveySaving,
  submitSurvey,
  saveError,
  completed,
  preview,
}: {
  step: Step;
  stepIdx: number;
  mod: TrainingModule;
  quizCorrect: Record<string, boolean>;
  wrongPicks: Record<string, number[]>;
  onAnswer: (stepIdx: number, qIdx: number, optIdx: number) => void;
  surveysDone: { pre: boolean; post: boolean };
  surveyDraft: Record<string, number>;
  setSurveyDraft: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  surveySaving: boolean;
  submitSurvey: (phase: "pre" | "post") => void;
  saveError: string | null;
  completed: boolean;
  preview: boolean;
}) {
  if (step.type === "hero") {
    return (
      <div className="animate-[fadeIn_0.35s_ease]">
        <div className="rounded-3xl bg-brand px-8 py-12 text-center text-white">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#f0c3e0]">
            {step.kicker}
          </p>
          <h1 className="mb-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            {step.title}
          </h1>
          <p className="italic text-[#ded4ec]">{step.subtitle}</p>
        </div>
        <div className="mt-4">
          {step.blocks?.map((b, i) => <BlockRenderer key={i} block={b} />)}
        </div>
      </div>
    );
  }

  if (step.type === "content" || step.type === "finish") {
    return (
      <div>
        <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-pink-dark">
          {step.kicker}
        </p>
        <h2 className="mb-4 text-2xl font-extrabold text-brand">
          {step.title}
        </h2>
        {step.blocks.map((b, i) => (
          <BlockRenderer key={i} block={b} />
        ))}
        {step.type === "finish" && (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-[0_2px_10px_rgba(70,45,115,0.08)]">
            {completed ? (
              <>
                <p className="mb-1 text-3xl">🎉</p>
                <h3 className="mb-2 text-xl font-extrabold text-brand">
                  Module complete!
                </h3>
                {preview ? (
                  <p className="text-ink-soft">
                    In the real thing, the learner's certificate is created
                    here with their name and today's date, ready to print or
                    download.
                  </p>
                ) : (
                  <>
                    <p className="mb-5 text-ink-soft">
                      Your certificate is ready. You can view, print or
                      download it any time from your dashboard.
                    </p>
                    <Link
                      href={`/modules/${mod.slug}/certificate`}
                      className="inline-block rounded-full bg-pink px-8 py-3 font-extrabold text-white transition hover:bg-pink-dark"
                    >
                      Get my certificate
                    </Link>
                  </>
                )}
              </>
            ) : (
              <p className="font-semibold text-ink-soft">
                Saving your completion…
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (step.type === "quiz") {
    return (
      <div>
        <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-pink-dark">
          {step.kicker}
        </p>
        <h2 className="mb-4 text-2xl font-extrabold text-brand">
          {step.title}
        </h2>
        {step.intro?.map((b, i) => <BlockRenderer key={i} block={b} />)}
        {step.questions.map((q, qi) => {
          const key = `${stepIdx}-${qi}`;
          const solved = Boolean(quizCorrect[key]);
          const wrongs = wrongPicks[key] ?? [];
          return (
            <div
              key={qi}
              className="mb-4 rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(70,45,115,0.08)]"
            >
              <h3 className="mb-3 font-extrabold text-brand-dark">{q.q}</h3>
              {q.opts.map((opt, oi) => {
                const isCorrectPick = solved && oi === q.a;
                const isWrongPick = wrongs.includes(oi);
                return (
                  <button
                    key={oi}
                    disabled={solved || isWrongPick}
                    onClick={() => onAnswer(stepIdx, qi, oi)}
                    className={`mb-2 block w-full rounded-xl border-2 px-4 py-3 text-left text-[0.95rem] transition ${
                      isCorrectPick
                        ? "border-ok bg-ok-bg font-bold text-ok"
                        : isWrongPick
                          ? "border-warn bg-warn-bg text-warn"
                          : solved
                            ? "border-transparent bg-lav text-ink-soft"
                            : "border-transparent bg-lav text-ink hover:border-brand-soft cursor-pointer"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
              {wrongs.length > 0 && !solved && (
                <p className="mt-1 rounded-xl bg-warn-bg px-4 py-2.5 text-sm font-semibold text-warn">
                  Not quite. Have another go!
                </p>
              )}
              {solved && (
                <div className="mt-1 rounded-xl bg-ok-bg px-4 py-3 text-sm text-ok">
                  {q.fb}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Survey step
  const done = surveysDone[step.phase];
  const allAnswered = mod.surveyQuestions.every(
    (q) => surveyDraft[q.id] !== undefined
  );
  return (
    <div>
      <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-pink-dark">
        {step.kicker}
      </p>
      <h2 className="mb-4 text-2xl font-extrabold text-brand">{step.title}</h2>
      <div className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(70,45,115,0.08)]">
        <Rich text={step.intro} className="mb-5 text-ink-soft" />
        {done ? (
          <p className="rounded-xl bg-ok-bg px-4 py-3 font-bold text-ok">
            ✓ Thank you, your answers have been saved. Click Next to continue.
          </p>
        ) : (
          <>
            {mod.surveyQuestions.map((q) => (
              <div key={q.id} className="mb-6">
                <p className="mb-2 font-bold text-brand-dark">{q.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {SCALE.map((n) => (
                    <button
                      key={n}
                      onClick={() =>
                        setSurveyDraft((d) => ({ ...d, [q.id]: n }))
                      }
                      className={`h-10 w-10 rounded-full border-2 text-sm font-extrabold transition cursor-pointer ${
                        surveyDraft[q.id] === n
                          ? "border-brand bg-brand text-white"
                          : "border-brand-soft bg-white text-brand hover:border-brand"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-[0.68rem] font-semibold text-ink-soft">
                  <span>0 = not at all</span>
                  <span>10 = extremely</span>
                </div>
              </div>
            ))}
            <button
              onClick={() => submitSurvey(step.phase)}
              disabled={!allAnswered || surveySaving}
              className="rounded-full bg-pink px-7 py-2.5 font-extrabold text-white transition hover:bg-pink-dark disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              {surveySaving ? "Saving…" : "Save my answers"}
            </button>
            {saveError && (
              <p className="mt-3 rounded-xl bg-warn-bg px-4 py-3 text-sm font-semibold text-warn">
                {saveError}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
