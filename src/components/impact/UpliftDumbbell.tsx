import type { Uplift } from "@/lib/impact/data";
import { SERIES_AFTER, SERIES_BEFORE } from "@/lib/impact/palette";

// A dumbbell: one row per question, a dot for the average score before the
// training and a dot for the score after, joined by a bar. The length of that
// bar is the improvement, which is the thing worth seeing.
//
// Built from HTML rather than SVG so the question labels wrap at narrow widths
// and the numbers stay selectable, rather than being clipped by a fixed plot.

const MAX_SCORE = 10;
const TICKS = [0, 2, 4, 6, 8, 10];

export function UpliftDumbbell({ items }: { items: Uplift[] }) {
  return (
    <div>
      <ul className="m-0 list-none space-y-7 p-0">
        {items.map((item) => {
          const gain = item.after - item.before;
          const beforePct = (item.before / MAX_SCORE) * 100;
          const afterPct = (item.after / MAX_SCORE) * 100;
          return (
            <li key={item.id}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="font-bold text-brand-deep">{item.label}</span>
                <span className="text-sm font-bold text-ok">
                  +{gain.toFixed(1)} points
                </span>
              </div>

              <div
                className="relative h-5"
                title={`${item.label}: ${item.before.toFixed(1)} before, ${item.after.toFixed(1)} after`}
              >
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-lav-deep" />
                <div
                  className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
                  style={{
                    left: `${beforePct}%`,
                    width: `${afterPct - beforePct}%`,
                    background: SERIES_BEFORE,
                    opacity: 0.35,
                  }}
                />
                <span
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
                  style={{ left: `${beforePct}%`, background: SERIES_BEFORE }}
                />
                <span
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
                  style={{ left: `${afterPct}%`, background: SERIES_AFTER }}
                />
              </div>

              <div className="mt-1.5 flex flex-wrap gap-x-5 text-xs font-bold text-ink-soft">
                <span>
                  Before{" "}
                  <span className="tabular-nums text-ink">
                    {item.before.toFixed(1)}
                  </span>
                </span>
                <span>
                  After{" "}
                  <span className="tabular-nums text-ink">
                    {item.after.toFixed(1)}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="relative mt-6 h-5 border-t-2 border-lav-deep">
        {TICKS.map((tick) => (
          <span
            key={tick}
            className="absolute top-1 -translate-x-1/2 text-xs font-bold tabular-nums text-ink-soft"
            style={{ left: `${(tick / MAX_SCORE) * 100}%` }}
          >
            {tick}
          </span>
        ))}
      </div>
      <p className="mt-5 text-center text-xs text-ink-soft">
        Average score out of 10
      </p>
    </div>
  );
}
