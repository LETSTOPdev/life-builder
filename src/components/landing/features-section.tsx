"use client";

import { motion } from "framer-motion";
import { Brain, Target, TrendingUp, Calendar, Sparkles, Shield, Zap, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Brain,
    title: "AI Life Coach",
    description: "Learns your patterns over time. Gives guidance that actually fits your life — not generic productivity advice.",
  },
  {
    icon: Target,
    title: "Smart Goal Setting",
    description: "Break big ambitions into milestones with built-in accountability. AI flags when your goals conflict or drift.",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "See growth across health, career, relationships, and finances in one clean dashboard.",
  },
  {
    icon: Calendar,
    title: "Daily Planning",
    description: "AI-curated daily plans that align your tasks with long-term goals. Adapts to your energy levels.",
  },
  {
    icon: Sparkles,
    title: "Digital Twin",
    description: "A model of you that learns from every interaction. Personalized recommendations that evolve as you do.",
  },
  {
    icon: BarChart3,
    title: "Weekly Reviews",
    description: "Automated reviews surface patterns, celebrate wins, and recalibrate your approach every week.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "End-to-end encrypted. GDPR and CCPA compliant. Export or delete everything at any time.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description: "Real-time pattern recognition that surfaces connections you'd never find on your own.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-white border-t border-neutral-100">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400 font-medium mb-4">
            Everything you need
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight tracking-tight max-w-xl">
              Your complete life<br />operating system
            </h2>
            <Link href="/auth/signup" className="hidden sm:inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 text-sm transition-colors border-b border-neutral-200 hover:border-neutral-500 pb-px">
              Get started free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Spotlight feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 bg-neutral-900 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-start gap-8"
        >
          <div className="flex-1">
            <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-neutral-400 bg-white/10 px-2.5 py-1 rounded-full mb-5">
              Core feature
            </span>
            <h3 className="text-white text-2xl sm:text-3xl font-bold tracking-tight mb-4 leading-tight">
              Your Digital Twin —<br />an AI that truly knows you
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
              Unlike generic AI assistants, your Digital Twin builds a model of you from your goals, habits, journals, and results. Every week it gets smarter. Every recommendation gets more precise. It's the difference between advice and insight.
            </p>
          </div>
          <div className="w-full sm:w-64 flex-shrink-0 bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
            {[
              { label: "Sleep → Productivity", correlation: "+0.82", positive: true },
              { label: "Morning runs → Mood", correlation: "+0.74", positive: true },
              { label: "Late screens → Focus", correlation: "−0.61", positive: false },
              { label: "Journal streak → Goals", correlation: "+0.91", positive: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-2">
                <span className="text-neutral-400 text-xs">{item.label}</span>
                <span className={`text-xs font-mono font-semibold ${item.positive ? "text-emerald-400" : "text-red-400"}`}>
                  {item.correlation}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] text-neutral-500">Correlation insights · updated weekly</p>
            </div>
          </div>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="bg-white p-6 hover:bg-neutral-50 transition-colors duration-200 cursor-default"
              >
                <Icon className="w-4 h-4 text-neutral-400 mb-4" strokeWidth={1.5} />
                <h3 className="text-neutral-900 font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
