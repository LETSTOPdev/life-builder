"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/onboarding-context";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ChoiceCard } from "@/components/onboarding/choice-card";
import { ArrowRight } from "lucide-react";

const presets = [
  "Get a job I love",
  "Earn $1,000/month extra",
  "Earn $5,000/month extra",
  "Start a business",
  "Get my first client",
  "Change careers",
  "Build confidence",
  "Become financially independent",
];

export default function SuccessPage() {
  const router = useRouter();
  const { data, setField } = useOnboarding();
  const [custom, setCustom] = useState(false);

  const hasSelection = data.successGoal || data.customGoal;

  return (
    <OnboardingShell step={5} totalSteps={5}>
      <p className="text-[#666] text-xs font-medium tracking-widest uppercase mb-6">Success Goal</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        What would make the<br />next 12 months a success?
      </h2>
      <p className="text-[#666] text-sm mb-8">Pick the one that resonates most.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {presets.map((opt) => (
          <ChoiceCard
            key={opt}
            label={opt}
            selected={data.successGoal === opt && !custom}
            onClick={() => {
              setCustom(false);
              setField("successGoal", opt);
              setField("customGoal", "");
            }}
          />
        ))}
      </div>

      {/* Custom option */}
      <div className="mb-8">
        {!custom ? (
          <button
            onClick={() => {
              setCustom(true);
              setField("successGoal", "");
            }}
            className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-white/10 text-[#444] text-sm hover:border-white/25 hover:text-white cursor-pointer transition-all"
          >
            Write my own...
          </button>
        ) : (
          <div className="relative">
            <input
              autoFocus
              placeholder="What does success look like for you?"
              value={data.customGoal}
              onChange={e => setField("customGoal", e.target.value)}
              className="w-full bg-[#0f0f0f] border border-white/20 text-white placeholder-[#333] text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-white/40"
            />
            <button
              onClick={() => { setCustom(false); setField("customGoal", ""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#333] hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => hasSelection && router.push("/onboarding/analyzing")}
        disabled={!hasSelection}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all group ${
          hasSelection
            ? "bg-white text-black hover:bg-white/90"
            : "bg-white/5 text-white/20 cursor-not-allowed"
        }`}
      >
        Build My Plan
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </OnboardingShell>
  );
}
