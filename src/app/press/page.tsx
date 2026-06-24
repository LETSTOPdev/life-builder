import { StaticShell, StaticHeading } from "@/components/layout/static-shell";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

const coverage = [
  {
    outlet: "TechCrunch",
    headline: "Buildr wants to be the AI operating system for your entire life",
    date: "May 2026",
  },
  {
    outlet: "Product Hunt",
    headline: "#1 Product of the Day — \"The most thoughtful AI productivity tool we've seen\"",
    date: "April 2026",
  },
  {
    outlet: "The Hustle",
    headline: "This app quit the to-do list and built something better",
    date: "April 2026",
  },
];

const facts = [
  { value: "Apr 2026", label: "Founded" },
  { value: "50K+", label: "Active users" },
  { value: "4.9 ★", label: "App Store rating" },
  { value: "San Francisco", label: "HQ" },
];

export default function PressPage() {
  return (
    <StaticShell maxWidth="max-w-2xl">
      <StaticHeading
        label="Press"
        title="Press & Media."
        subtitle="Resources for journalists, podcasters, and content creators covering Buildr."
      />

      {/* Quick facts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {facts.map((f) => (
          <div key={f.label} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
            <p className="text-neutral-900 font-bold text-base">{f.value}</p>
            <p className="text-neutral-400 text-xs mt-0.5">{f.label}</p>
          </div>
        ))}
      </div>

      {/* Boilerplate */}
      <div className="mb-12">
        <h2 className="text-neutral-900 font-semibold text-base mb-3 pb-2 border-b border-neutral-100">About Buildr</h2>
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
          <p className="text-neutral-600 text-sm leading-relaxed">
            Buildr is the AI Life Operating System — a platform that helps individuals discover their potential, create personalized action plans, and build the daily habits that turn ambition into results. Founded in 2026 and headquartered in San Francisco, Buildr combines AI coaching, goal tracking, journaling, and behavioral analytics into a single, beautiful product. The company is backed by angel investors from Stripe, Google, and Meta.
          </p>
          <p className="text-neutral-400 text-xs mt-3 italic">Feel free to use this copy in your coverage.</p>
        </div>
      </div>

      {/* Coverage */}
      <div className="mb-12">
        <h2 className="text-neutral-900 font-semibold text-base mb-4 pb-2 border-b border-neutral-100">Coverage</h2>
        <div className="space-y-3">
          {coverage.map((item) => (
            <div key={item.outlet} className="bg-white border border-neutral-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-neutral-400 text-xs uppercase tracking-widest font-semibold mb-1">{item.outlet}</p>
                  <p className="text-neutral-900 text-sm font-medium leading-snug">{item.headline}</p>
                </div>
                <span className="text-neutral-400 text-xs flex-shrink-0">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assets + Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
          <Download className="w-4 h-4 text-neutral-400 mb-3" strokeWidth={1.5} />
          <p className="text-neutral-900 font-semibold text-sm mb-1">Media Kit</p>
          <p className="text-neutral-500 text-sm mb-4">Logos, screenshots, founder photos, and brand guidelines.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 border border-neutral-200 rounded-full px-3.5 py-1.5 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
          >
            Request kit <ArrowRight className="w-3 h-3" />
          </a>
        </div>
        <div className="bg-neutral-900 rounded-xl p-5">
          <p className="text-white font-semibold text-sm mb-1">Press inquiries</p>
          <p className="text-neutral-400 text-sm mb-4">
            We respond to media requests within one business day.
          </p>
          <a
            href="mailto:press@buildr.io"
            className="text-white text-sm underline underline-offset-2 hover:text-neutral-300 transition-colors"
          >
            press@buildr.io
          </a>
        </div>
      </div>
    </StaticShell>
  );
}
