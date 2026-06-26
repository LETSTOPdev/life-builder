import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { getSession, requireSession, revokeUserSessions, signToken, jsonResponse, errorResponse } from "@/lib/auth";

const SECURE = process.env.NODE_ENV === "production" ? "; Secure" : "";

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword)
    return errorResponse("Current and new password are required");
  if (newPassword.length < 8)
    return errorResponse("Password must be at least 8 characters");
  if (!/[A-Z]/.test(newPassword))
    return errorResponse("Password must contain at least one uppercase letter");
  if (!/[0-9]/.test(newPassword))
    return errorResponse("Password must contain at least one number");

  const db = getDb();
  const user = db
    .prepare("SELECT password, auth_provider FROM users WHERE id = ?")
    .get(session!.sub) as { password: string; auth_provider: string } | undefined;
  if (!user) return errorResponse("User not found", 404);

  if (user.auth_provider === "google") {
    return errorResponse(
      "Your account uses Google Sign-In. Password changes are not available for Google accounts.",
      400
    );
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return errorResponse("Current password is incorrect", 401);

  const hash = await bcrypt.hash(newPassword, 10);
  db.prepare("UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?").run(hash, session!.sub);

  // Revoke all existing sessions so stolen cookies can't be used after a password change.
  revokeUserSessions(session!.sub);

  // Issue a fresh token for the current request so the user stays logged in.
  const newVer = (db.prepare("SELECT token_version FROM users WHERE id = ?").get(session!.sub) as { token_version: number }).token_version;
  const token = await signToken({ sub: session!.sub, email: session!.email, name: session!.name, plan: session!.plan, ver: newVer });

  const res = jsonResponse({ message: "Password updated successfully" });
  res.headers.set("Set-Cookie", `buildr_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${SECURE}`);
  return res;
}
