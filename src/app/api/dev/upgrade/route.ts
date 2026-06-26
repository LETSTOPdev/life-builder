import { NextRequest } from "next/server";
import { getSession, requireSession, signToken, setSessionCookie, jsonResponse, errorResponse } from "@/lib/auth";
import { getDb } from "@/lib/db";

// DEV-ONLY: manually upgrade the current user's plan without going through payment.
// Only available when NODE_ENV !== "production" OR when DEV_SECRET matches the header.
export async function POST(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const devSecret = process.env.DEV_SECRET;

  if (isProd && !devSecret) {
    return errorResponse("Not available in production", 403);
  }

  if (isProd && devSecret) {
    const provided = req.headers.get("x-dev-secret");
    if (provided !== devSecret) {
      return errorResponse("Invalid dev secret", 403);
    }
  }

  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const { plan = "pro" } = await req.json().catch(() => ({}));
  const validPlans = ["free", "pro", "premium", "elite"];
  if (!validPlans.includes(plan)) return errorResponse("Invalid plan");

  const db = getDb();
  db.prepare(
    "UPDATE users SET plan = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(plan, session!.sub);

  // Re-issue the session cookie so the new plan is reflected immediately (no re-login needed)
  const newToken = await signToken({
    sub: session!.sub,
    email: session!.email,
    name: session!.name,
    plan,
  });

  const res = jsonResponse({ ok: true, plan, userId: session!.sub });
  return setSessionCookie(res, newToken);
}
