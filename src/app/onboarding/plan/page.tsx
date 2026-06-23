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
        <p className="text-[#666] text-xs font-medium tracking-widest uppercase mb-5">First Action Plan</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Your First 7-Day Plan
        </h2>
        <p className="text-[#666] text-sm mb-8">One action per day. That&apos;s all it takes to start.</p>

        {/* Goal summary */}
        <div className="bg-[#161616] border border-white/12 rounded-xl p-4 mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#555] mb-1">Your Goal</p>
          <p className="text-white text-sm font-medium">Career transition into high-growth field</p>
          <p className="text-[#555] text-xs mt-2">Expected outcome: First meaningful step toward transition within 7 days</p>
        </div>

        {/* Daily actions */}
        <div className="space-y-0 mb-8">
          {actions.map((action) => (
            <div
              key={action.day}
              className="flex items-start gap-3 py-3 border-b border-white/6 last:border-0"
            >
              <div className="mt-0.5 flex-shrink-0">
                <Circle className="w-3.5 h-3.5 text-white/20" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-[#555] uppercase tracking-widest">{action.day} · </span>
                <span className="text-[#bbb] text-sm">{action.task}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/onboarding/ready")}
          className="w-full bg-white text-black font-semibold py-3.5 rounded-xl text-sm cursor-pointer hover:bg-white/90 transition-colors flex items-center justify-center gap-2 group"
        >
          Start Building
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <p className="text-center text-[#333] text-xs mt-3">Your progress will be tracked automatically</p>
      </div>
    </OnboardingShell>
  );
}
