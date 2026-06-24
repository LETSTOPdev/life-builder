import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { getDb } from "@/lib/db";
import { newId, jsonResponse, errorResponse } from "@/lib/auth";

async function sendResetEmail(to: string, resetUrl: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey) {
    // Fallback: log to console for local dev without Resend configured
    console.log(`\n🔑 Password reset link for ${to}:\n${resetUrl}\n`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Reset your Life Builder password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
          <h2 style="font-size:22px;font-weight:700;color:#111;margin-bottom:8px;">Reset your password</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin-bottom:24px;">
            We received a request to reset the password for your Life Builder account.
            Click the button below to choose a new password. This link expires in 1 hour.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;background:#111;color:#fff;text-decoration:none;
                    padding:13px 28px;border-radius:999px;font-size:14px;font-weight:600;">
            Reset password
          </a>
          <p style="color:#999;font-size:13px;margin-top:32px;line-height:1.5;">
            If you didn&rsquo;t request this, you can safely ignore this email.
            Your password will not change.
          </p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body}`);
  }
}

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

    await sendResetEmail(user.email, resetUrl);

    return jsonResponse({ message: "If that email exists, a reset link has been sent." });
  } catch (e) {
    console.error(e);
    return errorResponse("Server error", 500);
  }
}
