"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/onboarding-context";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ChoiceCard } from "@/components/onboarding/choice-card";
import { ArrowRight } from "lucide-react";

const options = [
  "Student",
  "Employed",
  "Unemployed",
  "Freelancer",
  "Business Owner",
  "Creator",
  "Retired",
  "Other",
];

export default function SituationPage() {
  const router = useRouter();
  const { data, setField } = useOnboarding();

  return (
    <OnboardingShell step={3} totalSteps={5}>
      <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase mb-6">Current Situation</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
        Which best describes<br />you today?
      </h2>
      <p className="text-neutral-500 text-sm mb-8">Select one.</p>

      <div className="grid grid-cols-2 gap-2 mb-8">
        {options.map((opt) => (
          <ChoiceCard
            key={opt}
            label={opt}
            selected={data.situation === opt}
            onClick={() => setField("situation", opt)}
          />
        ))}
      </div>

      <button
        onClick={() => data.situation && router.push("/onboarding/time")}
        disabled={!data.situation}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all group ${
          data.situation
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
