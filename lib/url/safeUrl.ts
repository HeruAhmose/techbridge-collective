export function safeUrl(raw: string | undefined, fallback = "http://localhost:3000"): URL {
  const v = (raw ?? "").trim();
  try {
    if (!v) return new URL(fallback);
    return new URL(v.startsWith("http://") || v.startsWith("https://") ? v : `https://${v}`);
  } catch {
    return new URL(fallback);
  }
}
