"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/onboarding-context";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ChoiceCard } from "@/components/onboarding/choice-card";
import { ArrowRight } from "lucide-react";

const options = [
  "Find a career",
  "Switch careers",
  "Get a better job",
  "Start freelancing",
  "Build a business",
  "Grow a business",
  "Become a creator",
  "Increase income",
  "Find purpose",
  "I don't know yet",
];

export default function DirectionPage() {
  const router = useRouter();
  const { data, toggleDirection } = useOnboarding();

  return (
    <OnboardingShell step={1} totalSteps={5}>
      <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase mb-6">Life Direction</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
        What are you trying<br />to achieve right now?
      </h2>
      <p className="text-neutral-500 text-sm mb-8">Select all that apply.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
        {options.map((opt) => (
          <ChoiceCard
            key={opt}
            label={opt}
            selected={data.directions.includes(opt)}
            onClick={() => toggleDirection(opt)}
            multi
          />
        ))}
      </div>

      <button
        onClick={() => data.directions.length > 0 && router.push("/onboarding/challenge")}
        disabled={data.directions.length === 0}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all group ${
          data.directions.length > 0
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
