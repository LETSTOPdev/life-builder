"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32 bg-[#0a0a0a] border-t border-white/6">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-8 max-w-2xl">
            Get Started Free
          </h2>
          <p className="text-[#555] text-base mb-8 max-w-md">
            For the first time, know exactly what you should do next.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link
              href="/auth"
              className="bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-white/90 transition-colors cursor-pointer inline-flex items-center gap-2 group"
            >
              Start Free
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/upgrade"
              className="text-[#555] hover:text-white text-sm px-5 py-2.5 transition-colors cursor-pointer inline-flex items-center"
            >
              View plans
            </Link>
          </div>
          <p className="text-[#333] text-xs mt-4">Free plan available. No credit card needed.</p>
        </motion.div>
      </div>
    </section>
  );
}
