"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded-full border-2 border-brand-soft px-4 py-1.5 text-sm font-bold text-brand transition hover:border-brand cursor-pointer"
    >
      Log out
    </button>
  );
}
