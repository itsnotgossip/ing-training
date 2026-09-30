/**
 * A headline number in the page banner. No box: these sit in a row under the
 * introduction, separated by a rule rather than by borders.
 *
 * Proportional figures rather than tabular, because tabular digits give every
 * numeral the width of a zero and make a large standalone number look loose.
 */
export function HeadlineStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-4xl font-bold leading-none text-brand sm:text-5xl">
        {value}
      </p>
      <p className="mt-2.5 font-bold leading-snug text-brand-deep">{label}</p>
    </div>
  );
}
