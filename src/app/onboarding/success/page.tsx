"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/onboarding-context";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ArrowRight, Sparkles } from "lucide-react";

const DIRECTION_PRESETS: Record<string, string> = {
  "Find a career": "Land a fulfilling career in my target field",
  "Switch careers": "Successfully transition into a new career I love",
  "Get a better job": "Get a better-paying job with more growth potential",
  "Start freelancing": "Start freelancing and earn my first $1,000 from clients",
  "Build a business": "Launch my business and get my first paying customer",
  "Grow a business": "Grow my business revenue by 50%",
  "Become a creator": "Build an audience and publish consistently",
  "Increase income": "Increase my monthly income by at least $2,000",
  "Find purpose": "Gain clarity on what I truly want to do with my life",
  "I don't know yet": "Figure out my direction and take my first real steps",
};

function getSuggestedGoal(directions: string[]): string {
  if (directions.length === 0) return "";
  return DIRECTION_PRESETS[directions[0]] ?? "";
}

export default function SuccessPage() {
  const router = useRouter();
  const { data, setField } = useOnboarding();
  const [showContext, setShowContext] = useState(false);

  useEffect(() => {
    if (!data.customGoal && !data.successGoal) {
      const suggested = getSuggestedGoal(data.directions);
      if (suggested) setField("successGoal", suggested);
    }
  }, []);

  const goalText = data.customGoal || data.successGoal;
  const canContinue = goalText.trim().length > 0;

  return (
    <OnboardingShell step={5} totalSteps={5}>
      <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase mb-5">Your Goal</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
        What does winning<br />look like for you?
      </h2>
      <p className="text-neutral-500 text-sm mb-7">
        Write your goal in your own words. Be specific — this becomes the north star for everything in your dashboard.
      </p>

      {data.successGoal && !data.customGoal && (
        <div className="flex items-start gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
          <p className="text-neutral-500 text-xs">Based on your answers, we suggest:</p>
          <p className="text-neutral-700 text-xs font-medium">&ldquo;{data.successGoal}&rdquo;</p>
        </div>
      )}

      <div className="mb-5">
        <textarea
          autoFocus
          rows={3}
          placeholder={`e.g. "${data.successGoal || "I want to earn $5k/month as a freelance designer by December"}"`}
          value={data.customGoal}
          onChange={e => {
            setField("customGoal", e.target.value);
            if (e.target.value) setField("successGoal", "");
          }}
          className="w-full bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-neutral-500 resize-none transition-colors leading-relaxed"
        />
        <p className="text-neutral-400 text-xs mt-1.5 px-1">The more specific you are, the better your plan will be.</p>
      </div>

      {!showContext ? (
        <button
          onClick={() => setShowContext(true)}
          className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-neutral-200 text-neutral-400 text-sm hover:border-neutral-300 hover:text-neutral-600 cursor-pointer transition-all mb-6"
        >
          + Add personal context <span className="text-neutral-300">(optional)</span>
        </button>
      ) : (
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2 block">
            Anything your AI coach should know?
          </label>
          <textarea
            autoFocus
            rows={3}
            placeholder="e.g. I'm a single parent with limited time, I've tried this before and failed, I have $500 saved to invest in myself, I need to see results fast..."
            value={data.personalContext ?? ""}
            onChange={e => setField("personalContext" as keyof typeof data, e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-neutral-500 resize-none transition-colors leading-relaxed"
          />
          <p className="text-neutral-400 text-xs mt-1.5 px-1">This helps personalize your coaching. Never shared.</p>
        </div>
      )}

      <button
        onClick={() => canContinue && router.push("/onboarding/analyzing")}
        disabled={!canContinue}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold cursor-pointer transition-all group ${
          canContinue
            ? "bg-neutral-900 text-white hover:bg-neutral-700"
            : "bg-neutral-100 text-neutral-300 cursor-not-allowed"
        }`}
      >
        Build My Plan
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </OnboardingShell>
  );
}
