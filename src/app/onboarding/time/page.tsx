"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/onboarding-context";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ChoiceCard } from "@/components/onboarding/choice-card";
import { ArrowRight } from "lucide-react";

const options = [
  "Less than 5 hours",
  "5–10 hours",
  "10–20 hours",
  "20–40 hours",
  "40+ hours",
];

export default function TimePage() {
  const router = useRouter();
  const { data, setField } = useOnboarding();

  return (
    <OnboardingShell step={4} totalSteps={5}>
      <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase mb-6">Time Commitment</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
        How much time can you<br />realistically invest each week?
      </h2>
      <p className="text-neutral-500 text-sm mb-8">Be honest — your plan will be built around this.</p>

      <div className="flex flex-col gap-2 mb-8">
        {options.map((opt) => (
          <ChoiceCard
            key={opt}
            label={opt}
            selected={data.timePerWeek === opt}
            onClick={() => setField("timePerWeek", opt)}
          />
        ))}
      </div>

      <button
        onClick={() => data.timePerWeek && router.push("/onboarding/success")}
        disabled={!data.timePerWeek}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all group ${
          data.timePerWeek
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
