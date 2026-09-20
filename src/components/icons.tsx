// Small stroke icons that inherit the text colour. Kept together so the same
// glyph is used everywhere it appears.

type IconProps = { className?: string };

const base = {
  "aria-hidden": true as const,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Award rosette, used wherever a certificate is offered. */
export function CertificateIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14.5 7 22l5-2.5L17 22l-1.5-7.5" />
    </svg>
  );
}

/** Chevron for expandable panels; rotate it with group-open. */
export function ChevronDownIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** Tick, used inside a chosen or correct option. */
export function CheckIcon({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg {...base} strokeWidth={3} className={className}>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

/** Cross, used inside a wrong option. */
export function CrossIcon({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg {...base} strokeWidth={3} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
