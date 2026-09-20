import Image from "next/image";
import Link from "next/link";

const SIZES = {
  sm: { w: 46, h: 40, text: "text-base", pad: "pl-2.5", gap: "gap-2.5" },
  md: { w: 64, h: 56, text: "text-xl", pad: "pl-3", gap: "gap-3" },
  lg: { w: 88, h: 77, text: "text-2xl", pad: "pl-4", gap: "gap-4" },
} as const;

// The It's Not Gossip mark paired with the "training hub" wordmark, divided by
// a soft rule. Used in the site header, the module header and above the cards
// on the sign-in pages.
export function LogoLockup({
  href = "/",
  size = "md",
  hideTextOnMobile = false,
  className = "",
}: {
  href?: string;
  size?: keyof typeof SIZES;
  hideTextOnMobile?: boolean;
  className?: string;
}) {
  const s = SIZES[size];

  return (
    <Link
      href={href}
      className={`flex items-center ${s.gap} ${className}`}
      aria-label="It's Not Gossip Training Hub"
    >
      <Image
        src="/logo.png"
        alt=""
        width={s.w}
        height={s.h}
        priority
        className="shrink-0"
      />
      <span
        aria-hidden="true"
        className={`${hideTextOnMobile ? "hidden sm:flex" : "flex"} flex-col border-l-2 border-brand-soft ${s.pad} ${s.text} font-extrabold lowercase leading-none tracking-tight text-pink`}
      >
        <span>training</span>
        <span>hub</span>
      </span>
    </Link>
  );
}
