"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Step, TrainingModule } from "@/lib/modules/types";
import { BlockRenderer } from "@/components/BlockRenderer";
import { HeroBand, SiteHeader, type HeaderUser } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ModuleMinutes } from "@/components/ModuleMinutes";
import { Rich } from "@/components/Rich";
import { CertificateIcon, CheckIcon, CrossIcon } from "@/components/icons";
import { brandPillBtnClass, cardClass, pillBtnClass } from "@/lib/ui";

type Props = {
  module: TrainingModule;
  userId: string;
  // Where the player opens.
  initialStep: number;
  // The furthest step already stored for this user. Kept separate from
  // initialStep so that opening earlier in the module (revisiting a completed
  // one) cannot lower the saved progress. Defaults to initialStep.
  furthestStepReached?: number;
  initialQuizCorrect: Record<string, boolean>;
  initialSurveysDone: { pre: boolean; post: boolean };
  alreadyCompleted: boolean;
  // Shown in the shared header's account navigation.
  headerUser?: HeaderUser;
  // Preview mode: no database writes, nothing is saved.
  preview?: boolean;
};

const SCALE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function ModulePlayer({
  module: mod,
  userId,
  initialStep,
  furthestStepReached,
  initialQuizCorrect,
  initialSurveysDone,
  alreadyCompleted,
  headerUser,
  preview = false,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const steps = mod.steps;

  const [cur, setCur] = useState(
    Math.max(0, Math.min(initialStep, steps.length - 1)),
  );
  // current_step is stored as a high-water mark: the furthest step this user
  // has ever reached. Stepping back to re-read an earlier page must not lower
  // it, or the percentage on the dashboard would go backwards.
  const furthestStep = useRef(
    Math.max(0, Math.min(furthestStepReached ?? initialStep, steps.length - 1)),
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
      if (step > furthestStep.current) furthestStep.current = step;
      void supabase
        .from("module_progress")
        .upsert(
          {
            user_id: userId,
            module_slug: mod.slug,
            current_step: furthestStep.current,
            answers: correct,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,module_slug" },
        )
        .then(({ error }) => {
          if (error) {
            setSaveError(
              `Your progress isn't saving (${error.code || "error"}): ${error.message}`,
            );
          }
        });
    },
    [supabase, userId, mod.slug, preview],
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
        const target = Math.max(0, Math.min(prev + delta, steps.length - 1));
        if (delta > 0 && !stepSatisfied(steps[prev], prev)) return prev;
        if (target !== prev) {
          saveProgress(target, quizCorrect);
          window.scrollTo({ top: 0 });
        }
        return target;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [steps, quizCorrect, surveysDone, saveProgress],
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
        "You appear to be signed out in this browser. Please log out and log back in, then try again.",
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
      { onConflict: "user_id,module_slug,phase" },
    );
    setSurveySaving(false);
    if (!error) {
      setSurveysDone((d) => ({ ...d, [phase]: true }));
      setSurveyDraft({});
    } else {
      setSaveError(
        `Could not save (${error.code || "error"}): ${error.message}`,
      );
    }
  }

  const pct = Math.round((cur / (steps.length - 1)) * 100);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={headerUser} />
      {preview && (
        <div className="bg-pink px-4 py-1.5 text-center text-xs font-bold text-white">
          Preview mode: nothing is saved. Accounts, saved progress and
          certificates switch on once Supabase is set up.
        </div>
      )}

      <main className="flex-1">
        {/* Fixed module banner, matching the dashboard and account heroes. The
            per-step heading and progress live in the content area below. */}
        <HeroBand>
          <div className="max-w-4xl">
            <div className="mb-4">
              <ModuleMinutes minutes={mod.minutes} />
            </div>
            <h1 className="text-4xl font-bold leading-none text-balance text-brand sm:text-5xl">
              {mod.title}
            </h1>
          </div>
        </HeroBand>

        <div className="site-container py-10 sm:py-12">
          {/* Left-aligned, so the reading column starts on the same edge as
              the hero above it and the rest of the site. */}
          <div className="max-w-3xl">
            <div className="mb-8">
              <p className="mb-3 text-sm font-bold uppercase text-pink">
                {step.kicker}
              </p>
              {/* The opening page's title is already the banner heading, so
                  its tagline becomes the page heading instead. */}
              <h2 className="mb-4 text-3xl font-bold leading-tight text-balance text-brand sm:text-4xl">
                {step.title !== mod.title
                  ? step.title
                  : step.type === "hero"
                    ? step.subtitle
                    : step.title}
              </h2>
              {step.type === "hero" && step.title !== mod.title && (
                <p className="text-lg italic leading-snug text-ink">
                  {step.subtitle}
                </p>
              )}
              <div className="mt-8 text-sm font-bold text-brand">
                Step {cur + 1} of {steps.length}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-lav-deep">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-pink transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

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

            {/* Navigation */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t-2 border-lav-deep pt-6">
              <button
                onClick={() => go(-1)}
                disabled={cur === 0}
                className="cursor-pointer rounded-full border-2 border-brand-soft px-6 py-3 text-xs font-bold uppercase tracking-wide text-brand transition hover:border-brand hover:bg-lav disabled:invisible"
              >
                Back
              </button>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-ink-soft transition hover:text-pink"
                  title="Your progress is saved automatically"
                >
                  Save and exit
                </Link>
                {cur < steps.length - 1 && (
                  <button
                    onClick={() => go(1)}
                    disabled={!canNext}
                    className={`${brandPillBtnClass} px-7`}
                  >
                    Next
                  </button>
                )}
              </div>
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
          </div>
        </div>
      </main>

      <SiteFooter />
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
  setSurveyDraft: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  surveySaving: boolean;
  submitSurvey: (phase: "pre" | "post") => void;
  saveError: string | null;
  completed: boolean;
  preview: boolean;
}) {
  if (step.type === "hero") {
    return (
      <div>
        {/* The module summary lives here rather than in the banner. */}
        <p className="mb-6 text-lg leading-relaxed text-ink">
          {mod.description}
        </p>
        {step.blocks?.map((b, i) => (
          <BlockRenderer key={i} block={b} />
        ))}
      </div>
    );
  }

  if (step.type === "content" || step.type === "finish") {
    return (
      <div>
        {step.blocks.map((b, i) => (
          <BlockRenderer key={i} block={b} />
        ))}
        {step.type === "finish" && (
          <div className={`mt-6 ${cardClass} p-8 text-center`}>
            {completed ? (
              <>
                <CertificateIcon className="mx-auto mb-3 h-10 w-10 text-pink" />
                <h3 className="mb-2 text-xl font-bold text-brand">
                  Module complete!
                </h3>
                {preview ? (
                  <p className="text-ink-soft">
                    In the real thing, the learner's certificate is created here
                    with their name and today's date, ready to print or
                    download.
                  </p>
                ) : (
                  <>
                    <p className="mb-5 text-ink-soft">
                      Your certificate is ready. You can view, print or download
                      it any time from your dashboard.
                    </p>
                    <Link
                      href={`/modules/${mod.slug}/certificate`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${pillBtnClass} gap-2 px-8`}
                    >
                      <CertificateIcon />
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
        {step.intro?.map((b, i) => (
          <BlockRenderer key={i} block={b} />
        ))}
        {step.questions.map((q, qi) => {
          const key = `${stepIdx}-${qi}`;
          const solved = Boolean(quizCorrect[key]);
          const wrongs = wrongPicks[key] ?? [];
          return (
            <div key={qi} className={`mb-4 ${cardClass} p-6`}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-pink">
                Question {qi + 1} of {step.questions.length}
              </p>
              <h3 className="mb-1 text-lg font-bold leading-snug text-brand-dark">
                {q.q}
              </h3>
              <p className="mb-4 text-sm text-ink-soft">Choose one answer.</p>
              <div className="flex flex-col gap-2">
                {q.opts.map((opt, oi) => {
                  const isCorrectPick = solved && oi === q.a;
                  const isWrongPick = wrongs.includes(oi);
                  const locked = solved || isWrongPick;
                  // Each option reads as a radio choice: a ring on the left
                  // that fills with a tick or cross once it has been picked.
                  const rowCls = isCorrectPick
                    ? "border-ok bg-ok-bg text-ok"
                    : isWrongPick
                      ? "border-warn bg-warn-bg text-warn"
                      : solved
                        ? "border-lav-deep bg-white text-ink-soft opacity-60"
                        : "cursor-pointer border-brand-soft bg-white text-ink hover:border-brand hover:bg-lav focus-visible:border-brand focus-visible:bg-lav";
                  const ringCls = isCorrectPick
                    ? "border-ok bg-ok text-white"
                    : isWrongPick
                      ? "border-warn bg-warn text-white"
                      : "border-brand-soft bg-white";
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={locked}
                      onClick={() => onAnswer(stepIdx, qi, oi)}
                      className={`flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold leading-snug outline-none transition disabled:cursor-not-allowed ${rowCls}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${ringCls}`}
                      >
                        {isCorrectPick && <CheckIcon />}
                        {isWrongPick && <CrossIcon />}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {wrongs.length > 0 && !solved && (
                <p className="mt-3 rounded-xl bg-warn-bg px-4 py-2.5 text-sm font-semibold text-warn">
                  Not quite. Have another go.
                </p>
              )}
              {solved && (
                <div className="mt-3 rounded-xl bg-ok-bg px-4 py-3 text-sm leading-relaxed text-ok">
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
    (q) => surveyDraft[q.id] !== undefined,
  );
  return (
    <div>
      <div className={`${cardClass} p-6`}>
        <Rich text={step.intro} className="mb-5 leading-relaxed text-ink" />
        {done ? (
          <p className="flex items-center gap-2 rounded-xl bg-ok-bg px-4 py-3 font-bold text-ok">
            <CheckIcon className="h-4 w-4 shrink-0" />
            Thank you, your answers have been saved. Click Next to continue.
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
                      className={`h-10 w-10 rounded-full border-2 text-sm font-bold transition cursor-pointer ${
                        surveyDraft[q.id] === n
                          ? "border-brand bg-brand text-white"
                          : "border-brand-soft bg-white text-brand hover:border-brand"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="mt-1 flex justify-between text-xs font-semibold text-ink-soft">
                  <span>0 = not at all</span>
                  <span>10 = extremely</span>
                </div>
              </div>
            ))}
            <button
              onClick={() => submitSurvey(step.phase)}
              disabled={!allAnswered || surveySaving}
              className={`${pillBtnClass} px-7`}
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
