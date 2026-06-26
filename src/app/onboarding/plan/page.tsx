"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Circle } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { useOnboarding } from "@/context/onboarding-context";

// Map each direction to a focused 7-day action plan
const DIRECTION_PLANS: Record<string, string[]> = {
  "Find a career": [
    "List 10 roles that match your skills and interests",
    "Research the top 3 that excite you most — salary, day-to-day, growth",
    "Identify the single most important skill gap for your top pick",
    "Update your LinkedIn headline and summary for your target role",
    "Find and save 5 open job listings in your target field",
    "Reach out to one person already in that role for a 15-min chat",
    "Apply to your first role and set a weekly application target",
  ],
  "Switch careers": [
    "Write down what you dislike about your current career (be specific)",
    "Research 3 adjacent fields that use your existing strengths",
    "Identify one transferable skill that immediately makes you valuable in the new field",
    "Find a course, book, or project to start building the new skill",
    "Connect with someone who made a similar switch — ask what they'd do differently",
    "Draft a simple transition plan with a target date",
    "Take one concrete action toward the new path today",
  ],
  "Get a better job": [
    "Define 'better' — more pay, better culture, more growth? Prioritize.",
    "Update your resume with your last 3 achievements in measurable terms",
    "Research your market rate on Glassdoor, Levels.fyi, or LinkedIn Salary",
    "Identify your top 5 target companies and why",
    "Refresh your LinkedIn profile — new headline, about section, and recent role",
    "Send one warm outreach to someone at a target company",
    "Apply to one role and set a goal of 5 applications this week",
  ],
  "Start freelancing": [
    "Pick one specific service to offer (not 'I do everything')",
    "Define your ideal client — industry, company size, problem they have",
    "Set your starting rate (use the formula: desired annual income ÷ 50 weeks ÷ 40 hrs × 2)",
    "Create a simple one-page portfolio or case study from past work",
    "Tell 5 people in your network what you're offering",
    "Post one piece of content showing your expertise on LinkedIn",
    "Send your first outreach email to a potential client",
  ],
  "Build a business": [
    "Write a 1-sentence value proposition: who you help, what problem, what result",
    "Identify 5 people who have the problem your business solves",
    "Talk to 3 of them — don't pitch, just listen and understand their pain",
    "Sketch the simplest possible version of your solution (MVP)",
    "Define how you'll make your first $1 (what's the simplest path to revenue?)",
    "Set a 30-day goal: your first customer, or your first prototype",
    "Block 1 hour every day this week to build — protect this time fiercely",
  ],
  "Grow a business": [
    "Review your last 30 days of revenue — what drove it?",
    "Identify your single highest-leverage growth lever right now",
    "Talk to your 3 best customers — what do they love most and what's missing?",
    "Cut one thing that's taking time but not driving growth",
    "Set a 30-day growth target with a specific number attached",
    "Identify one new channel or strategy to test this week",
    "Schedule a weekly 1-hour growth review every Friday",
  ],
  "Become a creator": [
    "Pick your platform (YouTube, newsletter, podcast, LinkedIn, TikTok — pick one)",
    "Define your niche: who you help + what topic + why you're the right person",
    "Study 3 successful creators in your space — what's their content formula?",
    "Create your first piece of content (done > perfect)",
    "Publish it and share with 10 people — get honest feedback",
    "Plan your next 4 pieces of content using a simple template",
    "Set a publishing cadence you can actually sustain (1×/week is enough to start)",
  ],
  "Increase income": [
    "Calculate your exact current take-home and identify where it goes",
    "Set a specific income target with a timeframe (not 'more money')",
    "List 3 ways to earn more at your current job (raise, bonus, new role)",
    "List 3 ways to earn outside your job (freelance, side project, investing)",
    "Pick the one path with the best effort-to-reward ratio",
    "Take the first concrete action on that path today",
    "Set a weekly check-in with yourself on income progress every Sunday",
  ],
  "Find purpose": [
    "Write for 10 minutes: 'What do I want my life to look like in 5 years?'",
    "List 5 things you do where time disappears — these are clues",
    "Identify the 3 people you most admire and what specifically you admire about them",
    "Write down what you'd do if money wasn't a factor and you couldn't fail",
    "Find the overlap between what you're good at, what you love, and what the world needs",
    "Talk to one person who seems to have found their purpose — ask how they got there",
    "Pick one small thing aligned with your purpose to do every day for a week",
  ],
  "I don't know yet": [
    "Write for 10 minutes without editing: 'What's missing from my life right now?'",
    "List your top 5 skills — things people come to you for",
    "List your top 5 interests — things you'd read about for fun",
    "Look for the intersection: where could those skills meet those interests?",
    "Research 2 people who have lives that excite you — what do they do?",
    "Try one new thing this week (a class, a side project, a conversation)",
    "Set a 30-day experiment: commit to one area to explore before deciding",
  ],
};

const DEFAULT_PLAN = [
  "Write down your most important goal in one clear sentence",
  "Break that goal into 3 smaller milestones",
  "Identify the single biggest obstacle between you and goal completion",
  "Build a daily habit (even 15 min) that moves you toward the goal",
  "Tell one person about your goal — accountability matters",
  "Review progress at the end of the week and adjust your approach",
  "Celebrate what you've learned — progress over perfection",
];

function generatePlan(directions: string[]): string[] {
  if (directions.length === 0) return DEFAULT_PLAN;
  // Use the first selected direction's plan
  return DIRECTION_PLANS[directions[0]] ?? DEFAULT_PLAN;
}

function getPlanTitle(directions: string[]): string {
  if (directions.length === 0) return "Your First 7-Day Plan";
  if (directions.length === 1) return `Your ${directions[0]} Plan`;
  return "Your First 7-Day Plan";
}

function getGoalSummary(directions: string[], successGoal: string, customGoal: string): string {
  if (customGoal.trim()) return customGoal.trim();
  if (successGoal.trim()) return successGoal.trim();
  if (directions.length > 0) return directions.join(" · ");
  return "Build the life you imagined";
}

function getExpectedOutcome(directions: string[]): string {
  const outcomes: Record<string, string> = {
    "Find a career": "First job application submitted within 7 days",
    "Switch careers": "Clear transition plan with a target date",
    "Get a better job": "Active pipeline with 5+ applications",
    "Start freelancing": "First outreach sent to a potential client",
    "Build a business": "Customer conversations started and MVP defined",
    "Grow a business": "Growth lever identified and first test running",
    "Become a creator": "First piece of content published",
    "Increase income": "One income-increasing action taken",
    "Find purpose": "Clarity on at least one area worth exploring deeply",
    "I don't know yet": "One new thing explored and direction narrowed",
  };
  if (directions.length > 0 && outcomes[directions[0]]) {
    return outcomes[directions[0]];
  }
  return "First meaningful step taken within 7 days";
}

export default function PlanPage() {
  const router = useRouter();
  const { data } = useOnboarding();

  const plan = generatePlan(data.directions);
  const title = getPlanTitle(data.directions);
  const goalSummary = getGoalSummary(data.directions, data.successGoal, data.customGoal);
  const outcome = getExpectedOutcome(data.directions);

  return (
    <OnboardingShell step={7} totalSteps={7} showProgress={false}>
      <div>
        <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase mb-5">First Action Plan</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">{title}</h2>
        <p className="text-neutral-500 text-sm mb-8">One action per day. That&apos;s all it takes to start.</p>

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">Your Focus</p>
          <p className="text-neutral-900 text-sm font-medium">{goalSummary}</p>
          <p className="text-neutral-400 text-xs mt-2">Expected outcome: {outcome}</p>
        </div>

        <div className="space-y-0 mb-8">
          {plan.map((task, i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0"
            >
              <div className="mt-0.5 flex-shrink-0">
                <Circle className="w-3.5 h-3.5 text-neutral-300" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                  Day {i + 1} ·{" "}
                </span>
                <span className="text-neutral-700 text-sm">{task}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/onboarding/ready")}
          className="w-full bg-neutral-900 text-white font-semibold py-3.5 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 group"
        >
          Start Building
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <p className="text-center text-neutral-400 text-xs mt-3">Your progress will be tracked automatically</p>
      </div>
    </OnboardingShell>
  );
}
