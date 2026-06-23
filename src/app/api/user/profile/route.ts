import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, jsonResponse, errorResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const db = getDb();
  const user = db.prepare("SELECT id, email, name, plan, timezone, bio, avatar, created_at FROM users WHERE id = ?").get(session!.sub) as Record<string, unknown> | undefined;
  if (!user) return errorResponse("User not found", 404);

  const notif = db.prepare("SELECT * FROM user_notifications WHERE user_id = ?").get(session!.sub) as Record<string, unknown> | undefined;

  return jsonResponse({
    profile: {
      id: user.id, email: user.email, name: user.name, plan: user.plan,
      timezone: user.timezone, bio: user.bio, avatar: user.avatar, createdAt: user.created_at,
    },
    notifications: notif ? {
      weeklyReview: Boolean(notif.weekly_review),
      goalAlerts: Boolean(notif.goal_alerts),
      aiInsights: Boolean(notif.ai_insights),
      emailDigest: Boolean(notif.email_digest),
      streakReminders: Boolean(notif.streak_reminders),
      coachMessages: Boolean(notif.coach_messages),
    } : null,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const body = await req.json();
  const db = getDb();
  const updates: string[] = [];
  const vals: unknown[] = [];

  if (body.name) { updates.push("name = ?"); vals.push(body.name); }
  if (body.bio !== undefined) { updates.push("bio = ?"); vals.push(body.bio); }
  if (body.timezone) { updates.push("timezone = ?"); vals.push(body.timezone); }
  if (body.avatar !== undefined) { updates.push("avatar = ?"); vals.push(body.avatar); }
  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    vals.push(session!.sub);
    db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...vals);
  }

  if (body.notifications && typeof body.notifications === "object") {
    const n = body.notifications;
    const existing = db.prepare("SELECT id FROM user_notifications WHERE user_id = ?").get(session!.sub);
    if (existing) {
      const nu: string[] = [];
      const nv: unknown[] = [];
      if (n.weeklyReview !== undefined) { nu.push("weekly_review = ?"); nv.push(n.weeklyReview ? 1 : 0); }
      if (n.goalAlerts !== undefined) { nu.push("goal_alerts = ?"); nv.push(n.goalAlerts ? 1 : 0); }
      if (n.aiInsights !== undefined) { nu.push("ai_insights = ?"); nv.push(n.aiInsights ? 1 : 0); }
      if (n.emailDigest !== undefined) { nu.push("email_digest = ?"); nv.push(n.emailDigest ? 1 : 0); }
      if (n.streakReminders !== undefined) { nu.push("streak_reminders = ?"); nv.push(n.streakReminders ? 1 : 0); }
      if (n.coachMessages !== undefined) { nu.push("coach_messages = ?"); nv.push(n.coachMessages ? 1 : 0); }
      if (nu.length > 0) {
        nv.push(session!.sub);
        db.prepare(`UPDATE user_notifications SET ${nu.join(", ")} WHERE user_id = ?`).run(...nv);
      }
    }
  }

  const user = db.prepare("SELECT id, email, name, plan, timezone, bio, avatar FROM users WHERE id = ?").get(session!.sub) as Record<string, unknown>;
  return jsonResponse({ profile: user });
}
