import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/AppHeader";
import { HelplineBar } from "@/components/HelplineBar";
import { MODULES } from "@/lib/modules";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: progressRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, salon_name, is_admin")
      .eq("id", user.id)
      .single(),
    supabase
      .from("module_progress")
      .select("module_slug, current_step, completed_at")
      .eq("user_id", user.id),
  ]);

  const progressBySlug = new Map(
    (progressRows ?? []).map((r) => [r.module_slug, r])
  );
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <div className="flex min-h-screen flex-col pb-16">
      <AppHeader firstName={firstName} isAdmin={profile?.is_admin} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-pink-dark">
          {profile?.salon_name || "Your training"}
        </p>
        <h1 className="mb-2 text-3xl font-extrabold text-brand">
          Welcome{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mb-8 text-ink-soft">
          Complete a module to earn your certificate. Your progress saves
          automatically, so you can pause any time.
        </p>

        <div className="space-y-4">
          {MODULES.map((mod) => {
            const prog = progressBySlug.get(mod.slug);
            const completed = Boolean(prog?.completed_at);
            const started = Boolean(prog) && !completed;
            const pct = started
              ? Math.round(
                  ((prog!.current_step + 1) / mod.steps.length) * 100
                )
              : completed
                ? 100
                : 0;

            return (
              <div
                key={mod.slug}
                className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(70,45,115,0.08)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-brand-dark">
                      {mod.title}
                    </h2>
                    <p className="text-sm text-ink-soft">{mod.subtitle}</p>
                  </div>
                  {completed ? (
                    <span className="rounded-full bg-ok-bg px-3 py-1 text-xs font-extrabold text-ok">
                      ✓ Completed
                    </span>
                  ) : started ? (
                    <span className="rounded-full bg-pink-soft px-3 py-1 text-xs font-extrabold text-pink-dark">
                      In progress
                    </span>
                  ) : (
                    <span className="rounded-full bg-lav-deep px-3 py-1 text-xs font-extrabold text-brand">
                      Not started
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-ink-soft">{mod.description}</p>
                <p className="mt-2 text-xs font-bold text-brand">
                  ⏱ Takes around {mod.minutes}
                </p>

                {started && (
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-lav-deep">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand to-pink transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/modules/${mod.slug}`}
                    className="rounded-full bg-brand px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-brand-dark"
                  >
                    {completed
                      ? "Revisit module"
                      : started
                        ? "Continue"
                        : "Start module"}
                  </Link>
                  {completed && (
                    <Link
                      href={`/modules/${mod.slug}/certificate`}
                      className="rounded-full bg-pink px-6 py-2.5 text-sm font-extrabold text-white transition hover:bg-pink-dark"
                    >
                      View certificate
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <HelplineBar />
    </div>
  );
}
