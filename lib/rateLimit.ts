type Bucket = { count: number; resetAt: number };

const mem = new Map<string, Bucket>();

export function rateLimit(key: string, opts: { limit: number; windowMs: number }) {
  const now = Date.now();
  const b = mem.get(key);

  if (!b || b.resetAt <= now) {
    mem.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true };
  }

  if (b.count >= opts.limit) return { ok: false };

  b.count += 1;
  mem.set(key, b);
  return { ok: true };
}
