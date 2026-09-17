"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-pink px-8 py-3 font-extrabold text-white transition hover:bg-pink-dark cursor-pointer"
    >
      Print / save as PDF
    </button>
  );
}
