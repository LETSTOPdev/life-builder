"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
  children: React.ReactNode;
  showProgress?: boolean;
}

export function OnboardingShell({ step, totalSteps, children, showProgress = true }: OnboardingShellProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="text-neutral-900 font-semibold text-sm">Buildr</span>
        </Link>
        {showProgress && (
          <span className="text-neutral-400 text-xs font-medium">{step} / {totalSteps}</span>
        )}
      </div>

      {showProgress && (
        <div className="h-[2px] bg-neutral-100 relative">
          <motion.div
            className="absolute inset-y-0 left-0 bg-neutral-900"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
