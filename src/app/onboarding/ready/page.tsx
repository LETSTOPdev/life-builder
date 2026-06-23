"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-8"
        >
          <Zap className="w-6 h-6 text-black" fill="black" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Your Buildr Workspace<br />Is Ready.
        </h1>
        <p className="text-[#444] text-sm mb-10">Everything is set up and personalized for you.</p>

        {/* Feature list */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-left bg-[#0f0f0f] border border-white/6 rounded-xl p-5 mb-8 space-y-3"
        >
          {features.map((feature) => (
            <motion.div key={feature} variants={item} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-white/60" strokeWidth={2.5} />
              </div>
              <span className="text-white/70 text-sm">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black font-semibold py-3.5 rounded-xl text-sm cursor-pointer hover:bg-white/90 transition-colors"
            >
              Enter Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
