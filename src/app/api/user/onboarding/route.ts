import { NextRequest } from "next/server";
import { getSession, requireSession, jsonResponse, errorResponse } from "@/lib/auth";
import { getDb } from "@/lib/db";

// Saves onboarding personality data to the user's profile after they complete onboarding.
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const body = await req.json();
  const { directions, challenges, situation, timePerWeek, customGoal, successGoal, personalContext } = body;

  const summary = JSON.stringify({
    directions: directions ?? [],
    challenges: challenges ?? [],
    situation: situation ?? "",
    timePerWeek: timePerWeek ?? "",
    goal: customGoal || successGoal || "",
    personalContext: personalContext ?? "",
  });

  const db = getDb();
  db.prepare("UPDATE users SET onboarding_summary = ?, updated_at = datetime('now') WHERE id = ?")
    .run(summary, session!.sub);

  // Also set bio to their main goal if bio is empty
  if (customGoal || successGoal) {
    const user = db.prepare("SELECT bio FROM users WHERE id = ?").get(session!.sub) as { bio: string };
    if (!user.bio) {
      db.prepare("UPDATE users SET bio = ? WHERE id = ?")
        .run(customGoal || successGoal, session!.sub);
    }
  }

  return jsonResponse({ ok: true });
}
