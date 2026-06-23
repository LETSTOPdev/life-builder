"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Discover your strengths",
    description: "Answer a few questions about where you are and where you want to go. Takes less than 3 minutes.",
  },
  {
    number: "2",
    title: "Get your personalized roadmap",
    description: "Buildr analyzes your goals and creates a custom plan built around your time and situation.",
  },
  {
    number: "3",
    title: "Take your Daily Big 3 actions",
    description: "Every day you get three high-impact actions chosen by AI to move you forward consistently.",
  },
  {
    number: "4",
    title: "Track progress and improve",
    description: "Weekly reviews surface insights and continuously refine your strategy based on real results.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 bg-[#0a0a0a] border-t border-white/6">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-[13px] font-medium tracking-widest uppercase text-white/30 mb-4">
            Simple process
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Up and running<br />in minutes
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="text-[11px] font-mono text-white/20 mb-4 tracking-widest">
                0{step.number}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
              <p className="text-[#555] text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
