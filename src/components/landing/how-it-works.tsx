"use client";

import { motion } from "framer-motion";
import { ClipboardList, Cpu, Flame, BarChart2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Discover your strengths",
    description: "Answer a few questions about where you are and where you want to go. Takes less than 3 minutes.",
    detail: "We analyze your situation, goals, and ambitions to understand what success means to you.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Get your personalized roadmap",
    description: "Buildr analyzes your goals and creates a custom plan built around your time and situation.",
    detail: "Your roadmap breaks big ambitions into concrete milestones with clear timelines.",
  },
  {
    number: "03",
    icon: Flame,
    title: "Take your Daily Big 3 actions",
    description: "Every day you get three high-impact actions chosen by AI to move you forward consistently.",
    detail: "Designed around your energy levels and schedule — never overwhelming, always meaningful.",
  },
  {
    number: "04",
    icon: BarChart2,
    title: "Track progress and improve",
    description: "Weekly reviews surface insights and continuously refine your strategy based on real results.",
    detail: "Your Digital Twin learns what works for you and gets smarter every single week.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 bg-neutral-50 border-t border-neutral-100">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400 font-medium mb-4">
            Simple process
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
            Up and running<br />in minutes
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-7 left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] h-px bg-neutral-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="relative z-10"
                >
                  {/* Step icon/number */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-14 h-14 rounded-xl bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-neutral-300 mb-2 tracking-widest">{step.number}</div>
                  <h3 className="text-neutral-900 font-semibold text-sm mb-2 leading-snug">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-3">{step.description}</p>
                  <p className="text-neutral-400 text-xs leading-relaxed border-l-2 border-neutral-200 pl-3">
                    {step.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="text-neutral-900 font-semibold text-base">Ready to find your path?</p>
            <p className="text-neutral-500 text-sm mt-1">Answer 5 questions. Get your roadmap in 60 seconds.</p>
          </div>
          <a
            href="/auth/signup"
            className="flex-shrink-0 bg-neutral-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-neutral-700 transition-colors"
          >
            Start for free
          </a>
        </motion.div>
      </div>
    </section>
  );
}
