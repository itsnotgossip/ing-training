import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Faq } from "@/components/Faq";
import { LoginForm } from "@/components/LoginForm";
import { pillBtnClass } from "@/lib/ui";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MODULES } from "@/lib/modules";

const MODULE_COUNT = MODULES.length;

const USPS = [
  {
    icon: "/icons/advice-white.svg",
    title: "Made for salons",
    body: "Built around real salon conversations, disclosures and survivor stories.",
  },
  {
    icon: "/icons/certificate-white.svg",
    title: "Certificate included",
    body: "Finish a module and download a certificate for your salon to display.",
  },
  {
    icon: "/icons/friendly-white.svg",
    title: "By It's Not Gossip",
    body: "Created by the charity turning everyday salon conversations into lifelines.",
  },
];

const LEARN = [
  "What domestic abuse is, and the forms it takes",
  "The signs you might notice in a client",
  "How survivors really disclose, and how to leave the door open",
  "What to do (and what not to do) when someone opens up",
  "Where to signpost someone for help, nationally and locally",
  "How to look after your own wellbeing",
];

const FAQS = [
  {
    question: "Who is the training for?",
    answer:
      "Our training is designed for everyone working within the hair and beauty industry, including hairdressers, barbers, beauty therapists and nail technicians. Anyone in a salon setting who builds trusting relationships with clients can benefit from learning how to recognise the signs of domestic abuse and how to respond safely and confidently.",
  },
  {
    question: "Will the training teach me how to intervene?",
    answer:
      "No. Our training is not about salon professionals stepping in or intervening directly. It focuses on recognising the signs of abuse, listening with empathy and knowing how to signpost clients to specialist support services when it\u2019s safe and appropriate to do so.",
  },
  {
    question: "How can I bring It\u2019s Not Gossip to my salon?",
    answer:
      "We\u2019re currently developing our training and resources and would love to hear from salon owners and professionals who\u2019d like to be involved. Get in touch to register your interest and find out more about upcoming sessions and opportunities to take part.",
  },
  {
    question: "What format will the training be in?",
    answer:
      "We\u2019re developing an accessible online training resource, guided by feedback from salon professionals. In time, we hope to offer a combination of online learning, in-person sessions and practical materials to suit different needs. If you\u2019d like to share your thoughts or be involved in shaping our approach, we\u2019d love to hear from you.",
  },
];

export default async function Home() {
  // The landing page is public, but stays useful when you are already signed
  // in: the header shows the account navigation and the hero card greets you
  // instead of asking you to log in again.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let account: {
    firstName?: string;
    salonName?: string;
    isAdmin?: boolean;
    completedCount: number;
  } | null = null;

  if (user) {
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
        .not("completed_at", "is", null),
    ]);
    account = {
      firstName: profile?.full_name?.split(" ")[0],
      salonName: profile?.salon_name ?? undefined,
      isAdmin: profile?.is_admin ?? undefined,
      completedCount: (progress ?? []).length,
    };
  }

  const ctaHref = account ? "/dashboard" : "/register";
  const ctaLabel = account ? "Go to my training" : "Start your free training";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader user={account ? { isAdmin: account.isAdmin } : undefined} />

      <main className="flex-1">
        {/* Hero: same soft grey-to-white gradient band as itsnotgossip.org */}
        <section className="hero-gradient py-10 sm:py-14">
          <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-3 text-sm font-bold uppercase text-pink">
                Free training for salon professionals
              </p>
              <h1 className="mb-5 text-4xl font-bold leading-tight text-balance text-brand sm:text-5xl">
                It&apos;s Not Gossip Training Hub
              </h1>
              <p className="mb-4 text-lg leading-snug text-ink">
                Your clients talk to you like no one else. This is where salon
                and beauty professionals learn to recognise the signs of
                domestic abuse and respond with compassion.
              </p>
              <p className="mb-6 text-base leading-relaxed text-ink">
                Work through the modules online at your own pace, in short
                sessions that fit around the salon. Finish one and download a
                certificate for you and your salon to display.
              </p>
              <Link href={ctaHref} className={pillBtnClass}>
                {ctaLabel}
              </Link>
            </div>

            <div className="w-full max-w-md justify-self-center lg:justify-self-end">
              <div className="rounded-2xl bg-white p-8 shadow-[0_2px_14px_rgba(70,45,115,0.1)]">
                {account ? (
                  <>
                    <p className="mb-1 text-sm font-bold uppercase text-pink">
                      You are logged in as
                    </p>
                    <h2 className="text-2xl font-bold text-brand">
                      {account.firstName ?? "your account"}
                    </h2>
                    {account.salonName && (
                      <p className="mt-1 text-sm text-ink-soft">
                        {account.salonName}
                      </p>
                    )}
                    <div className="mt-6 rounded-xl bg-lav px-5 py-4 text-center">
                      <p className="text-3xl font-bold text-brand">
                        {account.completedCount}
                        <span className="text-ink-soft">
                          {" / "}
                          {MODULE_COUNT}
                        </span>
                      </p>
                      <p className="mt-1 text-sm font-bold uppercase tracking-wide text-ink-soft">
                        Modules completed
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className={`${pillBtnClass} mt-6 w-full`}
                    >
                      Go to my dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="mb-6 text-2xl font-bold text-brand">
                      Log in
                    </h2>
                    <Suspense>
                      <LoginForm idPrefix="hero" />
                    </Suspense>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* USP strip */}
        <section className="bg-brand py-6 text-white">
          <div className="site-container grid gap-8 sm:grid-cols-3 sm:gap-6">
            {USPS.map((u) => (
              <div key={u.title} className="flex items-start gap-4">
                <Image
                  src={u.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 object-contain"
                />
                <div>
                  <h2 className="mb-1 text-xl font-bold leading-tight">
                    {u.title}
                  </h2>
                  <p className="text-base leading-snug">{u.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What you'll learn: illustration left, content right */}
        <section className="py-16 sm:py-20">
          <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Image
              src="/salon-illustration.png"
              alt="A stylist drying a client's hair in front of a salon mirror"
              width={1000}
              height={804}
              className="mx-auto w-full max-w-lg lg:max-w-none"
            />
            <div>
              <h2 className="mb-6 text-3xl font-bold leading-tight text-brand sm:text-4xl">
                What you&apos;ll learn
              </h2>
              <p className="mb-6 text-base leading-relaxed text-ink">
                Salon professionals are in a unique position. Clients share
                things in the chair that they don&apos;t tell anyone else, which
                means you&apos;re often well-placed to notice when something
                isn&apos;t right. This module gives you the confidence to
                listen, support and signpost safely.
              </p>
              <ul className="mb-8 space-y-3 text-base text-ink">
                {LEARN.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true">💜</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={ctaHref} className={pillBtnClass}>
                {ctaLabel}
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs: same grey band and white panels as the homepage */}
        <section className="hero-gradient py-16">
          <div className="site-container">
            <h2 className="mb-8 text-center text-3xl font-bold text-brand">
              Frequently Asked Questions
            </h2>
            <Faq items={FAQS} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
