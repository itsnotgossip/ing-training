import type { Block } from "@/lib/modules/types";
import { Rich, renderInline } from "@/components/Rich";

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "lead":
      return (
        <div className="mb-4 text-center text-lg font-bold text-brand-dark">
          <Rich text={block.body} />
        </div>
      );

    case "card":
      return (
        <div
          className={`mb-4 rounded-2xl p-6 shadow-[0_2px_10px_rgba(70,45,115,0.08)] ${
            block.variant === "purple"
              ? "bg-brand text-white"
              : "bg-white text-ink"
          } ${block.align === "center" ? "text-center" : ""}`}
        >
          <Rich text={block.body} className="mb-3 last:mb-0" />
        </div>
      );

    case "tiles":
      return (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((item, i) =>
            item.more ? (
              <details
                key={i}
                className="group rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(70,45,115,0.08)] transition [&_summary]:list-none"
              >
                <summary className="cursor-pointer">
                  {item.emoji && (
                    <span className="mb-2 block text-2xl">{item.emoji}</span>
                  )}
                  {item.title && (
                    <h3 className="mb-1 font-extrabold text-brand-dark">
                      {item.title}
                    </h3>
                  )}
                  <p className="text-sm text-ink-soft">
                    {renderInline(item.body)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-pink-dark">
                    <span className="group-open:hidden">Tap to learn more</span>
                    <span className="hidden group-open:inline">Show less</span>
                    <span className="transition group-open:rotate-45">＋</span>
                  </span>
                </summary>
                <p className="mt-3 border-t border-lav-deep pt-3 text-sm text-ink">
                  {renderInline(item.more)}
                </p>
              </details>
            ) : (
              <div
                key={i}
                className="rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(70,45,115,0.08)]"
              >
                {item.emoji && (
                  <span className="mb-2 block text-2xl">{item.emoji}</span>
                )}
                {item.title && (
                  <h3 className="mb-1 font-extrabold text-brand-dark">
                    {item.title}
                  </h3>
                )}
                <p className="text-sm text-ink-soft">
                  {renderInline(item.body)}
                </p>
              </div>
            )
          )}
        </div>
      );

    case "note":
      return (
        <div
          className={`mb-4 rounded-r-xl border-l-4 border-pink bg-pink-soft px-5 py-4 text-[0.95rem] ${
            block.align === "center" ? "text-center" : ""
          }`}
        >
          <Rich text={block.body} />
        </div>
      );

    case "quote":
      return (
        <div
          className={`mb-4 rounded-2xl p-7 shadow-[0_2px_10px_rgba(70,45,115,0.08)] ${
            block.variant === "purple" ? "bg-brand" : "bg-white"
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
              block.variant === "purple" ? "text-[#f0c3e0]" : "text-pink-dark"
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
              <div
                key={i}
                className="rounded-2xl bg-brand p-6 text-center text-white"
              >
                <span className="block text-3xl font-extrabold leading-tight">
                  {s.n}
                </span>
                <span className="mt-1 block text-sm text-[#ded4ec]">
                  {s.d}
                </span>
              </div>
            ))}
          </div>
          {block.source && (
            <p className="text-center text-xs text-ink-soft">{block.source}</p>
          )}
        </div>
      );

    case "numbered":
      return (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-5 text-center shadow-[0_2px_8px_rgba(70,45,115,0.08)]"
            >
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-pink font-extrabold text-white">
                {i + 1}
              </div>
              <h3 className="mb-1 font-extrabold text-brand-dark">
                {item.title}
              </h3>
              <p className="text-sm text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      );

    case "hearRespond":
      return (
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {block.pairs.map((pair, i) => (
            <div key={i} className="contents">
              <div className="rounded-xl bg-white px-5 py-4 font-semibold italic text-brand-dark shadow-[0_2px_8px_rgba(70,45,115,0.08)]">
                “{pair.hear}”
              </div>
              <div className="rounded-xl bg-brand px-5 py-4 text-white">
                “{pair.respond}”
                <em className="mt-1 block text-xs not-italic text-[#ded4ec]">
                  {pair.why}
                </em>
              </div>
            </div>
          ))}
        </div>
      );

    case "details":
      return (
        <details className="mb-4 rounded-2xl bg-white px-6 py-5 shadow-[0_2px_8px_rgba(70,45,115,0.08)]">
          <summary className="cursor-pointer font-extrabold text-brand">
            {block.summary}
          </summary>
          {block.paragraphs.map((p, i) => (
            <p key={i} className="mt-3 text-[0.95rem]">
              {renderInline(p)}
            </p>
          ))}
        </details>
      );
  }
}
