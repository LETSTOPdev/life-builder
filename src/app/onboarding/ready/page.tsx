"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, Zap } from "lucide-react";
import { useOnboarding } from "@/context/onboarding-context";

const features = [
  "Personalized roadmap",
  "Daily AI coach",
  "Progress tracker",
  "Weekly strategy reviews",
  "AI guidance & insights",
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function ReadyPage() {
  const router = useRouter();
  const { data } = useOnboarding();
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    // Persist onboarding personality to DB so AI features can use it everywhere
    fetch("/api/user/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
  }, [data]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto mb-8"
        >
          <Zap className="w-6 h-6 text-white" fill="white" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          Your Buildr Workspace<br />Is Ready.
        </h1>
        <p className="text-neutral-400 text-sm mb-10">Everything is set up and personalized for you.</p>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-left bg-neutral-50 border border-neutral-200 rounded-xl p-5 mb-8 space-y-3"
        >
          {features.map((feature) => (
            <motion.div key={feature} variants={item} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-neutral-200 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-neutral-600" strokeWidth={2.5} />
              </div>
              <span className="text-neutral-700 text-sm">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dashboard")}
            className="w-full bg-neutral-900 text-white font-semibold py-3.5 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors"
          >
            Enter Dashboard
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
