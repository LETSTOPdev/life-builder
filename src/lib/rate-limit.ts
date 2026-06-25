/**
 * Simple in-memory rate limiter — suitable for single-instance Railway deployments.
 * Uses a sliding window of `windowMs` with a max of `max` hits per key.
 */
interface Entry { count: number; resetAt: number }

const store = new Map<string, Entry>();

// Purge expired entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store) {
    if (val.resetAt <= now) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetAt: now + windowMs };
  }

  entry.count++;
  const remaining = Math.max(0, max - entry.count);
  return { ok: entry.count <= max, remaining, resetAt: entry.resetAt };
}

/** Extract a stable key from the request (IP → X-Forwarded-For → fallback). */
export function clientKey(req: Request, suffix = ""): string {
  const fwd = (req.headers as Headers).get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0].trim() : "unknown";
  return suffix ? `${ip}:${suffix}` : ip;
}
