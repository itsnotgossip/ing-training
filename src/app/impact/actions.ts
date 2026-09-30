"use server";

import { redirect } from "next/navigation";
import { grantImpactAccess } from "@/lib/impact/access";

/**
 * Checks the shared password for the impact page.
 *
 * Returns a message on failure rather than throwing, so the form can show it.
 * A wrong password waits briefly before answering, which makes guessing at
 * this by machine slow and costs a real person nothing they would notice.
 */
export async function unlockImpact(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const submitted = String(formData.get("password") ?? "");

  if (await grantImpactAccess(submitted)) {
    redirect("/impact");
  }

  await new Promise((r) => setTimeout(r, 600));
  return { error: "That password was not recognised. Please try again." };
}
