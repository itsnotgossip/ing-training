// Pale clock-and-time label, used on the dashboard module card and in the
// module hero banner.
export function ModuleMinutes({
  minutes,
  className = "",
}: {
  minutes: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-bold text-ink-soft ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      {minutes} mins
    </span>
  );
}
