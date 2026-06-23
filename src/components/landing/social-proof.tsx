"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager, Google",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    initials: "SC",
    quote: "The AI coach feels like having a brilliant friend who knows everything about me. I've hit 3× more goals this year than any year before.",
  },
  {
    name: "Marcus Johnson",
    role: "Entrepreneur & Investor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
    initials: "MJ",
    quote: "The weekly reviews surface patterns I'd never notice. My sleep quality directly correlates with productivity two days later — only Buildr caught that.",
  },
  {
    name: "Priya Patel",
    role: "Executive Coach",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop",
    initials: "PP",
    quote: "I recommend Buildr to every client. The Digital Twin is a genuine innovation — not another to-do list dressed up as AI.",
  },
  {
    name: "Tom Williams",
    role: "Freelance Designer",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop",
    initials: "TW",
    quote: "First productivity tool that actually sticks. It understands me, not just my tasks. The difference is real.",
  },
];

const stats = [
  { value: "12K+", label: "career transitions" },
  { value: "3,400+", label: "businesses launched" },
  { value: "8,200+", label: "clients acquired" },
  { value: "4.9", label: "App Store rating" },
];

export function SocialProofSection() {
  return (
    <section className="py-28 bg-[#0a0a0a] border-t border-white/6">
      <div className="max-w-5xl mx-auto px-6">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[#444] text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-white tracking-tight max-w-2xl">
            Thousands are already building better careers, businesses, and lives.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#0f0f0f] border border-white/6 rounded-xl p-6"
            >
              <blockquote className="text-[#888] text-sm leading-relaxed mb-5">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback className="bg-[#1a1a1a] text-white text-xs">{t.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="text-[#444] text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
