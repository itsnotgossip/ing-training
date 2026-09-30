"use client";

import { useActionState } from "react";
import { unlockImpact } from "@/app/impact/actions";
import { HelplineBar } from "@/components/HelplineBar";
import { LogoLockup } from "@/components/LogoLockup";
import { QuickExit } from "@/components/QuickExit";
import { SiteFooter } from "@/components/SiteFooter";
import { inputClass, labelClass, primaryBtnClass } from "@/lib/ui";

/**
 * Shown instead of the impact page until the shared password is entered.
 * Laid out like the sign-in pages so it feels part of the site.
 */
export function PasswordGate({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(unlockImpact, {});

  return (
    <div className="flex min-h-screen flex-col">
      <HelplineBar />

      <main className="hero-gradient flex flex-1 flex-col">
        <div className="site-container flex flex-1 flex-col items-center justify-center py-12">
          <LogoLockup size="lg" className="mb-8" />

          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_2px_14px_rgba(70,45,115,0.1)]">
            <h1 className="mb-2 text-2xl font-bold text-brand">
              This page is not public yet
            </h1>
            <p className="mb-6 leading-relaxed text-ink">
              The impact figures are still being prepared. Enter the password
              if you have been given one.
            </p>

            {configured ? (
              <form action={formAction}>
                <label htmlFor="impact-password" className={labelClass}>
                  Password
                </label>
                <input
                  id="impact-password"
                  name="password"
                  type="password"
                  autoComplete="off"
                  autoFocus
                  required
                  className={inputClass}
                />

                {state?.error && (
                  <p
                    role="alert"
                    className="mt-3 rounded-xl bg-warn-bg px-4 py-2.5 text-sm font-semibold text-warn"
                  >
                    {state.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className={`${primaryBtnClass} mt-5`}
                >
                  {pending ? "Checking…" : "View the page"}
                </button>
              </form>
            ) : (
              <p className="rounded-xl bg-warn-bg px-4 py-3 text-sm font-semibold text-warn">
                No password has been set for this page, so nobody can open it.
                Set IMPACT_PASSWORD in the environment to switch it on.
              </p>
            )}
          </div>
        </div>

        <SiteFooter />
      </main>

      <QuickExit />
    </div>
  );
}
