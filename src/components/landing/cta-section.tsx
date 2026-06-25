"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AuroraLights } from "@/components/ui/aurora-lights";

export function CTASection() {
  return (
    <section className="relative py-32 bg-white border-t border-neutral-100 overflow-hidden">
      <AuroraLights showRadialGradient={false} className="opacity-60" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400 font-medium mb-6">
            Get started today
          </p>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-tight leading-[1.05] mb-8 max-w-2xl">
            Start building the life you want.
          </h2>
          <p className="text-neutral-500 text-lg mb-10 max-w-md leading-relaxed">
            Set goals, get AI coaching, track your wins. Buildr becomes smarter about you every single day.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-neutral-700 transition-colors"
            >
              Start free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/upgrade"
              className="text-neutral-500 hover:text-neutral-800 text-sm py-3.5 transition-colors border-b border-neutral-200 hover:border-neutral-500 pb-px"
            >
              View pricing plans
            </Link>
          </div>
          <p className="text-neutral-400 text-xs mt-5">Free plan available · No credit card needed · Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  );
}
