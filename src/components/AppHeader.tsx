import Image from "next/image";
import Link from "next/link";
import { QuickExit } from "@/components/QuickExit";
import { LogoutButton } from "@/components/LogoutButton";

export function AppHeader({
  firstName,
  isAdmin,
}: {
  firstName?: string;
  isAdmin?: boolean;
}) {
  return (
    <header className="sticky top-0 z-50 flex items-center gap-4 bg-white px-5 py-2.5 shadow-[0_2px_8px_rgba(70,45,115,0.08)] print:hidden">
      <Link href="/dashboard" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="It's Not Gossip"
          width={46}
          height={39}
          priority
        />
        <span className="hidden text-sm font-bold text-brand sm:block">
          Training
        </span>
      </Link>
      <div className="ml-auto flex items-center gap-3">
        {isAdmin && (
          <Link
            href="/admin"
            className="text-sm font-bold text-brand hover:underline"
          >
            Admin
          </Link>
        )}
        {firstName && (
          <span className="hidden text-sm text-ink-soft sm:block">
            Hi {firstName}
          </span>
        )}
        <LogoutButton />
        <QuickExit />
      </div>
    </header>
  );
}
