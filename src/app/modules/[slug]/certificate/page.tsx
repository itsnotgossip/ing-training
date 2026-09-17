import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getModule } from "@/lib/modules";
import { AppHeader } from "@/components/AppHeader";
import { PrintButton } from "@/components/PrintButton";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: progress }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, salon_name, is_admin")
      .eq("id", user.id)
      .single(),
    supabase
      .from("module_progress")
      .select("completed_at")
      .eq("user_id", user.id)
      .eq("module_slug", slug)
      .maybeSingle(),
  ]);

  if (!progress?.completed_at) redirect(`/modules/${slug}`);

  const completedDate = new Date(progress.completed_at).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        firstName={profile?.full_name?.split(" ")[0]}
        isAdmin={profile?.is_admin}
      />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div
          id="certificate"
          className="rounded-lg border-[6px] border-double border-brand bg-white px-9 py-11 text-center shadow-[0_2px_14px_rgba(70,45,115,0.1)]"
        >
          <Image
            src="/logo.png"
            alt="It's Not Gossip"
            width={72}
            height={61}
            className="mx-auto mb-4"
          />
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.1em] text-brand">
            it's not gossip
          </p>
          <h1 className="mb-1 text-2xl font-extrabold text-brand">
            Certificate of Completion
          </h1>
          <p>This certifies that</p>
          <p className="mx-auto my-4 inline-block border-b-2 border-brand-soft px-6 pb-1.5 text-3xl font-extrabold text-pink-dark">
            {profile?.full_name || "Certificate holder"}
          </p>
          {profile?.salon_name && (
            <p className="text-sm text-ink-soft">of {profile.salon_name}</p>
          )}
          <p className="mt-4 text-lg font-bold text-brand-dark">
            {mod.title}
          </p>
          <p className="mb-4 text-sm text-ink-soft">{mod.subtitle}</p>
          <p className="text-sm text-ink-soft">Completed on {completedDate}</p>
          <p className="mt-5 text-xs text-ink-soft">
            itsnotgossip.org · Registered Charity No. 1214504
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
          <PrintButton />
          <Link
            href="/dashboard"
            className="rounded-full border-2 border-brand-soft px-7 py-3 font-extrabold text-brand transition hover:border-brand"
          >
            Back to my modules
          </Link>
        </div>
        <p className="mt-3 text-center text-xs text-ink-soft print:hidden">
          Tip: choose “Save as PDF” in the print window to download a copy.
        </p>
      </main>
    </div>
  );
}
