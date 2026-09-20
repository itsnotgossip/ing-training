import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DetailsForm, PasswordForm } from "@/components/AccountForms";
import { HeroBand, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "Settings · It's Not Gossip Training" };

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border-2 border-lav-deep bg-white p-6 shadow-[0_2px_10px_rgba(70,45,115,0.08)] sm:p-8">
      <h2 className="text-xl font-bold text-brand">{title}</h2>
      <p className="mb-6 mt-1 text-sm text-ink-soft">{description}</p>
      {children}
    </section>
  );
}

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, salon_name, is_admin")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={{ isAdmin: profile?.is_admin }} />

      <main className="flex-1">
        <HeroBand>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase text-pink">
              Your account
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-none text-balance text-brand sm:text-5xl">
              Settings
            </h1>
            <p className="text-lg leading-snug text-ink">
              Update the name that appears on your certificates, your salon
              details, and your password.
            </p>
          </div>
        </HeroBand>

        <div className="site-container py-12 sm:py-16">
          <div className="mx-auto grid max-w-3xl gap-6">
            <Card
              title="Your details"
              description="Your name is printed on every certificate you download, including ones you have already earned."
            >
              <DetailsForm
                initialFullName={profile?.full_name ?? ""}
                initialSalonName={profile?.salon_name ?? ""}
              />
            </Card>

            <Card
              title="Email address"
              description="The address you log in with."
            >
              <p className="rounded-xl bg-lav px-4 py-3 font-semibold text-brand-deep">
                {user.email}
              </p>
              <p className="mt-3 text-sm text-ink-soft">
                To change the address on your account, email{" "}
                <strong>info@itsnotgossip.org</strong> and we will update it
                for you.
              </p>
            </Card>

            <Card
              title="Password"
              description="Choose a new password. You stay logged in on this device."
            >
              <PasswordForm />
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
