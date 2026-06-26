import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getDb } from "@/lib/db";
import { signToken, newId } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // User denied permission
  if (error) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=google_denied`);
  }

  // CSRF check
  const storedState = req.cookies.get("oauth_state")?.value;
  if (!state || state !== storedState) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=state_mismatch`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=no_code`);
  }

  const redirectUri = `${appUrl}/api/auth/google/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();
  if (!tokenRes.ok || !tokens.access_token) {
    console.error("Google token exchange failed:", tokens);
    return NextResponse.redirect(`${appUrl}/auth/login?error=token_exchange`);
  }

  // Fetch user info from Google
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const googleUser = await userRes.json();

  if (!googleUser.email) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=no_email`);
  }

  const db = getDb();

  // Find existing user or create one
  let user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(googleUser.email.toLowerCase()) as Record<string, string> | undefined;

  if (!user) {
    const userId = newId();
    const name = googleUser.name ?? googleUser.email.split("@")[0];
    // OAuth users get an unusable random password — auth_provider column marks the account type.
    const unusablePassword = `__oauth__${randomBytes(16).toString("hex")}`;

    db.prepare(
      "INSERT INTO users (id, email, name, password, auth_provider, plan) VALUES (?, ?, ?, ?, 'google', 'free')"
    ).run(userId, googleUser.email.toLowerCase(), name, unusablePassword);

    db.prepare(
      "INSERT INTO user_notifications (id, user_id) VALUES (?, ?)"
    ).run(newId(), userId);

    user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(userId) as Record<string, string>;
  }

  const tokenVersion = (db.prepare("SELECT token_version FROM users WHERE id = ?").get(user.id) as { token_version: number }).token_version;

  const token = await signToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    ver: tokenVersion,
  });

  const isNewUser = !db
    .prepare("SELECT id FROM goals WHERE user_id = ? LIMIT 1")
    .get(user.id);

  const destination = isNewUser ? "/onboarding" : "/dashboard";

  const res = NextResponse.redirect(`${appUrl}${destination}`);
  res.cookies.set("buildr_session", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  res.cookies.delete("oauth_state");

  return res;
}
