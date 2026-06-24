"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/onboarding-context";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ChoiceCard } from "@/components/onboarding/choice-card";
import { ArrowRight } from "lucide-react";

const options = [
  "I don't know what fits me",
  "I don't know where to start",
  "I lose motivation",
  "I struggle with consistency",
  "I need clients",
  "I need income",
  "I feel overwhelmed",
  "I lack confidence",
  "I have too many ideas",
  "I don't have enough time",
];

export default function ChallengePage() {
  const router = useRouter();
  const { data, toggleChallenge } = useOnboarding();

  return (
    <OnboardingShell step={2} totalSteps={5}>
      <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase mb-6">Biggest Challenge</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
        What&apos;s stopping you<br />right now?
      </h2>
      <p className="text-neutral-500 text-sm mb-8">Select all that apply.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
        {options.map((opt) => (
          <ChoiceCard
            key={opt}
            label={opt}
            selected={data.challenges.includes(opt)}
            onClick={() => toggleChallenge(opt)}
            multi
          />
        ))}
      </div>

      <button
        onClick={() => data.challenges.length > 0 && router.push("/onboarding/situation")}
        disabled={data.challenges.length === 0}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all group ${
          data.challenges.length > 0
            ? "bg-neutral-900 text-white hover:bg-neutral-700"
            : "bg-neutral-100 text-neutral-300 cursor-not-allowed"
        }`}
      >
        Continue
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </OnboardingShell>
  );
}
