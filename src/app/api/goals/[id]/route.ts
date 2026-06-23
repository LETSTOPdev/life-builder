import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, jsonResponse, errorResponse } from "@/lib/auth";

function rowToGoal(row: Record<string, unknown>) {
  return {
    id: row.id, userId: row.user_id, title: row.title, description: row.description,
    category: row.category, progress: row.progress, daysLeft: row.days_left,
    streak: row.streak, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;
  const { id } = await params;
  const db = getDb();
  const row = db.prepare("SELECT * FROM goals WHERE id = ? AND user_id = ?").get(id, session!.sub) as Record<string, unknown> | undefined;
  if (!row) return errorResponse("Goal not found", 404);
  return jsonResponse({ goal: rowToGoal(row) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;
  const { id } = await params;
  const db = getDb();
  const existing = db.prepare("SELECT * FROM goals WHERE id = ? AND user_id = ?").get(id, session!.sub) as Record<string, unknown> | undefined;
  if (!existing) return errorResponse("Goal not found", 404);

  const body = await req.json();
  const updates: string[] = [];
  const vals: unknown[] = [];

  if (body.title !== undefined) { updates.push("title = ?"); vals.push(body.title); }
  if (body.description !== undefined) { updates.push("description = ?"); vals.push(body.description); }
  if (body.category !== undefined) { updates.push("category = ?"); vals.push(body.category); }
  if (body.progress !== undefined) { updates.push("progress = ?"); vals.push(body.progress); }
  if (body.daysLeft !== undefined) { updates.push("days_left = ?"); vals.push(body.daysLeft); }
  if (body.streak !== undefined) { updates.push("streak = ?"); vals.push(body.streak); }
  if (body.status !== undefined) { updates.push("status = ?"); vals.push(body.status); }
  updates.push("updated_at = datetime('now')");
  vals.push(id, session!.sub);

  db.prepare(`UPDATE goals SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`).run(...vals);
  const updated = rowToGoal(db.prepare("SELECT * FROM goals WHERE id = ?").get(id) as Record<string, unknown>);
  return jsonResponse({ goal: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;
  const { id } = await params;
  const db = getDb();
  const result = db.prepare("DELETE FROM goals WHERE id = ? AND user_id = ?").run(id, session!.sub);
  if (result.changes === 0) return errorResponse("Goal not found", 404);
  return jsonResponse({ message: "Goal deleted" });
}
