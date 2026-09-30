import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChartCard, DataTable } from "@/components/impact/ChartCard";
import { Funnel } from "@/components/impact/Funnel";
import { SignupsTrend, longMonth } from "@/components/impact/SignupsTrend";
import { HeadlineStat } from "@/components/impact/HeadlineStat";
import { UpliftDumbbell } from "@/components/impact/UpliftDumbbell";
import { DEMO_MODE, getImpactStats } from "@/lib/impact/data";
import { SERIES_AFTER, SERIES_BEFORE } from "@/lib/impact/palette";
import { pillBtnClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Our impact · It's Not Gossip Training",
  description:
    "What the It's Not Gossip training has changed: how many salon professionals have taken it, and how much more confident they feel afterwards.",
  // While the page shows invented figures it must not be indexed. Remove this
  // once DEMO_MODE is off.
  ...(DEMO_MODE ? { robots: { index: false, follow: false } } : {}),
};

export default async function ImpactPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    isAdmin = Boolean(profile?.is_admin);
  }

  const stats = await getImpactStats();

  const completionRate = stats.registered
    ? Math.round((stats.completed / stats.registered) * 100)
    : 0;

  const meanGain = stats.uplift.length
    ? stats.uplift.reduce((sum, u) => sum + (u.after - u.before), 0) /
      stats.uplift.length
    : 0;

  const respondingGain =
    stats.uplift.find((u) => u.id === "responding") ?? stats.uplift[0];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={user ? { isAdmin } : undefined} />

      <main className="flex-1">
        <section className="hero-gradient py-12 sm:py-16">
          <div className="site-container text-center">
            <div className="mx-auto max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase text-pink">
                Our impact
              </p>
              <h1 className="text-4xl font-bold leading-none text-balance text-brand sm:text-5xl">
                What changes when a salon knows what to look for
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-balance text-ink">
                Everyone who takes this training rates their knowledge and
                confidence before and after. This page is built from their
                answers.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              <HeadlineStat
                value={stats.registered.toLocaleString("en-GB")}
                label="Salon professionals signed up"
              />
              <HeadlineStat
                value={stats.salons.toLocaleString("en-GB")}
                label="Salons and businesses reached"
              />
              <HeadlineStat
                value={stats.completed.toLocaleString("en-GB")}
                label="Training certificates earned"
              />
              <HeadlineStat
                value={`+${meanGain.toFixed(1)}`}
                label="Confidence gain out of 10"
              />
            </div>

            {DEMO_MODE && (
              <p className="mt-5 rounded-2xl border-2 border-warn bg-warn-bg px-5 py-4 text-sm font-bold text-warn">
                Demonstration data. The training has not launched yet, so every
                figure on this page is invented to show the layout. Nothing here
                describes real people.
              </p>
            )}
          </div>
        </section>

        {/* Reach and impact together: the before-and-after comparison leads,
            with how far the training has travelled beside it. */}
        <section className="hero-gradient py-14 sm:py-16">
          <div className="site-container">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-3xl font-bold leading-tight text-brand sm:text-4xl">
                People leave far more confident than they arrive
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink">
                The same three questions are asked at the start of the module
                and again at the end. The gap between the two dots is what the
                training changed.
              </p>
              {respondingGain && (
                <p className="mt-4 text-lg leading-relaxed text-ink">
                  The largest shift is in the question that matters most in the
                  chair: whether someone would feel able to respond if a client
                  opened up to them. That rises from{" "}
                  <strong className="text-brand-deep">
                    {respondingGain.before.toFixed(1)}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-brand-deep">
                    {respondingGain.after.toFixed(1)}
                  </strong>{" "}
                  out of 10.
                </p>
              )}
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
              <ChartCard
                title="Self-rated knowledge and confidence, before and after"
                subtitle="Average score out of 10, from the people who answered both times."
                legend={[
                  { label: "Before the training", colour: SERIES_BEFORE },
                  { label: "After the training", colour: SERIES_AFTER },
                ]}
                footnote={`Based on ${stats.upliftSample.toLocaleString("en-GB")} people who completed both sets of questions. Only people who answered twice are counted, so both figures describe the same group.`}
                table={
                  <DataTable
                    head={["Question", "Before", "After", "Change"]}
                    rows={stats.uplift.map((u) => [
                      u.question,
                      u.before.toFixed(1),
                      u.after.toFixed(1),
                      `+${(u.after - u.before).toFixed(1)}`,
                    ])}
                  />
                }
              >
                <UpliftDumbbell items={stats.uplift} />
              </ChartCard>

              <div className="grid gap-6 lg:gap-8">
                <ChartCard
                  title="New sign-ups each month"
                  subtitle="How word has spread since the training opened."
                  table={
                    <DataTable
                      head={["Month", "New sign-ups"]}
                      rows={stats.signupsByMonth.map((p) => [
                        longMonth(p.month),
                        p.signups,
                      ])}
                    />
                  }
                >
                  <SignupsTrend points={stats.signupsByMonth} />
                </ChartCard>

                <ChartCard
                  title="From sign-up to certificate"
                  subtitle="Where people get to once they have an account."
                  footnote={
                    stats.medianMinutes
                      ? `Half of those who finish do it in under ${stats.medianMinutes} minutes.`
                      : undefined
                  }
                  table={
                    <DataTable
                      head={["Stage", "People"]}
                      rows={[
                        ["Signed up", stats.registered],
                        ["Started the module", stats.started],
                        ["Earned a certificate", stats.completed],
                      ]}
                    />
                  }
                >
                  <Funnel
                    stages={[
                      {
                        label: "Signed up",
                        value: stats.registered,
                        note: "Created an account",
                      },
                      {
                        label: "Started the module",
                        value: stats.started,
                        note: stats.registered
                          ? `${Math.round((stats.started / stats.registered) * 100)}% of sign-ups`
                          : "",
                      },
                      {
                        label: "Earned a certificate",
                        value: stats.completed,
                        note: `${completionRate}% of sign-ups`,
                      },
                    ]}
                  />
                </ChartCard>
              </div>
            </div>
          </div>
        </section>

        {/* Why it matters, in the words already published on the module. */}
        <section className="bg-brand py-14 text-white sm:py-16">
          <div className="site-container">
            <h2 className="mb-8 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
              Why this training exists
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <blockquote className="rounded-2xl bg-white/10 p-7">
                <p className="text-xl font-bold italic leading-relaxed">
                  “In all my years I&apos;ve never had a client tell me they
                  were experiencing domestic abuse. Though plenty have told me
                  their partners were difficult.”
                </p>
                <cite className="mt-4 block text-sm font-bold not-italic text-pink-light">
                  Beauty professional, 15 years&apos; experience
                </cite>
              </blockquote>
              <blockquote className="rounded-2xl bg-white/10 p-7">
                <p className="text-xl font-bold italic leading-relaxed">
                  “Because she didn&apos;t rush in, didn&apos;t judge,
                  didn&apos;t panic, I told her. Not my parents. Not my
                  siblings. My lash tech.”
                </p>
                <cite className="mt-4 block text-sm font-bold not-italic text-pink-light">
                  Mel, survivor
                </cite>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="site-container py-14 text-center sm:py-16">
          <h2 className="mx-auto mb-4 max-w-2xl text-3xl font-bold leading-tight text-balance text-brand sm:text-4xl">
            Add your salon to these numbers
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-ink">
            The training is free, takes about twenty minutes, and ends with a
            certificate you can display.
          </p>
          <Link href="/register" className={pillBtnClass}>
            Start your free training
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
