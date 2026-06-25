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

  const user = db.prepare("SELECT name, plan FROM users WHERE id = ?").get(userId) as { name: string; plan: string } | undefined;
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

  const goals = db.prepare("SELECT title, category, progress, days_left, streak FROM goals WHERE user_id = ? AND status = 'active' LIMIT 5").all(userId) as Record<string, unknown>[];

  const history = db.prepare(
    "SELECT role, content FROM coach_messages WHERE user_id = ? ORDER BY created_at ASC LIMIT 20"
  ).all(userId) as { role: string; content: string }[];

  const systemPrompt = `You are a personal life coach inside Buildr, an AI-powered personal development app.

User: ${user?.name ?? session!.name}
Plan: ${user?.plan ?? "free"}
Active goals:
${goals.map((g) => `- ${g.title} (${g.category}): ${g.progress}% complete, ${g.days_left} days left, ${g.streak}-day streak`).join("\n") || "No goals yet."}

Be direct, specific, and motivating. Keep responses concise (2-4 sentences). Draw on the user's actual goals. No fluff.`;

  const fallbacks = [
    `Great question. Looking at your progress — ${goals[0] ? `${goals[0].title} at ${goals[0].progress}%` : "your goals"} — consistency is what separates people who succeed from those who don't. What's one small action you can take today?`,
    "The data shows your best days are when you start with your hardest task. What's the thing you've been avoiding that would move the needle most?",
    "Progress isn't linear. The fact you're here asking means you're still in the game. Break today's goal into 25-minute focused blocks.",
    "Your streak matters more than any single day. Protect it — even 5 minutes counts toward maintaining momentum.",
    "You're building identity, not just habits. Ask yourself: what would the person who already achieved this goal do right now?",
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
