"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Circle } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

const actions = [
  { day: "Day 1", task: "Define your target role or income goal" },
  { day: "Day 2", task: "Research 3 paths that match your strengths" },
  { day: "Day 3", task: "Identify one skill gap to close" },
  { day: "Day 4", task: "Take your first concrete step" },
  { day: "Day 5", task: "Connect with one person in your target field" },
  { day: "Day 6", task: "Review and adjust your strategy" },
  { day: "Day 7", task: "Celebrate progress, set Week 2 milestone" },
];

export default function PlanPage() {
  const router = useRouter();

  return (
    <OnboardingShell step={7} totalSteps={7} showProgress={false}>
      <div>
        <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase mb-5">First Action Plan</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
          Your First 7-Day Plan
        </h2>
        <p className="text-neutral-500 text-sm mb-8">One action per day. That&apos;s all it takes to start.</p>

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">Your Goal</p>
          <p className="text-neutral-900 text-sm font-medium">Career transition into high-growth field</p>
          <p className="text-neutral-400 text-xs mt-2">Expected outcome: First meaningful step toward transition within 7 days</p>
        </div>

        <div className="space-y-0 mb-8">
          {actions.map((action) => (
            <div
              key={action.day}
              className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0"
            >
              <div className="mt-0.5 flex-shrink-0">
                <Circle className="w-3.5 h-3.5 text-neutral-300" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">{action.day} · </span>
                <span className="text-neutral-700 text-sm">{action.task}</span>
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
