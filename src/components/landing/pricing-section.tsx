"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Start your journey.",
    planKey: null,
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
    planKey: "pro",
    features: [
      "Unlimited goals",
      "Unlimited AI coaching",
      "Digital Twin profile",
      "Weekly AI reviews",
      "Advanced analytics",
      "Goal templates",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Premium",
    monthlyPrice: 39,
    annualPrice: 32,
    description: "Deep personalization.",
    planKey: "premium",
    features: [
      "Everything in Pro",
      "Advanced Digital Twin",
      "Pattern recognition AI",
      "Life correlation insights",
      "Custom AI personas",
      "API access",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Elite",
    monthlyPrice: 99,
    annualPrice: 79,
    description: "For teams and orgs.",
    planKey: null,
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
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planKey: string) => {
    setLoading(planKey);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, billing: annual ? "annual" : "monthly" }),
      });
      const data = await res.json();

      if (res.status === 401) {
        // Not logged in — send to signup first
        window.location.href = `/auth?plan=${planKey}&billing=${annual ? "annual" : "monthly"}`;
        return;
      }

      if (!res.ok) {
        toast.error(data.error ?? "Could not start checkout. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-28 bg-neutral-50 border-t border-neutral-100">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400 font-medium mb-4">
            Pricing
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
              Simple, transparent<br />pricing
            </h2>
            <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  !annual ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  annual ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                Annual
                <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded font-medium">−20%</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {plans.map((plan, i) => {
            const isLoading = loading === plan.planKey;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className={`relative rounded-2xl p-5 border flex flex-col ${
                  plan.highlight
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white border-neutral-200 text-neutral-900"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-4 text-[10px] font-semibold bg-neutral-900 text-white px-2 py-0.5 rounded-full">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-5">
                  <div className="text-xs font-medium mb-1 text-neutral-400">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold">
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-sm text-neutral-400">/mo</span>
                    )}
                  </div>
                  <p className={`text-xs ${plan.highlight ? "text-neutral-400" : "text-neutral-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
                      <span className={`text-xs ${plan.highlight ? "text-neutral-300" : "text-neutral-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.planKey ? (
                  <button
                    onClick={() => handleUpgrade(plan.planKey!)}
                    disabled={isLoading || loading !== null}
                    className={`w-full text-sm font-medium py-2.5 rounded-full cursor-pointer transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                      plan.highlight
                        ? "bg-white text-neutral-900 hover:bg-neutral-100"
                        : "bg-neutral-900 text-white hover:bg-neutral-700"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Redirecting…
                      </>
                    ) : plan.cta}
                  </button>
                ) : (
                  <Link
                    href={plan.href ?? "/auth"}
                    className={`w-full text-sm font-medium py-2.5 rounded-full cursor-pointer transition-colors inline-flex items-center justify-center ${
                      plan.highlight
                        ? "bg-white text-neutral-900 hover:bg-neutral-100"
                        : "bg-neutral-900 text-white hover:bg-neutral-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-neutral-400 text-xs mt-6">
          14-day free trial on all paid plans. No credit card required to start.
        </p>
      </div>
    </section>
  );
}
