"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function UserIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  );
}

// Signed out: a plain round icon. Signed in: a box carrying the icon plus
// who you are, so on a shared or borrowed device it is obvious at a glance
// whose account you are looking at.
const iconOnlyClass =
  "flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand text-brand transition hover:bg-brand hover:text-white";
const boxClass =
  "flex items-center gap-2.5 rounded-full border-2 border-brand-soft py-1.5 pl-1.5 pr-2.5 text-left transition hover:border-brand hover:bg-lav sm:pr-4";

/**
 * Account control in the site header. Signed out it is a link straight to the
 * login page; signed in it shows the name and email and opens a small menu
 * with Settings and Log out.
 */
export function AccountMenu({
  signedIn,
  name,
  email,
}: {
  signedIn: boolean;
  name?: string;
  email?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on a click outside the menu or on Escape.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!signedIn) {
    return (
      <Link href="/login" className={iconOnlyClass} aria-label="Log in">
        <UserIcon />
      </Link>
    );
  }

  async function logout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${boxClass} cursor-pointer ${open ? "border-brand bg-lav" : ""}`}
        aria-label={name ? `Your account: ${name}` : "Your account"}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white"
        >
          <UserIcon className="h-5 w-5" />
        </span>
        {(name || email) && (
          <span className="hidden min-w-0 leading-tight sm:block">
            {name && (
              <span className="block truncate text-sm font-bold text-brand-deep">
                {name}
              </span>
            )}
            {email && (
              <span className="block max-w-[14rem] truncate text-xs font-semibold text-ink-soft">
                {email}
              </span>
            )}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Your account"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border-2 border-lav-deep bg-white shadow-[0_6px_20px_rgba(70,45,115,0.18)]"
        >
          {(name || email) && (
            <div className="border-b-2 border-lav-deep bg-lav px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-pink-dark">
                Signed in as
              </p>
              {name && (
                <p className="mt-1 truncate font-bold text-brand-deep">
                  {name}
                </p>
              )}
              {email && (
                <p className="truncate text-sm text-ink-soft">{email}</p>
              )}
            </div>
          )}
          <div className="py-1">
            <Link
              href="/account"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-lav hover:text-brand"
            >
              Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              disabled={loggingOut}
              className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-lav hover:text-brand disabled:opacity-50"
            >
              {loggingOut ? "Logging out…" : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
