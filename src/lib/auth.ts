import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { getDb } from "./db";
import { randomUUID } from "crypto";

if (process.env.NODE_ENV === "production" && !process.env.AUTH_SECRET) {
  throw new Error(
    "AUTH_SECRET environment variable must be set in production. " +
    "Generate one with: openssl rand -base64 32"
  );
}

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "buildr-dev-secret-change-in-production"
);
const COOKIE_NAME = "buildr_session";

export interface JWTPayload {
  sub: string;       // user id
  email: string;
  name: string;
  plan: string;
  iat?: number;
  exp?: number;
}

export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(req: NextRequest): Promise<JWTPayload | null> {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const header = req.headers.get("authorization")?.replace("Bearer ", "");
  const token = cookie || header;
  if (!token) return null;
  return verifyToken(token);
}

export function requireSession(session: JWTPayload | null): Response | null {
  if (!session) return errorResponse("Unauthorized", 401);
  return null;
}

export function newId(): string {
  return randomUUID();
}

export function jsonResponse(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export function errorResponse(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

export function setSessionCookie(res: Response, token: string): Response {
  res.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
  );
  return res;
}

export function clearSessionCookie(res: Response): Response {
  res.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0`
  );
  return res;
}

/** Seed a demo user if no users exist */
export async function seedDemoUser() {
  const db = getDb();
  const count = (db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number }).c;
  if (count > 0) return;

  const bcrypt = await import("bcryptjs");
  const hash = await bcrypt.hash("Demo1234!", 10);
  const userId = newId();

  db.prepare(
    `INSERT INTO users (id, email, name, password, plan, bio) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(userId, "alex@buildr.app", "Alex Johnson", hash, "free", "Builder, runner, lifelong learner.");

  db.prepare(
    `INSERT INTO user_notifications (id, user_id) VALUES (?, ?)`
  ).run(newId(), userId);

  // Seed goals
  const goals = [
    ["Run a Half Marathon", "Health", 68, 42, 12, "Complete a 21km race in under 2.5 hours."],
    ["Launch SaaS Product", "Career", 34, 90, 5, "Build and launch an AI-powered productivity tool."],
    ["Read 24 Books This Year", "Learning", 54, 183, 7, "Expand knowledge across business, psychology, and technology."],
    ["Save $50K Emergency Fund", "Finance", 82, 30, 90, "Build a 6-month financial safety net."],
  ];
  for (const [title, category, progress, daysLeft, streak, description] of goals) {
    db.prepare(
      `INSERT INTO goals (id, user_id, title, category, progress, days_left, streak, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(newId(), userId, title, category, progress, daysLeft, streak, description);
  }

  // Seed journal entries
  const entries = [
    ["great", "Had an incredible run today. Hit 12km — my longest distance yet.", '["Health","Running"]', "Strong momentum. Your positive framing is a key pattern in successful entries."],
    ["okay", "Feeling stuck on the SaaS landing copy. The value prop isn't landing right.", '["Career","Writing"]', "Creative blocks often precede breakthroughs. Consider a 24-hour rest from this task."],
  ];
  for (const [mood, content, tags, insight] of entries) {
    db.prepare(
      `INSERT INTO journal_entries (id, user_id, mood, content, tags, insight) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(newId(), userId, mood, content, tags, insight);
  }
}
