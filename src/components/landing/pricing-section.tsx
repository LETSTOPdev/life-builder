"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Start your journey.",
    features: [
      "Up to 3 active goals",
      "Basic AI coaching (5/day)",
      "Daily planning",
      "7-day history",
    ],
    cta: "Get started",
    href: "/auth",
    highlight: false,
  },
  {
    name: "Pro",
    monthlyPrice: 19,
    annualPrice: 15,
    description: "For serious growth.",
    badge: "Most popular",
    features: [
      "Unlimited goals",
      "Unlimited AI coaching",
      "Digital Twin profile",
      "Weekly AI reviews",
      "Advanced analytics",
      "Goal templates",
    ],
    cta: "Start free trial",
    href: "/auth",
    highlight: true,
  },
  {
    name: "Premium",
    monthlyPrice: 39,
    annualPrice: 32,
    description: "Deep personalization.",
    features: [
      "Everything in Pro",
      "Advanced Digital Twin",
      "Pattern recognition AI",
      "Life correlation insights",
      "Custom AI personas",
      "API access",
    ],
    cta: "Start free trial",
    href: "/auth",
    highlight: false,
  },
  {
    name: "Elite",
    monthlyPrice: 99,
    annualPrice: 79,
    description: "For teams and orgs.",
    features: [
      "Everything in Premium",
      "Team management",
      "Organization dashboard",
      "Custom AI training",
      "Dedicated support",
      "SSO & SAML",
    ],
    cta: "Contact sales",
    href: "/contact",
    highlight: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-28 bg-[#0a0a0a] border-t border-white/6">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[13px] font-medium tracking-widest uppercase text-white/30 mb-4">
            Pricing
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Simple, transparent<br />pricing
            </h2>
            <div className="flex items-center gap-1 bg-[#111] border border-white/8 rounded-lg p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${!annual ? "bg-white text-black" : "text-[#555] hover:text-white"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${annual ? "bg-white text-black" : "text-[#555] hover:text-white"}`}
              >
                Annual
                <span className="text-[10px] bg-white/15 text-white/60 px-1.5 py-0.5 rounded font-medium">−20%</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className={`relative rounded-xl p-5 border flex flex-col ${
                plan.highlight
                  ? "bg-white text-black border-white"
                  : "bg-[#0f0f0f] border-white/8 text-white"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-4 text-[10px] font-semibold bg-black text-white px-2 py-0.5 rounded-full border border-white/12">
                  {plan.badge}
                </span>
              )}

              <div className="mb-5">
                <div className={`text-xs font-medium mb-1 ${plan.highlight ? "text-black/50" : "text-[#444]"}`}>
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold">
                    ${annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className={`text-sm ${plan.highlight ? "text-black/50" : "text-[#444]"}`}>/mo</span>
                  )}
                </div>
                <p className={`text-xs ${plan.highlight ? "text-black/50" : "text-[#444]"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 ${plan.highlight ? "text-black/50" : "text-[#444]"}`} />
                    <span className={`text-xs ${plan.highlight ? "text-black/80" : "text-[#888]"}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full text-sm font-medium py-2 rounded-lg cursor-pointer transition-colors inline-flex items-center justify-center ${
                  plan.highlight
                    ? "bg-black text-white hover:bg-black/80"
                    : "bg-white/8 text-white hover:bg-white/12 border border-white/8"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-[#333] text-xs mt-6">
          14-day free trial on all paid plans. No credit card required to start.
        </p>
      </div>
    </section>
  );
}
