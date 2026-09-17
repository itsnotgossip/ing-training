"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AuthCard,
  inputClass,
  labelClass,
  primaryBtnClass,
} from "@/components/AuthCard";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email or password not recognised. Please try again."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push(searchParams.get("next") || "/dashboard");
    router.refresh();
  }

  return (
    <AuthCard title="Log in">
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
        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </div>
        {error && (
          <p className="rounded-xl bg-warn-bg px-4 py-2.5 text-sm font-semibold text-warn">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className={primaryBtnClass}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
      <div className="mt-5 space-y-2 text-center text-sm">
        <p>
          <Link
            href="/forgot-password"
            className="font-bold text-pink-dark hover:underline"
          >
            Forgotten your password?
          </Link>
        </p>
        <p>
          New here?{" "}
          <Link
            href="/register"
            className="font-bold text-pink-dark hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
