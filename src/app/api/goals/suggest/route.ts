import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getDb } from "@/lib/db";
import { getSession, requireSession, jsonResponse, errorResponse } from "@/lib/auth";

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

interface Suggestion {
  title: string;
  description: string;
  category: string;
  daysLeft: number;
  why: string;
}

// Static fallbacks keyed by first direction or situation
const FALLBACKS: Record<string, Suggestion[]> = {
  career: [
    { title: "Update LinkedIn profile and apply to 5 target companies", description: "Refresh headline, summary, and experience. Find and apply to 5 roles that match your target.", category: "Career", daysLeft: 14, why: "A strong profile multiplies every other career move you make." },
    { title: "Complete one industry-relevant certification", description: "Pick the one credential that would most open doors in your field and finish it.", category: "Learning", daysLeft: 60, why: "Certifications signal commitment and close skill gaps fast." },
    { title: "Have 3 informational interviews with people in your target role", description: "Reach out, schedule, and complete conversations. Ask what they wish they'd known earlier.", category: "Career", daysLeft: 30, why: "Every job lead comes from a person, not a job board." },
  ],
  business: [
    { title: "Talk to 10 potential customers about the problem you're solving", description: "No pitching — just listening. Document their exact words about pain points and current workarounds.", category: "Career", daysLeft: 21, why: "Most failed businesses skipped this step." },
    { title: "Launch a minimum viable version and get your first paying customer", description: "The simplest version that solves the core problem. Charge real money from day one.", category: "Finance", daysLeft: 45, why: "Revenue validates faster than any research." },
    { title: "Set up weekly revenue tracking and review every Friday", description: "Track what drove this week's numbers. Make one change each week based on what you see.", category: "Finance", daysLeft: 30, why: "What gets measured gets managed." },
  ],
  health: [
    { title: "Exercise for 30 minutes, 4 days per week for 8 weeks", description: "Pick one type of movement you genuinely enjoy. Consistency over intensity.", category: "Health", daysLeft: 56, why: "8 weeks is enough to make it a default behavior, not a decision." },
    { title: "Sleep 7+ hours for 30 consecutive days", description: "Set a consistent sleep and wake time. Remove screens 30 min before bed.", category: "Health", daysLeft: 30, why: "Sleep affects every other goal you have." },
    { title: "Cook at home 5 days a week for 6 weeks", description: "Plan 5 simple meals each Sunday. Prep ingredients in advance.", category: "Health", daysLeft: 42, why: "Home cooking is the highest-leverage nutrition change most people can make." },
  ],
  default: [
    { title: "Build a daily 30-minute deep work habit for 30 days", description: "Block the first 30 minutes of your day for your most important work. No meetings, no phone.", category: "Other", daysLeft: 30, why: "Your first 30 minutes set the tone for the entire day." },
    { title: "Read one non-fiction book every 3 weeks", description: "Choose books directly relevant to your current goal. Take one page of notes per book.", category: "Learning", daysLeft: 21, why: "Books compress decades of experience into hours." },
    { title: "Do a weekly review every Sunday for 2 months", description: "30 minutes each Sunday: what worked, what didn't, what's the plan for the week ahead.", category: "Other", daysLeft: 56, why: "People who review their week consistently make twice the progress." },
  ],
};

function getFallbacks(directions: string[], situation: string): Suggestion[] {
  const dir = (directions[0] ?? "").toLowerCase();
  if (dir.includes("business") || dir.includes("freelanc")) return FALLBACKS.business;
  if (dir.includes("career") || dir.includes("job")) return FALLBACKS.career;
  if (dir.includes("health")) return FALLBACKS.health;
  if (situation === "Business Owner" || situation === "Freelancer") return FALLBACKS.business;
  return FALLBACKS.default;
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  const db = getDb();
  const userId = session!.sub;

  const user = db.prepare("SELECT name, plan, bio, onboarding_summary FROM users WHERE id = ?")
    .get(userId) as { name: string; plan: string; bio: string; onboarding_summary: string } | undefined;

  const existingGoals = db.prepare(
    "SELECT title, category, status FROM goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 10"
  ).all(userId) as { title: string; category: string; status: string }[];

  const recentJournal = db.prepare(
    "SELECT mood, content FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT 3"
  ).all(userId) as { mood: string; content: string }[];

  // Parse onboarding data
  let onboarding: { directions: string[]; challenges: string[]; situation: string; timePerWeek: string; goal: string; personalContext: string } = {
    directions: [], challenges: [], situation: "", timePerWeek: "", goal: "", personalContext: ""
  };
  if (user?.onboarding_summary) {
    try { onboarding = JSON.parse(user.onboarding_summary); } catch {}
  }

  if (!client) {
    return jsonResponse({ suggestions: getFallbacks(onboarding.directions, onboarding.situation) });
  }

  const existingTitles = existingGoals.map(g => `- ${g.title} (${g.status})`).join("\n") || "None yet";
  const journalContext = recentJournal.length > 0
    ? recentJournal.map(e => `[${e.mood}] ${e.content.slice(0, 100)}`).join(" | ")
    : "No journal entries yet";

  const prompt = `You are a goal-setting expert inside Buildr, a personal growth app. Generate exactly 5 personalized goal suggestions for this user.

USER PROFILE:
- Name: ${user?.name ?? session!.name}
- Situation: ${onboarding.situation || "Unknown"}
- Life directions they want to pursue: ${onboarding.directions.length > 0 ? onboarding.directions.join(", ") : "Not specified"}
- Biggest challenges: ${onboarding.challenges.length > 0 ? onboarding.challenges.join(", ") : "Not specified"}
- Time available per week: ${onboarding.timePerWeek || "Not specified"}
- Their main goal in their words: "${onboarding.goal || user?.bio || "Not specified"}"
- Personal context: "${onboarding.personalContext || "None provided"}"

EXISTING GOALS (avoid duplicating these):
${existingTitles}

RECENT JOURNAL MOOD/CONTEXT:
${journalContext}

Generate exactly 5 goal suggestions. Each must be:
1. Specific and achievable (not vague like "be healthier")
2. Directly relevant to their stated life direction and personal context
3. Varied across different timeframes (some 14-day quick wins, some 30-60 day deeper goals)
4. Not duplicating their existing goals

Respond ONLY with valid JSON — no markdown, no explanation, just the JSON array:
[
  {
    "title": "concise action-oriented goal title (max 60 chars)",
    "description": "1-2 sentences on exactly how to achieve this",
    "category": "one of: Health, Career, Learning, Finance, Other",
    "daysLeft": number between 7 and 90,
    "why": "one sentence on why THIS goal matters for THIS specific person"
  }
]`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (response.content[0] as { text: string }).text.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array in response");

    const suggestions: Suggestion[] = JSON.parse(jsonMatch[0]);
    const valid = suggestions
      .filter(s => s.title && s.category && s.daysLeft)
      .slice(0, 5);

    if (valid.length === 0) throw new Error("No valid suggestions");
    return jsonResponse({ suggestions: valid });
  } catch (err) {
    console.error("Goal suggest error:", err);
    return jsonResponse({ suggestions: getFallbacks(onboarding.directions, onboarding.situation) });
  }
}
