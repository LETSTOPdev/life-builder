import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { signToken, newId, jsonResponse, errorResponse } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // 5 signups per hour per IP
  const rl = rateLimit(clientKey(req, "signup"), 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return errorResponse("Too many accounts created from this address. Try again later.", 429);
  }

  try {
    const { name, email, password } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2)
      return errorResponse("Name must be at least 2 characters");
    if (name.trim().length > 100)
      return errorResponse("Name must be under 100 characters");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return errorResponse("Invalid email address");
    if (email.length > 254)
      return errorResponse("Email address is too long");
    if (!password || password.length < 8)
      return errorResponse("Password must be at least 8 characters");
    if (password.length > 128)
      return errorResponse("Password must be under 128 characters");
    if (!/[A-Z]/.test(password))
      return errorResponse("Password must contain at least one uppercase letter");
    if (!/[0-9]/.test(password))
      return errorResponse("Password must contain at least one number");

    const db = getDb();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
    if (existing) return errorResponse("Email already registered", 409);

    const hash = await bcrypt.hash(password, 10);
    const userId = newId();

    db.prepare(
      "INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)"
    ).run(userId, email.toLowerCase(), name.trim(), hash);

    db.prepare(
      "INSERT INTO user_notifications (id, user_id) VALUES (?, ?)"
    ).run(newId(), userId);

    const token = await signToken({ sub: userId, email: email.toLowerCase(), name: name.trim(), plan: "free" });
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    // Never return userId or token in body — session is set via httpOnly cookie
    const res = jsonResponse({ message: "Account created" }, 201);
    res.headers.set("Set-Cookie", `buildr_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`);
    return res;
  } catch (e) {
    console.error(e);
    return errorResponse("Server error", 500);
  }
}
