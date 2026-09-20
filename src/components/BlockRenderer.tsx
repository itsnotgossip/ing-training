import type { Block } from "@/lib/modules/types";
import { Rich, renderInline } from "@/components/Rich";
import { ChevronDownIcon } from "@/components/icons";
import { ExpandableTile } from "@/components/ExpandableTile";
import { cardClass } from "@/lib/ui";

// Purple counterpart to cardClass for the emphasised variants.
const purpleCardClass =
  "rounded-2xl bg-brand text-white shadow-[0_2px_10px_rgba(70,45,115,0.08)]";

const tileTitleClass = "mb-1 font-bold text-brand-dark";
const tileBodyClass = "text-sm leading-relaxed text-ink";

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "lead":
      return (
        <div className="mb-5 text-lg font-bold leading-snug text-brand-dark">
          <Rich text={block.body} />
        </div>
      );

    case "card":
      return (
        <div
          className={`mb-4 p-6 ${
            block.variant === "purple"
              ? purpleCardClass
              : `${cardClass} text-ink`
          } ${block.align === "center" ? "text-center" : ""}`}
        >
          <Rich text={block.body} className="mb-3 leading-relaxed last:mb-0" />
        </div>
      );

    case "tiles":
      return (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item, i) =>
            item.more ? (
              <ExpandableTile
                key={i}
                title={item.title}
                body={item.body}
                more={item.more}
              />
            ) : (
              <div key={i} className={`${cardClass} p-5`}>
                {item.title && <h3 className={tileTitleClass}>{item.title}</h3>}
                <p className={tileBodyClass}>{renderInline(item.body)}</p>
              </div>
            ),
          )}
        </div>
      );

    case "note":
      return (
        <div className="mb-4 rounded-2xl border-2 border-pink-light bg-pink-soft px-5 py-4 leading-relaxed">
          <Rich text={block.body} />
        </div>
      );

    case "quote":
      return (
        <div
          className={`mb-4 p-7 ${
            block.variant === "purple" ? purpleCardClass : cardClass
          }`}
        >
          <blockquote
            className={`text-xl font-bold italic leading-relaxed ${
              block.variant === "purple" ? "text-white" : "text-brand-dark"
            }`}
          >
            “{block.text}”
          </blockquote>
          <cite
            className={`mt-3 block text-sm font-bold not-italic ${
              block.variant === "purple" ? "text-pink-light" : "text-pink-dark"
            }`}
          >
            {block.cite}
          </cite>
        </div>
      );

    case "stats":
      return (
        <div className="mb-4">
          <div className="mb-3 grid gap-3 sm:grid-cols-3">
            {block.items.map((s, i) => (
              <div key={i} className={`${purpleCardClass} p-6 text-center`}>
                <span className="block text-3xl font-bold leading-tight">
                  {s.n}
                </span>
                <span className="mt-1 block text-sm leading-snug text-white/85">
                  {s.d}
                </span>
              </div>
            ))}
          </div>
          {block.source && (
            <p className="text-xs text-ink-soft">{block.source}</p>
          )}
        </div>
      );

    case "numbered":
      return (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item, i) => (
            <div key={i} className={`${cardClass} p-5 text-center`}>
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-pink font-bold text-white">
                {i + 1}
              </div>
              <h3 className={tileTitleClass}>{item.title}</h3>
              <p className={tileBodyClass}>{item.body}</p>
            </div>
          ))}
        </div>
      );

    case "hearRespond":
      return (
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {block.pairs.map((pair, i) => (
            <div key={i} className="contents">
              <div
                className={`${cardClass} px-5 py-4 font-semibold italic leading-relaxed text-brand-dark`}
              >
                “{pair.hear}”
              </div>
              <div className={`${purpleCardClass} px-5 py-4 leading-relaxed`}>
                “{pair.respond}”
                <em className="mt-2 block text-xs not-italic leading-snug text-white/80">
                  {pair.why}
                </em>
              </div>
            </div>
          ))}
        </div>
      );

    case "details":
      return (
        <details
          className={`group mb-4 ${cardClass} transition open:border-brand-soft [&_summary::-webkit-details-marker]:hidden [&_summary]:list-none`}
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-bold text-brand">
            {block.summary}
            <ChevronDownIcon className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
          </summary>
          <div className="border-t-2 border-lav-deep px-6 pb-6 pt-4">
            {block.paragraphs.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-ink first:mt-0">
                {renderInline(p)}
              </p>
            ))}
          </div>
        </details>
      );
  }
}
