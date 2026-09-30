import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// A shared password in front of the impact page, so it can be shown to
// trustees and colleagues before it is ready for the public.
//
// What this is: a soft gate that keeps the page out of public view. Good
// enough for a page of demonstration figures.
//
// What this is not: real access control. Everyone shares one password, so
// it cannot be revoked for one person, and there is no record of who looked.
// Once this page shows real data about real people, move it behind the
// Supabase login and the is_admin flag instead, the way /admin already works.
//
// The password lives only in the environment. It must never be committed:
// this repository is public. It must also never be given a NEXT_PUBLIC_
// prefix, or Next.js would compile it into the browser bundle for anyone to
// read.

const COOKIE = "impact_access";
const MAX_AGE_DAYS = 30;

/** The token we store, derived from the password so changing it logs everyone out. */
function expectedToken(password: string): string {
  return createHash("sha256").update(`impact:${password}`).digest("hex");
}

/** Constant-time compare, so the response time gives nothing away. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Whether this visitor has already entered the password.
 *
 * Fails closed: with no password configured nobody gets in, rather than the
 * page quietly becoming public because a deployment is missing the variable.
 */
export async function hasImpactAccess(): Promise<boolean> {
  const password = process.env.IMPACT_PASSWORD;
  if (!password) return false;

  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;

  return safeEqual(token, expectedToken(password));
}

/** True when no password is configured, so the page can explain itself. */
export function isImpactGateConfigured(): boolean {
  return Boolean(process.env.IMPACT_PASSWORD);
}

/**
 * Check a submitted password and, if it matches, remember it in an
 * httpOnly cookie so the browser cannot read it back out.
 */
export async function grantImpactAccess(submitted: string): Promise<boolean> {
  const password = process.env.IMPACT_PASSWORD;
  if (!password) return false;
  if (!safeEqual(submitted, password)) return false;

  (await cookies()).set(COOKIE, expectedToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_DAYS * 24 * 60 * 60,
  });
  return true;
}
