"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
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

const triggerClass =
  "flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand text-brand transition hover:bg-brand hover:text-white";

/**
 * Account control in the site header. Signed out it is a link straight to the
 * login page; signed in it opens a small menu with Settings and Log out.
 */
export function AccountMenu({ signedIn }: { signedIn: boolean }) {
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
      <Link href="/login" className={triggerClass} aria-label="Log in">
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
        className={`${triggerClass} cursor-pointer ${open ? "border-pink text-pink" : ""}`}
        aria-label="Your account"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <UserIcon />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Your account"
          className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border-2 border-lav-deep bg-white py-1 shadow-[0_6px_20px_rgba(70,45,115,0.18)]"
        >
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
      )}
    </div>
  );
}
