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
  const entries = db.prepare(
    "SELECT mood, created_at FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT 30"
  ).all(userId) as { mood: string; created_at: string }[];

  const active = goals.filter((g) => g.status === "active").length;
  const completed = goals.filter((g) => g.status === "completed").length;
  const avgProgress =
    goals.length > 0
      ? Math.round(goals.reduce((s, g) => s + (g.progress as number), 0) / goals.length)
      : 0;
  const maxStreak = goals.length > 0 ? Math.max(...goals.map((g) => g.streak as number)) : 0;

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
  const avgMood =
    entries.length > 0
      ? entries.reduce((s, e) => s + (moodValues[e.mood] ?? 3), 0) / entries.length
      : 3;

  // --- Real weekly activity (journal entries + coach messages this week) ---
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun

  // Build ISO date strings for each day of the current week (Sun–Sat)
  const weekDates: { label: string; iso: string }[] = DAYS.map((label, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - dayOfWeek + i);
    return { label, iso: d.toISOString().slice(0, 10) };
  });

  // Count journal entries per day this week
  const journalDays = db
    .prepare(
      `SELECT date(created_at) as day, COUNT(*) as count
       FROM journal_entries
       WHERE user_id = ? AND date(created_at) >= ? AND date(created_at) <= ?
       GROUP BY day`
    )
    .all(userId, weekDates[0].iso, weekDates[6].iso) as { day: string; count: number }[];

  // Count coach messages per day this week
  const coachDays = db
    .prepare(
      `SELECT date(created_at) as day, COUNT(*) as count
       FROM coach_messages
       WHERE user_id = ? AND role = 'user' AND date(created_at) >= ? AND date(created_at) <= ?
       GROUP BY day`
    )
    .all(userId, weekDates[0].iso, weekDates[6].iso) as { day: string; count: number }[];

  const journalMap = Object.fromEntries(journalDays.map((r) => [r.day, r.count]));
  const coachMap = Object.fromEntries(coachDays.map((r) => [r.day, r.count]));

  // Score each day: journal entry = 50 pts, coach message = 30 pts, cap at 100
  // Days in the future get null (no bar shown)
  const todayIso = today.toISOString().slice(0, 10);
  const weeklyPerformance = weekDates.map(({ label, iso }) => {
    if (iso > todayIso) return { day: label, completion: null };
    const j = journalMap[iso] ?? 0;
    const c = coachMap[iso] ?? 0;
    const score = Math.min(100, j * 50 + c * 30);
    return { day: label, completion: score };
  });

  // --- Real weekly review ---
  const wins: string[] = [];
  const goalsWithProgress = goals.filter((g) => g.status === "active" && (g.progress as number) > 0);
  if (completed > 0) wins.push(`${completed} goal${completed > 1 ? "s" : ""} completed — great execution`);
  if (entries.length > 0) wins.push(`${entries.length} journal entr${entries.length > 1 ? "ies" : "y"} this period — strong self-awareness`);
  if (maxStreak >= 7) wins.push(`${maxStreak}-day streak — consistency is your superpower`);
  if (goalsWithProgress.length > 0) {
    const topGoal = goalsWithProgress.reduce((a, b) =>
      (a.progress as number) > (b.progress as number) ? a : b
    );
    wins.push(`${topGoal.title} at ${topGoal.progress}% — leading the pack`);
  }
  if (wins.length === 0) wins.push("Account active — time to set your first goal");

  const topCategory =
    lifeAreas.length > 0
      ? lifeAreas.reduce((a, b) => (a.value > b.value ? a : b)).name
      : null;

  const focus =
    avgProgress === 0
      ? "Set your first goal to start tracking real progress"
      : avgProgress < 30
      ? "Push for at least one goal past 30% this week"
      : avgProgress < 60
      ? "Increase daily check-in rate to accelerate progress"
      : "Maintain momentum — you're in the top tier";

  const recommendation =
    active === 0
      ? "Add your first goal — even one clear target transforms daily focus."
      : topCategory
      ? `${topCategory} is your strongest area. Ride that momentum and bring your other goals up to match.`
      : "Review your least-progressed goal first thing tomorrow morning — even 5 minutes moves the needle.";

  return jsonResponse({
    kpis: {
      activeGoals: active,
      completedGoals: completed,
      avgProgress,
      currentStreak: maxStreak,
      journalEntries: entries.length,
      avgMood: Number(avgMood.toFixed(1)),
    },
    weeklyPerformance,
    lifeAreas,
    weeklyReview: { wins, focus, recommendation },
    generatedAt: new Date().toISOString(),
  });
}
