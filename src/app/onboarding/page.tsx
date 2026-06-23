"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Zap } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col">
      <div className="px-6 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 cursor-pointer w-fit">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <Zap className="w-3 h-3 text-black" fill="black" />
          </div>
          <span className="text-white font-semibold text-sm">Buildr</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
            <Zap className="w-5 h-5 text-white/60" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Let&apos;s figure out<br />your next chapter.
          </h1>

          <p className="text-[#555] text-base mb-2">This takes less than 3 minutes.</p>
          <p className="text-[#444] text-sm mb-10">You&apos;ll get a personalized action plan immediately.</p>

          <Link href="/onboarding/direction">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black font-semibold py-3.5 px-6 rounded-xl text-sm cursor-pointer hover:bg-white/90 transition-colors flex items-center justify-center gap-2 group"
            >
              Let&apos;s Begin
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </Link>

          <p className="text-[#222] text-xs mt-5">No credit card · Free to start · 3 min setup</p>
        </motion.div>
      </div>
    </div>
  );
}
