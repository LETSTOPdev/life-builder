import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, newId, jsonResponse, errorResponse } from "@/lib/auth";

function rowToEntry(row: Record<string, unknown>) {
  return {
    id: row.id, userId: row.user_id, mood: row.mood, content: row.content,
    tags: JSON.parse(row.tags as string || "[]"),
    insight: row.insight, createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const mood = searchParams.get("mood");
  const db = getDb();

  let query = "SELECT * FROM journal_entries WHERE user_id = ?";
  const params: unknown[] = [session!.sub];
  if (mood) { query += " AND mood = ?"; params.push(mood); }
  query += " ORDER BY created_at DESC";

  const entries = (db.prepare(query).all(...params) as Record<string, unknown>[]).map(rowToEntry);
  return jsonResponse({ entries, total: entries.length });
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const { content, mood = "okay", tags = [] } = await req.json();
  if (!content || typeof content !== "string" || content.trim().length < 10)
    return errorResponse("Content must be at least 10 characters");

  const db = getDb();
  const id = newId();
  db.prepare(
    "INSERT INTO journal_entries (id, user_id, mood, content, tags) VALUES (?, ?, ?, ?, ?)"
  ).run(id, session!.sub, mood, content.trim(), JSON.stringify(tags));

  const entry = rowToEntry(db.prepare("SELECT * FROM journal_entries WHERE id = ?").get(id) as Record<string, unknown>);
  return jsonResponse({ entry }, 201);
}
