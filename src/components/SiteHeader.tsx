import Link from "next/link";
import { AccountMenu } from "@/components/AccountMenu";
import { HelplineBar } from "@/components/HelplineBar";
import { LogoLockup } from "@/components/LogoLockup";
import { QuickExit } from "@/components/QuickExit";

export type HeaderUser = {
  isAdmin?: boolean;
};

// The one header used across the site, laid out like itsnotgossip.org: the
// sticky helpline bar on top, then a white row with the logo lockup on the
// left and navigation on the right, all inside the site container.
//
// Pass `user` on logged-in pages to swap the public navigation for the
// account navigation. The fixed Exit Site button is rendered here too, so
// every page gets it.
//
// The sticky bar is a sibling of <header>, not a child, because a sticky
// element only sticks within its parent. As a direct child of the page
// wrapper it stays put for the whole page.
export function SiteHeader({ user }: { user?: HeaderUser }) {
  return (
    <>
      <HelplineBar />
      <header className="bg-white print:hidden">
        <div className="site-container flex h-[72px] items-center gap-4 sm:h-[100px]">
          <LogoLockup href={user ? "/dashboard" : "/"} hideTextOnMobile />

          {user ? (
            <nav className="ml-auto flex items-center gap-4 text-base font-semibold text-ink sm:gap-6">
              <Link href="/dashboard" className="transition hover:text-pink">
                <span className="sm:hidden">Modules</span>
                <span className="hidden sm:inline">My modules</span>
              </Link>
              {user.isAdmin && (
                <Link href="/admin" className="transition hover:text-pink">
                  Admin
                </Link>
              )}
              <AccountMenu signedIn />
            </nav>
          ) : (
            <nav className="ml-auto flex items-center gap-5 text-base font-semibold text-ink sm:gap-6">
              <a
                href="https://www.itsnotgossip.org"
                className="transition hover:text-pink"
              >
                Main website
              </a>
              <AccountMenu signedIn={false} />
            </nav>
          )}
        </div>
      </header>
      <QuickExit />
    </>
  );
}

// Full-width soft grey-to-white gradient band used for page intros, matching
// the hero on itsnotgossip.org.
export function HeroBand({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`hero-gradient py-10 sm:py-14 print:hidden ${className}`}
    >
      <div className="site-container">{children}</div>
    </section>
  );
}
