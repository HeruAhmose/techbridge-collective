import { UserRole } from "@prisma/client";

function parseList(v: string | undefined): Set<string> {
  return new Set(
    (v ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export const ADMIN_EMAILS = parseList(process.env.ADMIN_EMAILS);
export const NAVIGATOR_EMAILS = parseList(process.env.NAVIGATOR_EMAILS);
export const PARTNER_EMAILS = parseList(process.env.PARTNER_EMAILS);

export function roleForEmail(email: string): UserRole {
  const e = email.toLowerCase();
  if (ADMIN_EMAILS.has(e)) return UserRole.ADMIN;
  if (NAVIGATOR_EMAILS.has(e)) return UserRole.NAVIGATOR;
  if (PARTNER_EMAILS.has(e)) return UserRole.PARTNER;
  return UserRole.PUBLIC;
}
