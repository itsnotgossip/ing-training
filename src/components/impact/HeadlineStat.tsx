/**
 * A headline figure, styled like the stat boxes on itsnotgossip.org: a soft
 * shadowed card, the number large in pink, and a short uppercase label under
 * it.
 *
 * The number uses pink-dark rather than the lighter brand pink. At 2.93:1
 * against white the lighter one sits just under the 3:1 a large figure needs
 * to be legible, and this is the number people are meant to read.
 *
 * Proportional figures rather than tabular, because tabular digits give every
 * numeral the width of a zero and make a large standalone number look loose.
 */
export function HeadlineStat({
  value,
  suffix,
  label,
}: {
  value: string;
  /** Small unit trailing the figure, as in the "m" of "10.4m". */
  suffix?: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-linear-to-br from-white to-lav px-5 py-7 text-center shadow-[5px_5px_20px_rgba(14,14,14,0.08)]">
      <p className="text-4xl font-bold leading-none text-pink-dark sm:text-5xl">
        {value}
        {suffix && <span className="text-2xl sm:text-3xl">{suffix}</span>}
      </p>
      <p className="mt-4 text-xs font-bold uppercase leading-snug tracking-wide text-balance text-brand-deep">
        {label}
      </p>
    </div>
  );
}
