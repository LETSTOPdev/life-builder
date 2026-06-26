import { NextRequest } from "next/server";
import { getSession, requireSession, revokeUserSessions, signToken, setSessionCookie, jsonResponse, errorResponse } from "@/lib/auth";
import { getDb } from "@/lib/db";

// DEV-ONLY: manually upgrade the current user's plan without going through payment.
// Hard-blocked in production — no DEV_SECRET escape hatch.
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return errorResponse("Not available in production", 403);
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

  // Revoke existing sessions and re-issue so the new plan is reflected immediately.
  revokeUserSessions(session!.sub);
  const newVer = (db.prepare("SELECT token_version FROM users WHERE id = ?").get(session!.sub) as { token_version: number }).token_version;
  const newToken = await signToken({
    sub: session!.sub,
    email: session!.email,
    name: session!.name,
    plan,
    ver: newVer,
  });

  const res = jsonResponse({ ok: true, plan, userId: session!.sub });
  return setSessionCookie(res, newToken);
}
