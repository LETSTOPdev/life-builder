import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, newId, jsonResponse, errorResponse } from "@/lib/auth";
import { getLimits } from "@/lib/plan-limits";

const VALID_MOODS = ["great", "good", "okay", "hard", "terrible"] as const;

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

  // Validate mood filter
  if (mood && !VALID_MOODS.includes(mood as typeof VALID_MOODS[number])) {
    return errorResponse(`mood must be one of: ${VALID_MOODS.join(", ")}`);
  }

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

  // Input validation
  if (!content || typeof content !== "string" || content.trim().length < 10)
    return errorResponse("Content must be at least 10 characters");
  if (content.trim().length > 10000)
    return errorResponse("Content must be under 10,000 characters");
  if (!VALID_MOODS.includes(mood))
    return errorResponse(`mood must be one of: ${VALID_MOODS.join(", ")}`);
  if (!Array.isArray(tags) || tags.length > 20)
    return errorResponse("tags must be an array of up to 20 items");
  // Flatten tags to strings only — reject nested objects
  const safeTags = tags
    .filter((t) => typeof t === "string")
    .map((t: string) => t.slice(0, 50));

  const db = getDb();

  // Plan limit: free users max 3 journal entries/day
  const user = db.prepare("SELECT plan FROM users WHERE id = ?").get(session!.sub) as { plan: string } | undefined;
  const limits = getLimits(user?.plan ?? "free");

  if (limits.journalEntriesPerDay !== Infinity) {
    const todayCount = (db.prepare(
      "SELECT COUNT(*) as count FROM journal_entries WHERE user_id = ? AND date(created_at) = date('now')"
    ).get(session!.sub) as { count: number }).count;

    if (todayCount >= limits.journalEntriesPerDay) {
      return errorResponse(
        `Free plan allows ${limits.journalEntriesPerDay} journal entries per day. Upgrade to Pro for unlimited journaling.`,
        403
      );
    }
  }

  const id = newId();
  db.prepare(
    "INSERT INTO journal_entries (id, user_id, mood, content, tags) VALUES (?, ?, ?, ?, ?)"
  ).run(id, session!.sub, mood, content.trim(), JSON.stringify(safeTags));

  const entry = rowToEntry(db.prepare("SELECT * FROM journal_entries WHERE id = ? AND user_id = ?").get(id, session!.sub) as Record<string, unknown>);
  return jsonResponse({ entry }, 201);
}
