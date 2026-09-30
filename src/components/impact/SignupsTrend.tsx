import type { MonthPoint } from "@/lib/impact/data";
import { GRID, SERIES_BEFORE } from "@/lib/impact/palette";

// One series over time, so a line with a soft wash underneath rather than a
// second colour. Only the final point is labelled: the axis and the table
// carry the rest, and a number on every point goes unread.
//
// The plot is an SVG stretched to fill its box, but every piece of text and
// every dot is HTML layered on top. Text inside a scaled viewBox shrinks with
// the container, which on a phone lands around five pixels; this way labels
// keep their real size at any width.

/** "2026-03" -> "Mar" */
function shortMonth(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short" });
}

/** "2026-03" -> "March 2026" */
export function longMonth(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

/** Round the top of the scale up to something a person would choose. */
function niceMax(value: number): number {
  if (value <= 5) return 5;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = magnitude / 2;
  return Math.ceil(value / step) * step;
}

export function SignupsTrend({ points }: { points: MonthPoint[] }) {
  if (points.length < 2) {
    return (
      <p className="rounded-xl bg-lav px-5 py-4 text-sm text-ink-soft">
        Not enough months of data yet to draw a trend.
      </p>
    );
  }

  const max = niceMax(Math.max(...points.map((p) => p.signups)));
  const last = points[points.length - 1];

  // Percentages, so the same numbers drive the SVG path and the HTML overlay.
  const px = (i: number) => (i / (points.length - 1)) * 100;
  const py = (v: number) => 100 - (v / max) * 100;

  const line = points.map((p, i) => `${px(i)},${py(p.signups)}`).join(" ");
  const area = `0,100 ${line} 100,100`;

  return (
    <div>
      <div className="flex gap-3">
        <div className="flex h-44 shrink-0 flex-col justify-between py-0 text-right text-xs font-bold tabular-nums text-ink-soft">
          <span>{max}</span>
          <span>{max / 2}</span>
          <span>0</span>
        </div>

        <div className="relative h-44 flex-1">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
            role="img"
            aria-label={`New sign-ups each month, from ${longMonth(points[0].month)} to ${longMonth(last.month)}. Highest month ${Math.max(...points.map((p) => p.signups))}.`}
          >
            {[0, 50, 100].map((yPct) => (
              <line
                key={yPct}
                x1="0"
                x2="100"
                y1={yPct}
                y2={yPct}
                stroke={GRID}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <polygon points={area} fill={SERIES_BEFORE} fillOpacity={0.1} />
            <polyline
              points={line}
              fill="none"
              stroke={SERIES_BEFORE}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Dots and the end label sit in HTML so they stay round and legible. */}
          {points.map((p, i) => (
            <span
              key={p.month}
              title={`${longMonth(p.month)}: ${p.signups} new sign-ups`}
              className="absolute block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
              style={{
                left: `${px(i)}%`,
                top: `${py(p.signups)}%`,
                background: SERIES_BEFORE,
              }}
            />
          ))}
          <span
            className="absolute -translate-x-full translate-y-[-1.6rem] pr-1 text-sm font-bold text-brand-deep"
            style={{ left: "100%", top: `${py(last.signups)}%` }}
          >
            {last.signups}
          </span>
        </div>
      </div>

      <div className="mt-2 flex pl-9">
        <div className="flex flex-1 justify-between text-xs font-semibold text-ink-soft">
          {points.map((p) => (
            <span key={p.month}>{shortMonth(p.month)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
