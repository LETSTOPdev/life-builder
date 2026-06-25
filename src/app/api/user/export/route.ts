import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, errorResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const db = getDb();
  const userId = session!.sub;

  const user = db.prepare(
    "SELECT id, email, name, plan, timezone, bio, created_at FROM users WHERE id = ?"
  ).get(userId) as Record<string, unknown> | undefined;
  if (!user) return errorResponse("User not found", 404);

  const goals = db.prepare(
    "SELECT title, description, category, progress, days_left, streak, status, created_at FROM goals WHERE user_id = ? ORDER BY created_at ASC"
  ).all(userId);

  const journal = db.prepare(
    "SELECT mood, content, tags, insight, created_at FROM journal_entries WHERE user_id = ? ORDER BY created_at ASC"
  ).all(userId);

  const coach = db.prepare(
    "SELECT role, content, created_at FROM coach_messages WHERE user_id = ? ORDER BY created_at ASC"
  ).all(userId);

  const exportData = {
    exportedAt: new Date().toISOString(),
    profile: user,
    goals,
    journal,
    coachMessages: coach,
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="buildr-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
