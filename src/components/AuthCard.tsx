import { HelplineBar } from "@/components/HelplineBar";
import { LogoLockup } from "@/components/LogoLockup";
import { QuickExit } from "@/components/QuickExit";
import { SiteFooter } from "@/components/SiteFooter";

// Layout for the sign-in, sign-up and password pages. Deliberately stripped
// back: no site header, just the sticky helpline bar above a full-height
// gradient that holds the card and the footer line.
export function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <HelplineBar />

      <main className="hero-gradient flex flex-1 flex-col">
        <div className="site-container flex flex-1 flex-col items-center justify-center py-12">
          <LogoLockup size="lg" className="mb-8" />
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_2px_14px_rgba(70,45,115,0.1)]">
            <h1 className="mb-6 text-2xl font-bold text-brand">{title}</h1>
            {children}
          </div>
        </div>

        <SiteFooter />
      </main>

      <QuickExit />
    </div>
  );
}

export { inputClass, labelClass, primaryBtnClass } from "@/lib/ui";
