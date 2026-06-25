import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, jsonResponse, errorResponse } from "@/lib/auth";

// DELETE /api/user/delete?scope=goals  — deletes all goal data only
// DELETE /api/user/delete?scope=account — deletes entire account + signs out
export async function DELETE(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const scope = new URL(req.url).searchParams.get("scope");
  if (!scope || !["goals", "account"].includes(scope))
    return errorResponse("scope must be 'goals' or 'account'");

  const db = getDb();
  const userId = session!.sub;

  if (scope === "goals") {
    db.prepare("DELETE FROM goals WHERE user_id = ?").run(userId);
    return jsonResponse({ message: "All goal data deleted" });
  }

  // scope === "account" — cascade deletes everything via FK ON DELETE CASCADE
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);

  const res = jsonResponse({ message: "Account deleted" });
  res.headers.set("Set-Cookie", "buildr_session=; Path=/; HttpOnly; Max-Age=0");
  return res;
}
