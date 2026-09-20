import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ModuleCard,
  statusPillCls,
  type ModuleCardProps,
} from "@/components/ModuleCard";
import { HeroBand, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MODULES } from "@/lib/modules";

// TEMPORARY: a fake completed module so the finished state can be reviewed
// while only one real module exists. Delete this constant and the spread
// below before going live.
const SAMPLE_MODULES: ModuleCardProps[] = [
  {
    title: "Sample module: supporting a client after a disclosure",
    description:
      "A placeholder card showing how a completed module looks on the dashboard. This module does not exist yet.",
    minutes: 15,
    status: "completed",
    // Points at a real module so the certificate layout can be reviewed. The
    // preview flag is ignored in production, so this cannot mint a real one.
    certificateHref: `/modules/${MODULES[0].slug}/certificate?preview=1`,
  },
];

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
    (progressRows ?? []).map((r) => [r.module_slug, r]),
  );
  const firstName = profile?.full_name?.split(" ")[0];

  const cards: ModuleCardProps[] = MODULES.map((mod) => {
    const prog = progressBySlug.get(mod.slug);
    const completed = Boolean(prog?.completed_at);
    const started = Boolean(prog) && !completed;

    return {
      title: mod.title,
      description: mod.description,
      minutes: mod.minutes,
      percent: started
        ? Math.round(((prog!.current_step + 1) / mod.steps.length) * 100)
        : 0,
      status: completed ? "completed" : started ? "in-progress" : "not-started",
      href: `/modules/${mod.slug}`,
      certificateHref: `/modules/${mod.slug}/certificate`,
    };
  });

  // TEMPORARY: remove along with SAMPLE_MODULES above.
  const allCards = [...cards, ...SAMPLE_MODULES];
  const completedCount = allCards.filter(
    (c) => c.status === "completed",
  ).length;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={{ isAdmin: profile?.is_admin }} />

      <main className="flex-1">
        <HeroBand>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-bold uppercase text-pink">
                {profile?.salon_name || "Your training"}
              </p>
              <h1 className="mb-5 text-4xl font-bold leading-none text-balance text-brand sm:text-5xl">
                Welcome{firstName ? `, ${firstName}` : ""}
              </h1>
              <p className="text-lg leading-snug text-ink">
                Complete a module to earn your certificate. Your progress saves
                automatically, so you can pause any time and pick up where you
                left off.
              </p>
            </div>
            <span className={`shrink-0 ${statusPillCls} bg-pink-soft text-pink-dark`}>
              {completedCount} of {allCards.length} modules complete
            </span>
          </div>
        </HeroBand>

        <section className="site-container py-12 sm:py-16">
          <h2 className="mb-6 text-2xl font-bold text-brand">Your modules</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {allCards.map((card) => (
              <ModuleCard key={card.title} {...card} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
