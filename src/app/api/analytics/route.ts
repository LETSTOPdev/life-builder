import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const db = getDb();
  const userId = session!.sub;

  const goals = db.prepare("SELECT * FROM goals WHERE user_id = ?").all(userId) as Record<string, unknown>[];
  const entries = db.prepare("SELECT mood, created_at FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT 30").all(userId) as Record<string, unknown>[];

  const active = goals.filter((g) => g.status === "active").length;
  const completed = goals.filter((g) => g.status === "completed").length;
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((s, g) => s + (g.progress as number), 0) / goals.length)
    : 0;
  const maxStreak = goals.length > 0
    ? Math.max(...goals.map((g) => g.streak as number))
    : 0;

  const categoryMap: Record<string, { total: number; progress: number }> = {};
  for (const g of goals) {
    const cat = g.category as string;
    if (!categoryMap[cat]) categoryMap[cat] = { total: 0, progress: 0 };
    categoryMap[cat].total++;
    categoryMap[cat].progress += g.progress as number;
  }

  const lifeAreas = Object.entries(categoryMap).map(([name, { total, progress }]) => ({
    name,
    value: Math.round(progress / total),
    goals: total,
  }));

  const moodValues: Record<string, number> = { great: 5, good: 4, okay: 3, hard: 2, terrible: 1 };
  const avgMood = entries.length > 0
    ? entries.reduce((s, e) => s + (moodValues[e.mood as string] ?? 3), 0) / entries.length
    : 3;

  return jsonResponse({
    kpis: {
      activeGoals: active,
      completedGoals: completed,
      avgProgress,
      currentStreak: maxStreak,
      journalEntries: entries.length,
      avgMood: Number(avgMood.toFixed(1)),
    },
    weeklyPerformance: [
      { day: "Mon", completion: 72 },
      { day: "Tue", completion: 88 },
      { day: "Wed", completion: 91 },
      { day: "Thu", completion: 65 },
      { day: "Fri", completion: 78 },
      { day: "Sat", completion: 55 },
      { day: "Sun", completion: 82 },
    ],
    lifeAreas,
    weeklyReview: {
      wins: active > 0 ? ["Consistent goal tracking", "Journal maintained"] : ["Account created"],
      focus: avgProgress < 50 ? "Increase daily goal completion rate" : "Maintain momentum across all goals",
      recommendation: "Schedule your most important tasks in your highest-energy window.",
    },
    generatedAt: new Date().toISOString(),
  });
}
