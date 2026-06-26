"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, TrendingUp, Target, Zap, AlertCircle } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { useOnboarding } from "@/context/onboarding-context";

function deriveInsights(data: {
  directions: string[];
  challenges: string[];
  timePerWeek: string;
  situation: string;
}) {
  // Primary direction: join selected directions or fallback
  const primaryDirection =
    data.directions.length > 0
      ? data.directions.join(" · ")
      : "Personal growth and development";

  // Strengths derived from what they selected + time commitment
  const strengths: string[] = ["Clear intent"];
  if (data.timePerWeek && !data.timePerWeek.includes("Less than")) strengths.unshift("Consistency");
  if (data.directions.length > 1) strengths.push("Adaptability");
  if (data.challenges.includes("I have too many ideas")) strengths.push("Creative thinking");
  if (data.situation) strengths.push("Self-awareness");
  const strengthsDisplay = strengths.slice(0, 3).join(" · ");

  // Opportunity score: based on clarity + time commitment
  let score = 60;
  if (data.directions.length > 0) score += 10;
  if (data.challenges.length > 0) score += 5; // knowing your challenges is self-aware
  if (data.timePerWeek?.includes("10+") || data.timePerWeek?.includes("7–10")) score += 15;
  else if (data.timePerWeek?.includes("4–6")) score += 10;
  else if (data.timePerWeek?.includes("1–3")) score += 5;
  if (data.situation) score += 5;
  score = Math.min(score, 98);

  let scoreLabel = "Strong potential with focused effort";
  if (score >= 85) scoreLabel = "Exceptional potential — you're ready to move fast";
  else if (score >= 75) scoreLabel = "Strong potential with focused effort";
  else scoreLabel = "Great starting point — clarity will unlock growth";

  // Challenges: show what they actually selected, condensed
  const challengeDisplay =
    data.challenges.length > 0
      ? data.challenges
          .map((c) => c.replace(/^I (don't|lose|struggle with|need|feel|lack|have)/, "").trim())
          .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
          .slice(0, 3)
          .join(" · ")
      : "Getting started · Staying consistent";

  return { primaryDirection, strengthsDisplay, score, scoreLabel, challengeDisplay };
}

export default function BreakthroughPage() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { primaryDirection, strengthsDisplay, score, scoreLabel, challengeDisplay } =
    deriveInsights(data);

  const insights = [
    {
      icon: Target,
      label: "Primary Direction",
      value: primaryDirection,
      sub: "Based on your goals and current situation",
    },
    {
      icon: TrendingUp,
      label: "Potential Strengths",
      value: strengthsDisplay,
      sub: "Identified from your responses",
    },
    {
      icon: Zap,
      label: "Opportunity Score",
      value: `${score} / 100`,
      sub: scoreLabel,
    },
    {
      icon: AlertCircle,
      label: "Likely Challenges",
      value: challengeDisplay,
      sub: "Your plan addresses these directly",
    },
  ];

  return (
    <OnboardingShell step={6} totalSteps={7} showProgress={false}>
      <div>
        <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase mb-5">Your AI Analysis</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Here&apos;s what<br />Buildr sees.
        </h2>
        <p className="text-neutral-500 text-sm mb-8">Based on your answers, here&apos;s your starting profile.</p>

        <div className="space-y-3 mb-8">
          {insights.map((ins) => {
            const Icon = ins.icon;
            return (
              <div
                key={ins.label}
                className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-0.5">{ins.label}</p>
                  <p className="text-neutral-900 text-sm font-medium">{ins.value}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">{ins.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => router.push("/onboarding/plan")}
          className="w-full bg-neutral-900 text-white font-semibold py-3.5 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 group"
        >
          See My Action Plan
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </OnboardingShell>
  );
}
