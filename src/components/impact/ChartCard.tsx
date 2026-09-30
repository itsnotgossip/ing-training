import { cardClass } from "@/lib/ui";
import { ChevronDownIcon } from "@/components/icons";

export type LegendItem = { label: string; colour: string };

/**
 * Shared frame for every chart on the impact page: a heading, the plot, an
 * optional legend, and a table of the same numbers behind a disclosure.
 *
 * The table is not decoration. A chart that can only be read by eye excludes
 * anyone using a screen reader, and colour alone should never be the only way
 * to tell two series apart.
 */
export function ChartCard({
  title,
  subtitle,
  legend,
  children,
  table,
  footnote,
}: {
  title: string;
  subtitle?: string;
  legend?: LegendItem[];
  children: React.ReactNode;
  table: React.ReactNode;
  footnote?: string;
}) {
  return (
    <figure className={`${cardClass} m-0 flex h-full flex-col p-6 sm:p-8`}>
      <figcaption className="mb-6">
        <h3 className="text-xl font-bold leading-snug text-brand">{title}</h3>
        {subtitle && (
          <p className="mt-2 max-w-2xl leading-relaxed text-ink">{subtitle}</p>
        )}
        {legend && legend.length > 1 && (
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {legend.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-sm font-bold text-ink"
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: item.colour }}
                />
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </figcaption>

      {children}

      {footnote && <p className="mt-4 text-xs text-ink-soft">{footnote}</p>}

      <div className="h-5" aria-hidden="true" />

      <details className="group mt-auto border-t-2 border-lav-deep pt-4 [&_summary::-webkit-details-marker]:hidden [&_summary]:list-none">
        <summary className="flex cursor-pointer items-center justify-between gap-4 text-xs font-bold uppercase tracking-wide text-pink-dark">
          View the numbers
          <ChevronDownIcon className="h-3.5 w-3.5 transition group-open:rotate-180" />
        </summary>
        <div className="mt-4 overflow-x-auto">{table}</div>
      </details>
    </figure>
  );
}

/** Plain table styling, shared by every chart's table view. */
export function DataTable({
  head,
  rows,
}: {
  head: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr>
          {head.map((h, i) => (
            <th
              key={h}
              scope="col"
              className={`border-b-2 border-lav-deep pb-2 pr-4 font-bold text-brand-deep ${
                i > 0 ? "text-right tabular-nums" : ""
              }`}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                className={`border-b border-lav-deep py-2 pr-4 text-ink ${
                  ci > 0 ? "text-right tabular-nums" : ""
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
