"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

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
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="text-center mb-14">
          <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase mb-4">Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4 tracking-tight leading-tight">
            Unlock Your Full AI<br />Life Operating System
          </h1>
          <p className="text-neutral-500 text-base mb-8">Start free. Upgrade when you&apos;re ready.</p>

          <div className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`text-sm px-4 py-1.5 rounded-full transition-all cursor-pointer ${!annual ? "bg-neutral-900 text-white font-medium" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`text-sm px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-2 ${annual ? "bg-neutral-900 text-white font-medium" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              Annual
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-colors ${annual ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-500"}`}>−20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "bg-neutral-900 border-neutral-900"
                  : "bg-white border-neutral-200"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${plan.highlighted ? "text-white/50" : "text-neutral-400"}`}>
                  {plan.name}
                </p>
                <div className={`text-3xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-neutral-900"}`}>
                  {plan.price[annual ? "annual" : "monthly"] === 0
                    ? "Free"
                    : `$${plan.price[annual ? "annual" : "monthly"]}`}
                  {plan.price.monthly > 0 && (
                    <span className={`text-sm font-normal ml-1 ${plan.highlighted ? "text-white/40" : "text-neutral-400"}`}>/mo</span>
                  )}
                </div>
                <p className={`text-xs ${plan.highlighted ? "text-white/50" : "text-neutral-500"}`}>{plan.tagline}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-white/60" : "text-neutral-400"}`}
                      strokeWidth={2.5}
                    />
                    <span className={`text-sm ${plan.highlighted ? "text-white/70" : "text-neutral-600"}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-all inline-flex items-center justify-center ${
                  plan.highlighted
                    ? "bg-white text-neutral-900 hover:bg-neutral-100"
                    : "bg-neutral-900 text-white hover:bg-neutral-700 border border-neutral-900"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-neutral-900 font-bold text-2xl mb-8 text-center">Frequently asked</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
                <h3 className="text-neutral-900 font-medium text-sm mb-2">{faq.q}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16 pt-12 border-t border-neutral-100">
          <p className="text-neutral-500 text-sm mb-3">Not sure which plan is right for you?</p>
          <Link
            href="/contact"
            className="text-neutral-900 text-sm underline underline-offset-4 hover:text-neutral-500 cursor-pointer transition-colors"
          >
            Talk to us →
          </Link>
        </div>
      </div>
    </div>
  );
}
