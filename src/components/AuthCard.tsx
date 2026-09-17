import Image from "next/image";
import Link from "next/link";

export function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <Link href="/" className="mb-8">
        <Image
          src="/logo.png"
          alt="It's Not Gossip"
          width={110}
          height={94}
          priority
        />
      </Link>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_2px_14px_rgba(70,45,115,0.1)]">
        <h1 className="mb-6 text-2xl font-extrabold text-brand">{title}</h1>
        {children}
      </div>
    </main>
  );
}

export const inputClass =
  "w-full rounded-xl border-2 border-brand-soft px-4 py-2.5 text-ink outline-none transition focus:border-brand placeholder:text-ink-soft/60";

export const labelClass = "mb-1.5 block text-sm font-bold text-brand-deep";

export const primaryBtnClass =
  "w-full rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";
