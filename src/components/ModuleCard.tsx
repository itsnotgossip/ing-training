import Link from "next/link";
import { ModuleMinutes } from "@/components/ModuleMinutes";
import { CertificateIcon } from "@/components/icons";

export type ModuleCardProps = {
  title: string;
  description: string;
  minutes: number;
  /** Percentage through the module. Ignored unless the status is in-progress. */
  percent?: number;
  status: "not-started" | "in-progress" | "completed";
  /** Omit to render a non-interactive card, used for the sample card. */
  href?: string;
  certificateHref?: string;
};

const STATUS = {
  "not-started": { label: "Not started", cls: "bg-lav-deep text-brand" },
  "in-progress": { label: "In progress", cls: "bg-pink-soft text-pink-dark" },
  completed: { label: "Completed", cls: "bg-ok-bg text-ok" },
} as const;

export const statusPillCls =
  "inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide";

const actionCls =
  "rounded-full bg-brand px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark";
const certCls =
  "relative z-10 inline-flex items-center gap-2 rounded-full bg-pink px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-pink-dark";
// On a completed card the certificate is the thing people want, so revisiting
// the module drops to a quiet text link rather than a second button.
const revisitCls =
  "text-xs font-bold uppercase tracking-wide text-brand underline decoration-brand-soft underline-offset-4 transition hover:text-brand-dark hover:decoration-brand";
// Turns whichever action carries it into a whole-card click target.
const stretchCls =
  "after:absolute after:inset-0 after:rounded-2xl after:content-['']";

export function ModuleCard({
  title,
  description,
  minutes,
  percent = 0,
  status,
  href,
  certificateHref,
}: ModuleCardProps) {
  const badge = STATUS[status];
  // An in-progress module reports how far through it the user has got, so the
  // pill carries the number and no separate progress bar is needed.
  const badgeLabel =
    status === "in-progress" ? `${percent}% complete` : badge.label;
  const actionLabel = status === "in-progress" ? "Continue" : "Start module";

  return (
    // When href is set the whole card is the link: the primary action carries
    // an inset ::after overlay, so there is still only one link.
    <div className="relative flex flex-col rounded-2xl border-2 border-lav-deep bg-white p-6 shadow-[0_2px_10px_rgba(70,45,115,0.08)] transition focus-within:border-brand hover:border-brand-soft hover:shadow-[0_4px_16px_rgba(70,45,115,0.12)] sm:p-8">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <span className={`${statusPillCls} ${badge.cls}`}>{badgeLabel}</span>
        <ModuleMinutes minutes={minutes} />
      </div>

      <h3 className="text-2xl font-bold leading-tight text-brand">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-ink">{description}</p>

      <div className="mt-auto pt-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {status === "completed" ? (
            <>
              {certificateHref ? (
                <Link
                  href={certificateHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={certCls}
                >
                  <CertificateIcon />
                  View certificate
                </Link>
              ) : (
                <span className={certCls}>
                  <CertificateIcon />
                  View certificate
                </span>
              )}

              {href ? (
                <Link href={href} className={`${revisitCls} ${stretchCls}`}>
                  Revisit module
                </Link>
              ) : (
                <span className={revisitCls}>Revisit module</span>
              )}
            </>
          ) : href ? (
            <Link href={href} className={`${actionCls} ${stretchCls}`}>
              {actionLabel}
            </Link>
          ) : (
            <span className={actionCls}>{actionLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}
