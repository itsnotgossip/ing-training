// Shared Tailwind class strings.
//
// These live in a plain module rather than in a component file so that both
// server and client components can import them. Exporting a constant from a
// "use client" file and importing it into a server component hands back a
// client reference stub, not the string.

export const inputClass =
  "w-full rounded-xl border-2 border-brand-soft px-4 py-2.5 text-ink outline-none transition focus:border-brand placeholder:text-ink-soft/60";

export const labelClass = "mb-1.5 block text-sm font-bold text-brand-deep";

// Full-width purple button used inside forms.
export const primaryBtnClass =
  "w-full cursor-pointer rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand";

// Pink pill used for calls to action across the site.
export const pillBtnClass =
  "inline-flex cursor-pointer items-center justify-center rounded-full bg-pink px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-pink-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-pink";

// Purple pill, the counterpart to pillBtnClass for secondary/primary actions
// outside the auth forms.
export const brandPillBtnClass =
  "inline-flex cursor-pointer items-center justify-center rounded-full bg-brand px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand";

// The one white box used for module content, quiz questions, surveys and the
// dashboard cards, so every panel on the site shares a border and shadow.
export const cardClass =
  "rounded-2xl border-2 border-lav-deep bg-white shadow-[0_2px_10px_rgba(70,45,115,0.08)]";
