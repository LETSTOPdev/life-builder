import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { getSession, requireSession, jsonResponse, errorResponse } from "@/lib/auth";

const SECURE = process.env.NODE_ENV === "production" ? "; Secure" : "";

// DELETE /api/user/delete?scope=goals  — deletes all goal data only
// DELETE /api/user/delete?scope=account — deletes entire account + signs out
//   Body: { password: string }  ← required for scope=account (not needed for scope=goals)
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

  // scope === "account" — require password re-confirmation to prevent hijacked-session deletion.
  const body = await req.json().catch(() => ({}));
  const { password } = body as { password?: string };

  const user = db
    .prepare("SELECT password, auth_provider FROM users WHERE id = ?")
    .get(userId) as { password: string; auth_provider: string } | undefined;

  if (!user) return errorResponse("User not found", 404);

  if (user.auth_provider === "google") {
    // Google OAuth users have no local password — require an explicit confirmation phrase instead.
    if (password !== "DELETE MY ACCOUNT") {
      return errorResponse(
        "To delete your Google-linked account, provide the confirmation phrase: DELETE MY ACCOUNT",
        400
      );
    }
  } else {
    if (!password) return errorResponse("Password is required to delete your account");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return errorResponse("Incorrect password", 401);
  }

  // Cascade deletes everything via FK ON DELETE CASCADE
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);

  const res = jsonResponse({ message: "Account deleted" });
  res.headers.set("Set-Cookie", `buildr_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${SECURE}`);
  return res;
}
