import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, newId, jsonResponse, errorResponse } from "@/lib/auth";

function rowToGoal(row: Record<string, unknown>) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    category: row.category,
    progress: row.progress,
    daysLeft: row.days_left,
    streak: row.streak,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "all";
  const category = searchParams.get("category");

  const db = getDb();
  let query = "SELECT * FROM goals WHERE user_id = ?";
  const params: unknown[] = [session!.sub];

  if (status !== "all") {
    query += " AND status = ?";
    params.push(status);
  }
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  query += " ORDER BY created_at DESC";

  const goals = (db.prepare(query).all(...params) as Record<string, unknown>[]).map(rowToGoal);
  return jsonResponse({ goals, total: goals.length });
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const body = await req.json();
  const { title, description = "", category = "Other", daysLeft, progress = 0 } = body;

  if (!title || typeof title !== "string" || title.trim().length < 2)
    return errorResponse("Title must be at least 2 characters");
  if (!daysLeft || typeof daysLeft !== "number" || daysLeft < 1)
    return errorResponse("daysLeft must be a positive number");

  const db = getDb();
  const id = newId();
  db.prepare(
    "INSERT INTO goals (id, user_id, title, description, category, days_left, progress) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(id, session!.sub, title.trim(), description, category, daysLeft, progress);

  const goal = rowToGoal(db.prepare("SELECT * FROM goals WHERE id = ?").get(id) as Record<string, unknown>);
  return jsonResponse({ goal }, 201);
}
