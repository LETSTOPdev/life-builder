"use client";

import { motion } from "framer-motion";
import { Brain, Target, TrendingUp, Calendar, Sparkles, Shield, Zap, BarChart3 } from "lucide-react";

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
    <section id="features" className="py-28 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-[13px] font-medium tracking-widest uppercase text-white/30 mb-4">
            Everything you need
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight max-w-xl">
            Your complete life<br />operating system
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/6 border border-white/6 rounded-xl overflow-hidden">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="bg-[#0a0a0a] p-6 hover:bg-[#111] transition-colors duration-200 cursor-default"
              >
                <Icon className="w-4 h-4 text-white/40 mb-4" strokeWidth={1.5} />
                <h3 className="text-white font-medium text-sm mb-2">{feature.title}</h3>
                <p className="text-[#555] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
