"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, TrendingUp, Target, Zap, AlertCircle } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

const insights = [
  {
    icon: Target,
    label: "Primary Direction",
    value: "Career transition into high-growth field",
    sub: "Based on your goals and current situation",
  },
  {
    icon: TrendingUp,
    label: "Potential Strengths",
    value: "Consistency · Adaptability · Clear intent",
    sub: "Identified from your responses",
  },
  {
    icon: Zap,
    label: "Opportunity Score",
    value: "82 / 100",
    sub: "Strong potential with focused effort",
  },
  {
    icon: AlertCircle,
    label: "Likely Challenges",
    value: "Motivation dips · Clarity gaps",
    sub: "Your plan addresses these directly",
  },
];

export default function BreakthroughPage() {
  const router = useRouter();

  return (
    <OnboardingShell step={6} totalSteps={7} showProgress={false}>
      <div>
        <p className="text-[#666] text-xs font-medium tracking-widest uppercase mb-5">Your AI Analysis</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Here&apos;s what<br />Buildr sees.
        </h2>
        <p className="text-[#666] text-sm mb-8">Based on your answers, here&apos;s your starting profile.</p>

        <div className="space-y-3 mb-8">
          {insights.map((ins) => {
            const Icon = ins.icon;
            return (
              <div
                key={ins.label}
                className="bg-[#161616] border border-white/12 rounded-xl p-4 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#555] mb-0.5">{ins.label}</p>
                  <p className="text-white text-sm font-medium">{ins.value}</p>
                  <p className="text-[#666] text-xs mt-0.5">{ins.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => router.push("/onboarding/plan")}
          className="w-full bg-white text-black font-semibold py-3.5 rounded-xl text-sm cursor-pointer hover:bg-white/90 transition-colors flex items-center justify-center gap-2 group"
        >
          See My Action Plan
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </OnboardingShell>
  );
}
