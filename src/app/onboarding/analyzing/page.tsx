"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

const steps = [
  "Analyzing your goals...",
  "Finding opportunities...",
  "Building your roadmap...",
  "Calculating strengths...",
  "Creating action plan...",
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(() => router.push("/onboarding/breakthrough"), 600);
          }, 700);
          return prev;
        }
        return prev + 1;
      });
    }, 650);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: done ? 0 : 1, scale: done ? 0.95 : 1 }}
        transition={{ duration: 0.4 }}
        className="text-center w-full max-w-sm"
      >
        <div className="relative w-16 h-16 mx-auto mb-10">
          <motion.div
            className="absolute inset-0 rounded-2xl border border-neutral-200"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-xl border border-neutral-100"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-5 h-5 text-neutral-400" />
          </div>
        </div>

        <div className="relative h-7 mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-neutral-900 text-lg font-medium absolute inset-0 flex items-center justify-center"
            >
              {steps[current]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full bg-neutral-200"
              animate={{
                width: i === current ? 20 : 4,
                opacity: i <= current ? 1 : 0.3,
                backgroundColor: i <= current ? "#171717" : "#e5e5e5",
              }}
              style={{ height: 4 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
