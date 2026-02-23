import { headers } from "next/headers";
import type { NextRequest } from "next/server";

export function serverBaseUrl(): string {
  // Vercel provides this automatically (no manual env var required)
  const vercel = process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function serverBaseUrlFromHeaders(): string {
  const h = headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("x-forwarded-host") || h.get("host");
  if (host) return `${proto}://${host}`;
  return serverBaseUrl();
}

export function baseUrlFromRequest(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host) return `${proto}://${host}`;
  return serverBaseUrl();
}
