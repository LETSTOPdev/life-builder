import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { signToken, jsonResponse, errorResponse } from "@/lib/auth";

const SECURE = process.env.NODE_ENV === "production" ? "; Secure" : "";

export async function POST(req: NextRequest) {
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
    });

    const res = jsonResponse({
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
      token,
    });
    res.headers.set("Set-Cookie", `buildr_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${SECURE}`);
    return res;
  } catch (e) {
    console.error(e);
    return errorResponse("Server error", 500);
  }
}
