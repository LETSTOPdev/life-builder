"use client";

import { motion } from "framer-motion";

const companies = [
  "Google", "Stripe", "Notion", "Figma", "Linear",
  "Vercel", "Shopify", "Airbnb", "Atlassian", "HubSpot",
];

export function LogoStrip() {
  return (
    <section className="py-12 bg-neutral-50 border-y border-neutral-100 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 mb-6">
        <p className="text-center text-xs text-neutral-400 uppercase tracking-[0.18em] font-medium">
          Trusted by builders at
        </p>
      </div>
      <div className="relative">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...companies, ...companies].map((name, i) => (
            <span
              key={i}
              className="text-neutral-300 font-semibold text-sm tracking-tight flex-shrink-0 hover:text-neutral-500 transition-colors cursor-default"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
