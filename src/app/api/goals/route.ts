import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, newId, jsonResponse, errorResponse } from "@/lib/auth";
import { getLimits } from "@/lib/plan-limits";

const VALID_CATEGORIES = ["Health", "Career", "Learning", "Finance", "Relationships", "Mindset", "Other"] as const;
const VALID_STATUSES = ["active", "completed", "paused"] as const;

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
    // Only allow valid status values in the query param
    if (!VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
      return errorResponse("Invalid status filter");
    }
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
  const { title, description = "", category = "Other", daysLeft } = body;

  // Input validation
  if (!title || typeof title !== "string" || title.trim().length < 2)
    return errorResponse("Title must be at least 2 characters");
  if (title.trim().length > 200)
    return errorResponse("Title must be under 200 characters");
  if (typeof description !== "string" || description.length > 1000)
    return errorResponse("Description must be under 1000 characters");
  if (!VALID_CATEGORIES.includes(category))
    return errorResponse(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`);
  if (!daysLeft || typeof daysLeft !== "number" || daysLeft < 1 || daysLeft > 3650)
    return errorResponse("daysLeft must be between 1 and 3650");

  const db = getDb();

  // Plan limit: free users max 3 active goals
  const user = db.prepare("SELECT plan FROM users WHERE id = ?").get(session!.sub) as { plan: string } | undefined;
  const limits = getLimits(user?.plan ?? "free");

  if (limits.maxActiveGoals !== Infinity) {
    const activeCount = (db.prepare(
      "SELECT COUNT(*) as count FROM goals WHERE user_id = ? AND status = 'active'"
    ).get(session!.sub) as { count: number }).count;

    if (activeCount >= limits.maxActiveGoals) {
      return errorResponse(
        `Free plan is limited to ${limits.maxActiveGoals} active goals. Upgrade to Pro for unlimited goals.`,
        403
      );
    }
  }

  const id = newId();
  // progress always starts at 0 — never accept from client on creation
  db.prepare(
    "INSERT INTO goals (id, user_id, title, description, category, days_left, progress) VALUES (?, ?, ?, ?, ?, ?, 0)"
  ).run(id, session!.sub, title.trim(), description.trim(), category, Math.floor(daysLeft));

  const goal = rowToGoal(db.prepare("SELECT * FROM goals WHERE id = ? AND user_id = ?").get(id, session!.sub) as Record<string, unknown>);
  return jsonResponse({ goal }, 201);
}
