"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager, Google",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    initials: "SC",
    stars: 5,
    quote: "The AI coach feels like having a brilliant friend who knows everything about me. I've hit 3× more goals this year than any year before.",
  },
  {
    name: "Marcus Johnson",
    role: "Entrepreneur & Investor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
    initials: "MJ",
    stars: 5,
    quote: "The weekly reviews surface patterns I'd never notice. My sleep quality directly correlates with productivity two days later — only Buildr caught that.",
  },
  {
    name: "Priya Patel",
    role: "Executive Coach",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop",
    initials: "PP",
    stars: 5,
    quote: "I recommend Buildr to every client. The Digital Twin is a genuine innovation — not another to-do list dressed up as AI.",
  },
  {
    name: "Tom Williams",
    role: "Freelance Designer",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop",
    initials: "TW",
    stars: 5,
    quote: "First productivity tool that actually sticks. It understands me, not just my tasks. The difference is real.",
  },
  {
    name: "Aisha Kamara",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop",
    initials: "AK",
    stars: 5,
    quote: "I was skeptical about another 'AI productivity app'. Buildr is the first one that changed how I actually live — not just how I organize.",
  },
  {
    name: "Daniel Park",
    role: "Startup Founder",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
    initials: "DP",
    stars: 5,
    quote: "Went from overwhelmed to focused in a week. The Daily Big 3 is deceptively simple — it's what I needed all along.",
  },
];

const stats = [
  { value: "12K+", label: "career transitions" },
  { value: "3,400+", label: "businesses launched" },
  { value: "8,200+", label: "clients acquired" },
  { value: "4.9★", label: "App Store rating" },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3 h-3 fill-neutral-900 text-neutral-900" />
      ))}
    </div>
  );
}

export function SocialProofSection() {
  return (
    <section className="py-28 bg-white border-t border-neutral-100">
      <div className="max-w-5xl mx-auto px-6">
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24 pb-16 border-b border-neutral-100"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</div>
              <div className="text-neutral-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400 font-medium mb-4">Testimonials</p>
          <h2 className="text-4xl font-bold text-neutral-900 tracking-tight max-w-2xl">
            Thousands are already building better careers, businesses, and lives.
          </h2>
        </motion.div>

        <div className="columns-1 md:columns-2 gap-4 space-y-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="break-inside-avoid bg-neutral-50 border border-neutral-100 rounded-2xl p-6 hover:border-neutral-200 transition-colors"
            >
              <Stars count={t.stars} />
              <blockquote className="text-neutral-600 text-sm leading-relaxed mb-5">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback className="bg-neutral-200 text-neutral-600 text-xs">{t.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-neutral-900 text-sm font-medium">{t.name}</div>
                  <div className="text-neutral-400 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
