import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { getDb } from "@/lib/db";
import { newId, jsonResponse, errorResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse("Invalid email address");
    }

    const db = getDb();
    const user = db
      .prepare("SELECT id, email FROM users WHERE email = ?")
      .get(email.toLowerCase()) as { id: string; email: string } | undefined;

    // Always return success to prevent email enumeration
    if (!user) {
      return jsonResponse({ message: "If that email exists, a reset link has been sent." });
    }

    // Invalidate any existing tokens for this user
    db.prepare("DELETE FROM password_reset_tokens WHERE user_id = ?").run(user.id);

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1 hour

    db.prepare(
      "INSERT INTO password_reset_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)"
    ).run(newId(), user.id, token, expiresAt);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    // In production, send this via email (e.g. Resend, Postmark, SendGrid).
    // For now, log it to the console so you can test locally.
    console.log(`\n🔑 Password reset link for ${user.email}:\n${resetUrl}\n`);

    return jsonResponse({ message: "If that email exists, a reset link has been sent." });
  } catch (e) {
    console.error(e);
    return errorResponse("Server error", 500);
  }
}
