export type FaqItem = { question: string; answer: string };

// Accordion built on native <details>, styled like the FAQ panels on
// itsnotgossip.org: white rounded cards with a soft shadow and a chevron that
// flips when open. No client JavaScript needed.
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-xl bg-white shadow-[5px_5px_20px_rgba(14,14,14,0.1)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-8 py-5 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 8l5 5 5-5" />
            </svg>
          </summary>
          <div className="px-8 pb-8 text-sm leading-relaxed text-ink">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
