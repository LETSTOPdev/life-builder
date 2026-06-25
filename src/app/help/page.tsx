import { StaticShell, StaticHeading } from "@/components/layout/static-shell";
import Link from "next/link";
import { ArrowRight, MessageCircle, CreditCard, Settings, Lock, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers to common questions about getting started, billing, privacy, and Buildr features.",
};

const categories = [
  { icon: Zap, label: "Getting Started", href: "#getting-started" },
  { icon: Settings, label: "Features", href: "#features" },
  { icon: CreditCard, label: "Billing", href: "#billing" },
  { icon: Lock, label: "Privacy & Security", href: "#privacy" },
];

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    faqs: [
      {
        q: "How does the AI coach work?",
        a: "Buildr's AI coach learns from your goals, daily actions, and progress patterns to deliver personalized guidance. It adapts to your pace and flags when you're off track — like a coach who actually knows you.",
      },
      {
        q: "What is the Daily Big 3?",
        a: "Each day, Buildr identifies the three highest-impact actions you can take to move toward your goals. These are prioritized by AI based on your current momentum, deadlines, and past patterns.",
      },
      {
        q: "How long does onboarding take?",
        a: "About 3–5 minutes. We ask a handful of questions to understand your goals and situation, then generate your personalized roadmap. You'll have your first Daily Big 3 actions the same day.",
      },
    ],
  },
  {
    id: "features",
    title: "Features",
    faqs: [
      {
        q: "Can I change my goals after onboarding?",
        a: "Yes. You can add, edit, or remove goals at any time from the Goals dashboard. Your AI plan will update automatically to reflect the changes.",
      },
      {
        q: "What is the Digital Twin?",
        a: "Your Digital Twin is an evolving AI model built from your goals, habits, journals, and results. It learns what works specifically for you and gets smarter every week.",
      },
      {
        q: "What's the difference between Pro and Premium?",
        a: "Pro gives you unlimited goals and AI coaching. Premium adds advanced Digital Twin memory, pattern recognition across life areas, and deeper AI personalization. See the Pricing page for a full comparison.",
      },
      {
        q: "Do you offer team or business plans?",
        a: "Yes — our Elite plan supports teams with org-level dashboards, SSO, and a dedicated account manager. Contact us at hello@buildr.io for enterprise pricing.",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing",
    faqs: [
      {
        q: "How do I cancel my subscription?",
        a: "Go to Dashboard → Settings → Billing → Cancel Plan. Your access continues until the end of the current billing period. No cancellation fees, ever.",
      },
      {
        q: "Is there a free trial on paid plans?",
        a: "Yes. All paid plans include a 14-day free trial. No credit card required to start.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes. If you cancel within 7 days of a charge, email support@buildr.io and we'll refund you in full, no questions asked.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    faqs: [
      {
        q: "Is my data private?",
        a: "Your journal entries, goals, and personal data are end-to-end encrypted and private by default. We never sell your data. See our Privacy Policy for full details.",
      },
      {
        q: "Can I export my data?",
        a: "Yes. Go to Settings → Account → Export Data. You'll receive a downloadable archive of all your goals, journal entries, and progress history.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Settings → Account → Delete Account. All data is permanently deleted within 30 days. You can also request immediate deletion by emailing privacy@buildr.io.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <StaticShell maxWidth="max-w-3xl">
      <StaticHeading
        label="Help Center"
        title="How can we help?"
        subtitle="Answers to the most common questions about Buildr."
      />

      {/* Category quick-links */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2 hover:border-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            {label}
          </a>
        ))}
      </div>

      {/* Categorized FAQ sections */}
      <div className="space-y-12 mb-16">
        {sections.map((section) => (
          <div key={section.id} id={section.id}>
            <h2 className="text-neutral-900 font-semibold text-base mb-4 pb-2 border-b border-neutral-100">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.faqs.map((faq) => (
                <div key={faq.q} className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
                  <h3 className="text-neutral-900 font-medium text-sm mb-2">{faq.q}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Still need help */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-neutral-900 font-medium text-sm mb-1">Still need help?</p>
            <p className="text-neutral-500 text-sm mb-4">
              Our team is real humans who read every message. We respond within 24 hours on weekdays.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer hover:bg-neutral-700 transition-colors group"
            >
              Contact Support
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </StaticShell>
  );
}
