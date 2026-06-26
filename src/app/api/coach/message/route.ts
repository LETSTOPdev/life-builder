import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getDb } from "@/lib/db";
import { getSession, requireSession, newId, jsonResponse, errorResponse } from "@/lib/auth";
import { getLimits } from "@/lib/plan-limits";

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const db = getDb();
  const messages = db.prepare(
    "SELECT role, content, created_at FROM coach_messages WHERE user_id = ? ORDER BY created_at ASC LIMIT 100"
  ).all(session!.sub) as { role: string; content: string; created_at: string }[];

  return jsonResponse({ messages });
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const { message } = await req.json();
  if (!message || typeof message !== "string" || !message.trim())
    return errorResponse("Message is required");
  if (message.trim().length > 2000)
    return errorResponse("Message must be under 2000 characters");

  const db = getDb();
  const userId = session!.sub;

  const user = db.prepare("SELECT name, plan, bio, onboarding_summary FROM users WHERE id = ?").get(userId) as { name: string; plan: string; bio: string; onboarding_summary: string } | undefined;

  let onboarding: { directions?: string[]; challenges?: string[]; situation?: string; timePerWeek?: string; goal?: string; personalContext?: string } = {};
  if (user?.onboarding_summary) {
    try { onboarding = JSON.parse(user.onboarding_summary); } catch {}
  }
  const limits = getLimits(user?.plan ?? "free");

  // Plan limit: free users get 5 AI coach messages per day
  if (limits.coachMessagesPerDay !== Infinity) {
    const todayCount = (db.prepare(
      "SELECT COUNT(*) as count FROM coach_messages WHERE user_id = ? AND role = 'user' AND date(created_at) = date('now')"
    ).get(userId) as { count: number }).count;

    if (todayCount >= limits.coachMessagesPerDay) {
      return errorResponse(
        `Free plan includes ${limits.coachMessagesPerDay} AI coach messages per day. Upgrade to Pro for unlimited coaching.`,
        403
      );
    }
  }

  const goals = db.prepare(
    "SELECT title, category, progress, days_left, streak, status FROM goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 10"
  ).all(userId) as Record<string, unknown>[];

  const recentJournal = db.prepare(
    "SELECT mood, content, created_at FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT 3"
  ).all(userId) as { mood: string; content: string; created_at: string }[];

  const history = db.prepare(
    "SELECT role, content FROM coach_messages WHERE user_id = ? ORDER BY created_at ASC LIMIT 20"
  ).all(userId) as { role: string; content: string }[];

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  const goalsSection =
    activeGoals.length > 0
      ? activeGoals
          .map(
            (g) =>
              `- ${g.title} (${g.category}): ${g.progress}% done, ${g.days_left} days left, ${g.streak}-day streak`
          )
          .join("\n")
      : "No active goals yet — the user needs to create their first goal.";

  const completedSection =
    completedGoals.length > 0
      ? completedGoals.map((g) => `- ${g.title} (${g.category})`).join("\n")
      : "";

  const journalSection =
    recentJournal.length > 0
      ? recentJournal
          .map((e) => `- [${e.mood}] ${e.content.slice(0, 120)}${e.content.length > 120 ? "…" : ""}`)
          .join("\n")
      : "No journal entries yet.";

  const onboardingSection = onboarding.goal || onboarding.directions?.length
    ? `
PERSONALITY & CONTEXT (from onboarding)
- Life directions: ${onboarding.directions?.join(", ") || "Not set"}
- Biggest challenges: ${onboarding.challenges?.join(", ") || "Not set"}
- Current situation: ${onboarding.situation || "Not set"}
- Time available per week: ${onboarding.timePerWeek || "Not set"}
- Their main goal in their own words: "${onboarding.goal || "Not set"}"
- Personal context they shared: "${onboarding.personalContext || "None"}"
- Bio: "${user?.bio || "Not set"}"
`
    : user?.bio ? `Personal context: "${user.bio}"` : "";

  const systemPrompt = `You are an elite personal life coach inside Buildr. You are direct, warm, and specific — never generic. You know this user's data intimately and reference it.

USER PROFILE
Name: ${user?.name ?? session!.name}
Plan: ${user?.plan ?? "free"}
${onboardingSection}

ACTIVE GOALS
${goalsSection}
${completedSection ? `\nCOMPLETED GOALS\n${completedSection}` : ""}

RECENT JOURNAL (mood + excerpt)
${journalSection}

COACHING RULES
- Always reference the user's actual goals, progress numbers, or journal mood when relevant.
- If they have no goals: warmly guide them to set their first goal. Ask what area of life matters most right now. Don't say "I can't help without goals" — say "Let's create your first goal together."
- If they ask about consistency: look at their streak numbers and give specific advice tied to their lowest-streak goal.
- Keep responses to 3-5 sentences max. No bullet points unless listing options.
- Never use hollow phrases like "Great question!", "Certainly!", or "As your AI coach".
- End with either a specific action or a direct question — never a generic closer.
- Be the coach they need, not the one that tells them what they want to hear.`;

  const fallbacks =
    activeGoals.length > 0
      ? [
          `${activeGoals[0].title} is at ${activeGoals[0].progress}% — what's the one thing blocking you from moving that forward today?`,
          `Your ${activeGoals[0].streak}-day streak on ${activeGoals[0].title} is real momentum. Don't let today be the day it breaks. What's your plan for the next 30 minutes?`,
          `You have ${activeGoals.length} active goal${activeGoals.length > 1 ? "s" : ""}. Which one, if you made serious progress on it this week, would change everything else?`,
          "Progress isn't linear. The fact you're here means you haven't quit. What's the smallest action that would count as a win today?",
          "You're building identity, not just habits. What would the version of you who already achieved this do right now?",
        ]
      : [
          "Let's build your first goal. What's one area of your life — career, health, learning, money — where you feel the most stuck or most excited right now?",
          "The best time to set a goal is today. What's one outcome you want to be able to say you achieved 90 days from now?",
          "Goals give your daily actions a direction. What's something you've been meaning to do but keep putting off? That's usually where to start.",
        ];

  let replyContent: string;
  let isLive = false;

  if (client) {
    try {
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: systemPrompt,
        messages: [
          ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
          { role: "user", content: message.trim() },
        ],
      });
      replyContent = (response.content[0] as { text: string }).text;
      isLive = true;
    } catch (err) {
      console.error("Anthropic API error — falling back to static coaching:", err);
      replyContent = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
  } else {
    replyContent = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Only persist after we have a valid reply (avoids orphaned user messages on DB)
  db.prepare("INSERT INTO coach_messages (id, user_id, role, content) VALUES (?, ?, ?, ?)").run(newId(), userId, "user", message.trim());
  db.prepare("INSERT INTO coach_messages (id, user_id, role, content) VALUES (?, ?, ?, ?)").run(newId(), userId, "assistant", replyContent);

  return jsonResponse({ message: replyContent, live: isLive });
}
