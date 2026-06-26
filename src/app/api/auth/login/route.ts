import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { signToken, jsonResponse, errorResponse } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const SECURE = process.env.NODE_ENV === "production" ? "; Secure" : "";

export async function POST(req: NextRequest) {
  // 10 attempts per 15 minutes per IP
  const rl = rateLimit(clientKey(req, "login"), 10, 15 * 60 * 1000);
  if (!rl.ok) {
    return errorResponse("Too many login attempts. Please wait 15 minutes.", 429);
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) return errorResponse("Email and password required");

    const db = getDb();
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as Record<string, unknown> | undefined;
    if (!user) return errorResponse("Invalid credentials", 401);

    const valid = await bcrypt.compare(password, user.password as string);
    if (!valid) return errorResponse("Invalid credentials", 401);

    const token = await signToken({
      sub: user.id as string,
      email: user.email as string,
      name: user.name as string,
      plan: user.plan as string,
      ver: user.token_version as number,
    });

    // JWT is set as httpOnly cookie only — never expose in response body
    const res = jsonResponse({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    });
    res.headers.set("Set-Cookie", `buildr_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${SECURE}`);
    return res;
  } catch (e) {
    console.error(e);
    return errorResponse("Server error", 500);
  }
}
