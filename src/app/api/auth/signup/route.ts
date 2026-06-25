import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { signToken, newId, jsonResponse, errorResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2)
      return errorResponse("Name must be at least 2 characters");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return errorResponse("Invalid email address");
    if (!password || password.length < 8)
      return errorResponse("Password must be at least 8 characters");
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
    const res = jsonResponse({ message: "Account created", userId }, 201);
    res.headers.set("Set-Cookie", `buildr_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`);
    return res;
  } catch (e) {
    console.error(e);
    return errorResponse("Server error", 500);
  }
}
