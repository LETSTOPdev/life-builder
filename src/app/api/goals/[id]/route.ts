import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, jsonResponse, errorResponse } from "@/lib/auth";

const VALID_CATEGORIES = ["Health", "Career", "Learning", "Finance", "Relationships", "Mindset", "Other"] as const;
const VALID_STATUSES = ["active", "completed", "paused"] as const;

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

  // Verify ownership before reading body
  const existing = db.prepare("SELECT * FROM goals WHERE id = ? AND user_id = ?").get(id, session!.sub) as Record<string, unknown> | undefined;
  if (!existing) return errorResponse("Goal not found", 404);

  const body = await req.json();
  const updates: string[] = [];
  const vals: unknown[] = [];

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length < 2)
      return errorResponse("Title must be at least 2 characters");
    if (body.title.trim().length > 200)
      return errorResponse("Title must be under 200 characters");
    updates.push("title = ?"); vals.push(body.title.trim());
  }
  if (body.description !== undefined) {
    if (typeof body.description !== "string" || body.description.length > 1000)
      return errorResponse("Description must be under 1000 characters");
    updates.push("description = ?"); vals.push(body.description.trim());
  }
  if (body.category !== undefined) {
    if (!VALID_CATEGORIES.includes(body.category))
      return errorResponse(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`);
    updates.push("category = ?"); vals.push(body.category);
  }
  if (body.progress !== undefined) {
    const p = Number(body.progress);
    if (isNaN(p)) return errorResponse("progress must be a number");
    // Always clamp 0-100; never accept values outside this range
    updates.push("progress = ?"); vals.push(Math.min(100, Math.max(0, Math.round(p))));
  }
  if (body.daysLeft !== undefined) {
    const d = Number(body.daysLeft);
    if (isNaN(d) || d < 1 || d > 3650) return errorResponse("daysLeft must be between 1 and 3650");
    updates.push("days_left = ?"); vals.push(Math.floor(d));
  }
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status))
      return errorResponse(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
    updates.push("status = ?"); vals.push(body.status);
    // Auto-complete: set progress to 100 when marking done (if not explicitly provided)
    if (body.status === "completed" && body.progress === undefined) {
      updates.push("progress = 100");
    }
  }
  // streak is NOT user-settable — server-side only

  if (updates.length === 0) return errorResponse("No valid fields to update");

  updates.push("updated_at = datetime('now')");
  vals.push(id, session!.sub);

  db.prepare(`UPDATE goals SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`).run(...vals);

  // Re-read with ownership check (not just `WHERE id = ?`)
  const updated = rowToGoal(
    db.prepare("SELECT * FROM goals WHERE id = ? AND user_id = ?").get(id, session!.sub) as Record<string, unknown>
  );
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
