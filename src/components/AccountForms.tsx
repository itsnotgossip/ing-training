"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { brandPillBtnClass, inputClass, labelClass } from "@/lib/ui";

function Feedback({ ok, error }: { ok: string | null; error: string | null }) {
  if (error) {
    return (
      <p className="mt-4 rounded-xl bg-warn-bg px-4 py-2.5 text-sm font-semibold text-warn">
        {error}
      </p>
    );
  }
  if (ok) {
    return (
      <p className="mt-4 rounded-xl bg-ok-bg px-4 py-2.5 text-sm font-semibold text-ok">
        {ok}
      </p>
    );
  }
  return null;
}

/** Name and salon. Both are the only profile columns a user may update. */
export function DetailsForm({
  initialFullName,
  initialSalonName,
}: {
  initialFullName: string;
  initialSalonName: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [salonName, setSalonName] = useState(initialSalonName);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unchanged =
    fullName.trim() === initialFullName &&
    salonName.trim() === initialSalonName;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    setError(null);
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You appear to be signed out. Please log in and try again.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim(), salon_name: salonName.trim() })
      .eq("id", user.id);

    setSaving(false);
    if (error) {
      setError(`Could not save your details: ${error.message}`);
      return;
    }
    setOk("Your details have been saved.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="account-name" className={labelClass}>
          Your full name
        </label>
        <input
          id="account-name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputClass}
          autoComplete="name"
        />
        <p className="mt-1.5 text-xs text-ink-soft">
          This is the name printed on your certificates.
        </p>
      </div>
      <div>
        <label htmlFor="account-salon" className={labelClass}>
          Salon or business name
        </label>
        <input
          id="account-salon"
          type="text"
          required
          value={salonName}
          onChange={(e) => setSalonName(e.target.value)}
          className={inputClass}
          autoComplete="organization"
        />
      </div>
      <button
        type="submit"
        disabled={saving || unchanged}
        className={brandPillBtnClass}
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
      <Feedback ok={ok} error={error} />
    </form>
  );
}

/** Set a new password without going through the forgotten-password email. */
export function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    setError(null);

    if (password !== confirm) {
      setError("Those two passwords do not match.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }
    setPassword("");
    setConfirm("");
    setOk("Your password has been changed.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="account-password" className={labelClass}>
          New password
        </label>
        <input
          id="account-password"
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
      <div>
        <label htmlFor="account-password-confirm" className={labelClass}>
          Confirm new password
        </label>
        <input
          id="account-password-confirm"
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
          autoComplete="new-password"
        />
      </div>
      <button type="submit" disabled={saving} className={brandPillBtnClass}>
        {saving ? "Saving…" : "Change password"}
      </button>
      <Feedback ok={ok} error={error} />
    </form>
  );
}
