import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { signToken, jsonResponse, errorResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token) return errorResponse("Reset token is required");
    if (!password || password.length < 8) return errorResponse("Password must be at least 8 characters");
    if (!/[A-Z]/.test(password)) return errorResponse("Password must contain at least one uppercase letter");
    if (!/[0-9]/.test(password)) return errorResponse("Password must contain at least one number");

    const db = getDb();
    const record = db
      .prepare(
        "SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')"
      )
      .get(token) as Record<string, unknown> | undefined;

    if (!record) return errorResponse("This reset link is invalid or has expired.", 400);

    const hash = await bcrypt.hash(password, 10);

    db.prepare(
      "UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(hash, record.user_id);

    db.prepare(
      "UPDATE password_reset_tokens SET used = 1 WHERE id = ?"
    ).run(record.id);

    const user = db
      .prepare("SELECT id, email, name, plan FROM users WHERE id = ?")
      .get(record.user_id) as Record<string, string>;

    const sessionToken = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    });

    const res = jsonResponse({ message: "Password reset successfully." });
    res.headers.set(
      "Set-Cookie",
      `buildr_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
    return res;
  } catch (e) {
    console.error(e);
    return errorResponse("Server error", 500);
  }
}
