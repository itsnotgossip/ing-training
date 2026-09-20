"use client";

import { useRef } from "react";
import { renderInline } from "@/components/Rich";
import { ChevronDownIcon, CrossIcon } from "@/components/icons";
import { brandPillBtnClass, cardClass } from "@/lib/ui";

// A tile whose extra detail opens in a modal rather than expanding in place,
// so the tiles around it keep their size. The whole tile is the trigger.
// Uses the native dialog element: Escape closes it and focus stays inside.
export function ExpandableTile({
  title,
  body,
  more,
}: {
  title?: string;
  body: string;
  more: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = title ?? body;

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className={`${cardClass} cursor-pointer p-5 text-left outline-none transition hover:border-brand-soft hover:shadow-[0_4px_16px_rgba(70,45,115,0.12)] focus-visible:border-brand`}
      >
        {title && (
          <span className="mb-1 block font-bold text-brand-dark">{title}</span>
        )}
        <span className="block text-sm leading-relaxed text-ink">
          {renderInline(body)}
        </span>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-pink-dark">
          Learn more
          <ChevronDownIcon className="h-3.5 w-3.5 -rotate-90" />
        </span>
      </button>

      <dialog
        ref={ref}
        // A click on the backdrop lands on the dialog itself, not its content.
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border-2 border-lav-deep bg-white p-0 text-ink shadow-[0_8px_40px_rgba(70,45,115,0.25)] backdrop:bg-brand-deep/60"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold leading-snug text-brand">
              {renderInline(heading)}
            </h3>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="-mr-2 -mt-2 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft transition hover:bg-lav hover:text-brand"
            >
              <CrossIcon className="h-4 w-4" />
            </button>
          </div>
          {title && (
            <p className="mt-3 leading-relaxed">{renderInline(body)}</p>
          )}
          <p className="mt-4 border-t-2 border-lav-deep pt-4 leading-relaxed">
            {renderInline(more)}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className={brandPillBtnClass}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
