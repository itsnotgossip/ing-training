import { cardClass } from "@/lib/ui";

/**
 * A single headline number. Proportional figures rather than tabular, because
 * tabular digits make a large standalone number look loose.
 */
export function StatTile({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note?: string;
}) {
  return (
    <div className={`${cardClass} p-6`}>
      <p className="text-4xl font-bold leading-none text-brand">{value}</p>
      <p className="mt-3 font-bold leading-snug text-brand-deep">{label}</p>
      {note && (
        <p className="mt-1 text-sm leading-snug text-ink-soft">{note}</p>
      )}
    </div>
  );
}
