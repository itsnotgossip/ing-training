"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AuthCard,
  inputClass,
  labelClass,
  primaryBtnClass,
} from "@/components/AuthCard";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [salonName, setSalonName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim(), salon_name: salonName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      // Email confirmation is switched on in Supabase.
      setCheckEmail(true);
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <AuthCard title="Check your email">
        <p className="mb-4">
          We've sent a confirmation link to <strong>{email}</strong>. Click it
          to activate your account, then log in.
        </p>
        <Link
          href="/login"
          className="font-bold text-pink-dark hover:underline"
        >
          Go to log in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Your full name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
            placeholder="e.g. Jane Smith"
            autoComplete="name"
          />
          <p className="mt-1 text-xs text-ink-soft">
            This is the name that will appear on your certificates.
          </p>
        </div>
        <div>
          <label htmlFor="salonName" className={labelClass}>
            Salon or business name
          </label>
          <input
            id="salonName"
            type="text"
            required
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            className={inputClass}
            placeholder="e.g. The Beauty Room"
            autoComplete="organization"
          />
        </div>
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
        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
        </div>
        {error && (
          <p className="rounded-xl bg-warn-bg px-4 py-2.5 text-sm font-semibold text-warn">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className={primaryBtnClass}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-pink-dark hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
