import { RAMP } from "@/lib/impact/palette";

export type FunnelStage = { label: string; value: number; note: string };

// Three stages in a fixed order, so the colour carries that order: one hue,
// light to dark. Bars are capped well under the height of their band, so the
// leftover space is air rather than more ink.

export function Funnel({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(...stages.map((s) => s.value), 1);

  return (
    <ul className="m-0 list-none space-y-6 p-0">
      {stages.map((stage, i) => {
        const pct = (stage.value / max) * 100;
        const share = Math.round((stage.value / max) * 100);
        return (
          <li key={stage.label}>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="font-bold text-brand-deep">{stage.label}</span>
              <span className="text-sm text-ink-soft">{stage.note}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-5 flex-1 overflow-hidden rounded-full bg-lav">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: RAMP[i] ?? RAMP[RAMP.length - 1],
                  }}
                  title={`${stage.label}: ${stage.value.toLocaleString("en-GB")} people, ${share}% of those who registered`}
                />
              </div>
              <span className="w-20 shrink-0 text-right text-lg font-bold tabular-nums text-brand">
                {stage.value.toLocaleString("en-GB")}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
