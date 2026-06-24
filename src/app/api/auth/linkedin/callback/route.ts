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

  if (error) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=linkedin_denied`);
  }

  const storedState = req.cookies.get("oauth_state")?.value;
  if (!state || state !== storedState) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=state_mismatch`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=no_code`);
  }

  const redirectUri = `${appUrl}/api/auth/linkedin/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  });

  const tokens = await tokenRes.json();
  if (!tokenRes.ok || !tokens.access_token) {
    console.error("LinkedIn token exchange failed:", tokens);
    return NextResponse.redirect(`${appUrl}/auth/login?error=token_exchange`);
  }

  // Use LinkedIn OpenID Connect userinfo endpoint
  const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const liUser = await userRes.json();

  const email = liUser.email;
  if (!email) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=no_email`);
  }

  const name =
    liUser.name ??
    [liUser.given_name, liUser.family_name].filter(Boolean).join(" ") ??
    email.split("@")[0];

  const db = getDb();

  let user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as Record<string, string> | undefined;

  if (!user) {
    const userId = newId();
    const fakeHash = `oauth_linkedin_${randomBytes(16).toString("hex")}`;

    db.prepare(
      "INSERT INTO users (id, email, name, password, plan) VALUES (?, ?, ?, ?, 'free')"
    ).run(userId, email.toLowerCase(), name, fakeHash);

    db.prepare(
      "INSERT INTO user_notifications (id, user_id) VALUES (?, ?)"
    ).run(newId(), userId);

    user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(userId) as Record<string, string>;
  }

  const token = await signToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
  });

  const isNewUser = !db
    .prepare("SELECT id FROM goals WHERE user_id = ? LIMIT 1")
    .get(user.id);

  const res = NextResponse.redirect(`${appUrl}${isNewUser ? "/onboarding" : "/dashboard"}`);
  res.cookies.set("buildr_session", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  res.cookies.delete("oauth_state");

  return res;
}
