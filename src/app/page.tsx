import Image from "next/image";
import Link from "next/link";
import { HelplineBar } from "@/components/HelplineBar";
import { QuickExit } from "@/components/QuickExit";
import { MODULES } from "@/lib/modules";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col pb-16">
      <header className="flex items-center gap-4 bg-white px-5 py-3 shadow-[0_2px_8px_rgba(70,45,115,0.08)]">
        <Image
          src="/logo.png"
          alt="It's Not Gossip"
          width={54}
          height={46}
          priority
        />
        <span className="hidden text-sm font-bold text-brand sm:block">
          Training
        </span>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border-2 border-brand-soft px-5 py-2 text-sm font-extrabold text-brand transition hover:border-brand"
          >
            Log in
          </Link>
          <QuickExit />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <section className="rounded-3xl bg-brand px-8 py-14 text-center text-white sm:px-14">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#f0c3e0]">
            Free training for salon professionals
          </p>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-5xl">
            Turning Conversations into Lifelines
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-[#ded4ec]">
            Your clients talk to you like no one else. Learn to recognise the
            signs of domestic abuse and respond with compassion, in around 20
            minutes.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-full bg-pink px-8 py-3.5 font-extrabold text-white transition hover:bg-pink-dark"
          >
            Start your free training
          </Link>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              emoji: "\u{1F4AC}",
              title: "Made for salons",
              body: "Built around real salon conversations, real disclosures and real stories from survivors.",
            },
            {
              emoji: "\u{1F4DC}",
              title: "Certificate included",
              body: "Finish the module and download a certificate for you and your salon to display.",
            },
            {
              emoji: "\u{1F49C}",
              title: "By It's Not Gossip",
              body: "Created by the charity turning everyday conversations into lifelines. Registered Charity No. 1214504.",
            },
          ].map((t) => (
            <div
              key={t.title}
              className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(70,45,115,0.08)]"
            >
              <span className="mb-2 block text-2xl">{t.emoji}</span>
              <h2 className="mb-1 font-extrabold text-brand-dark">{t.title}</h2>
              <p className="text-sm text-ink-soft">{t.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-2xl bg-white p-8 shadow-[0_2px_10px_rgba(70,45,115,0.08)]">
          <h2 className="mb-2 text-xl font-extrabold text-brand">
            What you'll learn
          </h2>
          <p className="mb-4 text-ink-soft">{MODULES[0].description}</p>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {[
              "What domestic abuse is, and the forms it takes",
              "The signs you might notice in a client",
              "How survivors really disclose, and how to leave the door open",
              "What to do (and what not to do) when someone opens up",
              "Where to signpost someone for help, nationally and locally",
              "How to look after your own wellbeing",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span>💜</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-center text-sm text-ink-soft">
          Questions? <strong>hello@itsnotgossip.org</strong> ·{" "}
          <a
            href="https://www.itsnotgossip.org"
            className="font-bold text-pink-dark hover:underline"
          >
            itsnotgossip.org
          </a>
        </p>
      </main>

      <HelplineBar />
    </div>
  );
}
