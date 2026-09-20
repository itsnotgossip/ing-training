import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getModule } from "@/lib/modules";
import { HelplineBar } from "@/components/HelplineBar";
import { LogoLockup } from "@/components/LogoLockup";
import { QuickExit } from "@/components/QuickExit";
import { SiteFooter } from "@/components/SiteFooter";
import { DownloadCertificateButton } from "@/components/DownloadCertificateButton";

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
      .select("full_name, salon_name")
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
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    // Same stripped-back treatment as the sign-in pages: no site header, just
    // the helpline bar above a full-height gradient holding the certificate.
    <div className="flex min-h-screen flex-col">
      <HelplineBar />

      <main className="hero-gradient flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-12">
          <LogoLockup
            href="/dashboard"
            size="lg"
            className="mb-8 justify-center print:hidden"
          />
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
            <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-brand">
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
            <p className="mb-4 mt-4 text-lg font-bold text-brand-dark">
              {mod.title}
            </p>
            <p className="text-sm text-ink-soft">
              Completed on {completedDate}
            </p>
            <p className="mt-5 text-xs text-ink-soft">
              itsnotgossip.org · Registered Charity No. 1214504
            </p>
          </div>

          <div className="mt-6 flex justify-center print:hidden">
            <DownloadCertificateButton
              href={`/modules/${slug}/certificate/download`}
            />
          </div>
        </div>

        <SiteFooter />
      </main>

      <QuickExit />
    </div>
  );
}
