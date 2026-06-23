"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    tagline: "Start your journey",
    features: [
      "Basic goal tracking",
      "3 active goals",
      "Daily Big 3",
      "Weekly summary",
      "AI coach (10 messages/mo)",
    ],
    cta: "Get Started Free",
    href: "/auth",
    highlighted: false,
  },
  {
    name: "Pro",
    price: { monthly: 19, annual: 15 },
    tagline: "For serious builders",
    features: [
      "Unlimited goals",
      "Unlimited AI coaching",
      "Advanced roadmaps",
      "Pattern recognition",
      "Career guidance",
      "Weekly strategy reviews",
    ],
    cta: "Start Pro Trial",
    href: "/auth",
    highlighted: true,
    badge: "Most popular",
  },
  {
    name: "Premium",
    price: { monthly: 49, annual: 39 },
    tagline: "For accelerated growth",
    features: [
      "Everything in Pro",
      "Business growth tools",
      "Opportunity engine",
      "Digital Twin memory",
      "Priority support",
    ],
    cta: "Start Premium Trial",
    href: "/auth",
    highlighted: false,
  },
  {
    name: "Elite",
    price: { monthly: 149, annual: 119 },
    tagline: "For maximum results",
    features: [
      "Everything in Premium",
      "1:1 strategy sessions",
      "Custom AI training",
      "White-glove onboarding",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

const faqs = [
  { q: "Can I switch plans?", a: "Yes, upgrade or downgrade anytime. Changes take effect immediately." },
  { q: "Is there a free trial?", a: "All paid plans include a 14-day free trial. No credit card required to start." },
  { q: "What happens to my data if I cancel?", a: "Your data is yours. Export everything before or after cancellation. We keep it for 30 days." },
  { q: "Do you offer refunds?", a: "Yes — full refund within 30 days of your first payment, no questions asked." },
  { q: "Is my data private?", a: "End-to-end encrypted. GDPR and CCPA compliant. We never sell your data." },
  { q: "Can I use Buildr for a team?", a: "Elite plan includes team management and org-level dashboards. Contact us for custom pricing." },
];

export default function UpgradePage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      {/* Nav */}
      <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <Zap className="w-3 h-3 text-black" fill="black" />
          </div>
          <span className="text-white font-semibold text-sm">Buildr</span>
        </Link>
        <Link href="/" className="text-[#555] hover:text-white text-sm cursor-pointer transition-colors">
          ← Back
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#555] text-xs font-medium tracking-widest uppercase mb-4">Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Unlock Your Full AI<br />Life Operating System
          </h1>
          <p className="text-[#555] text-base mb-8">Start free. Upgrade when you&apos;re ready.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 bg-[#161616] border border-white/12 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`text-sm px-4 py-1.5 rounded-full transition-all cursor-pointer ${!annual ? "bg-white text-black font-medium" : "text-[#555] hover:text-white"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`text-sm px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-2 ${annual ? "bg-white text-black font-medium" : "text-[#555] hover:text-white"}`}
            >
              Annual
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-colors ${annual ? "bg-black/10 text-black/60" : "bg-white/8 text-[#666]"}`}>−20%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "bg-white border-white"
                  : "bg-[#161616] border-white/12"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${plan.highlighted ? "text-black/40" : "text-[#555]"}`}>
                  {plan.name}
                </p>
                <div className={`text-3xl font-bold mb-1 ${plan.highlighted ? "text-black" : "text-white"}`}>
                  {plan.price[annual ? "annual" : "monthly"] === 0
                    ? "Free"
                    : `$${plan.price[annual ? "annual" : "monthly"]}`}
                  {plan.price.monthly > 0 && (
                    <span className={`text-sm font-normal ml-1 ${plan.highlighted ? "text-black/40" : "text-[#444]"}`}>/mo</span>
                  )}
                </div>
                <p className={`text-xs ${plan.highlighted ? "text-black/50" : "text-[#555]"}`}>{plan.tagline}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-black/60" : "text-white/40"}`}
                      strokeWidth={2.5}
                    />
                    <span className={`text-sm ${plan.highlighted ? "text-black/70" : "text-[#888]"}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all inline-flex items-center justify-center ${
                  plan.highlighted
                    ? "bg-black text-white hover:bg-black/80"
                    : "bg-white/8 text-white hover:bg-white/15 border border-white/12"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-white font-bold text-2xl mb-8 text-center">Frequently asked</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-[#161616] border border-white/12 rounded-xl p-5">
                <h3 className="text-white font-medium text-sm mb-2">{faq.q}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16 pt-12 border-t border-white/8">
          <p className="text-[#555] text-sm mb-3">Not sure which plan is right for you?</p>
          <Link
            href="/contact"
            className="text-white text-sm underline underline-offset-4 hover:text-white/70 cursor-pointer transition-colors"
          >
            Talk to us →
          </Link>
        </div>
      </div>
    </div>
  );
}
