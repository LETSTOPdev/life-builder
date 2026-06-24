"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Is Buildr really free to start?",
    a: "Yes. The Free plan is free forever — no credit card required. You get 3 active goals, daily planning, and basic AI coaching with 5 messages per day. Upgrade when you're ready for more.",
  },
  {
    q: "How is Buildr different from a to-do list?",
    a: "A to-do list captures tasks. Buildr understands you. It connects your daily actions to long-term goals, surfaces patterns in your behavior, adapts to your energy and context, and actively coaches you toward meaningful outcomes — not just completed checkboxes.",
  },
  {
    q: "What is the Digital Twin?",
    a: "Your Digital Twin is an evolving AI model built from your goals, habits, journals, and results. It learns what works for you specifically and uses that to give personalized recommendations that improve over time.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. No lock-in, no cancellation fees. Cancel from your account settings in under 30 seconds. You'll keep access until the end of your billing period.",
  },
  {
    q: "Is my data private and secure?",
    a: "Your data is end-to-end encrypted, never sold, and never used to train models for other users. We are GDPR and CCPA compliant. You can export or delete all your data at any time.",
  },
  {
    q: "Does Buildr work for teams?",
    a: "Yes. The Elite plan includes team management, an organization dashboard, shared templates, and SSO. Contact us for custom pricing on larger teams.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data is retained for 30 days after cancellation so you can re-activate anytime. After 30 days it is permanently deleted from our servers. You can also request immediate deletion from your settings.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-28 bg-white border-t border-neutral-100">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400 font-medium mb-4">FAQ</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
            Common questions
          </h2>
        </motion.div>

        <div className="divide-y divide-neutral-100">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer group"
              >
                <span className={`text-sm font-medium transition-colors ${open === i ? "text-neutral-900" : "text-neutral-700 group-hover:text-neutral-900"}`}>
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <Plus className="w-4 h-4 text-neutral-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-neutral-500 text-sm leading-relaxed pb-5">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
