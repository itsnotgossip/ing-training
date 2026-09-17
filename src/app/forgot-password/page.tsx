"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  AuthCard,
  inputClass,
  labelClass,
  primaryBtnClass,
} from "@/components/AuthCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard title="Check your email">
        <p className="mb-4">
          If an account exists for <strong>{email}</strong>, we've sent a link
          to reset your password.
        </p>
        <Link
          href="/login"
          className="font-bold text-pink-dark hover:underline"
        >
          Back to log in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset your password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        {error && (
          <p className="rounded-xl bg-warn-bg px-4 py-2.5 text-sm font-semibold text-warn">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className={primaryBtnClass}>
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        <Link
          href="/login"
          className="font-bold text-pink-dark hover:underline"
        >
          Back to log in
        </Link>
      </p>
    </AuthCard>
  );
}
