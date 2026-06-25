import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { getSession, requireSession, jsonResponse, errorResponse } from "@/lib/auth";

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
  const user = db.prepare("SELECT password FROM users WHERE id = ?").get(session!.sub) as { password: string } | undefined;
  if (!user) return errorResponse("User not found", 404);

  // Google OAuth users have a non-bcrypt sentinel — they cannot set a password this way
  if (user.password.startsWith("oauth_google_")) {
    return errorResponse("Your account uses Google Sign-In. Password changes are not available for Google accounts.", 400);
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return errorResponse("Current password is incorrect", 401);

  const hash = await bcrypt.hash(newPassword, 10);
  db.prepare("UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?").run(hash, session!.sub);

  return jsonResponse({ message: "Password updated successfully" });
}
