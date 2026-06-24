import { StaticShell, StaticHeading } from "@/components/layout/static-shell";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "How does the AI coach work?",
    a: "Buildr's AI coach learns from your goals, daily actions, and progress patterns to deliver personalized guidance. It adapts to your pace and flags when you're off track — like a coach who actually knows you.",
  },
  {
    q: "What is the Daily Big 3?",
    a: "Each day, Buildr identifies the three highest-impact actions you can take to move toward your goals. These are prioritized by AI based on your current momentum, deadlines, and past patterns.",
  },
  {
    q: "Can I change my goals after onboarding?",
    a: "Yes. You can add, edit, or remove goals at any time from the Goals dashboard. Your AI plan will update automatically to reflect the changes.",
  },
  {
    q: "Is my data private?",
    a: "Your journal entries, goals, and personal data are private by default. We never sell your data. See our Privacy Policy for full details.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Go to Dashboard → Settings → Billing → Cancel Plan. Your access continues until the end of the current billing period.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Go to Settings → Account → Export Data. You'll receive a downloadable archive of all your goals, journal entries, and progress history.",
  },
  {
    q: "What's the difference between Pro and Premium?",
    a: "Pro gives you unlimited goals and AI coaching. Premium adds advanced Digital Twin memory, pattern recognition across life areas, and deeper AI personalization. See the Pricing page for a full comparison.",
  },
  {
    q: "Do you offer team or business plans?",
    a: "Yes — our Elite plan supports teams. Contact us at hello@buildr.io for enterprise pricing and custom onboarding.",
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

      <div className="space-y-4 mb-16">
        {faqs.map((faq) => (
          <div key={faq.q} className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
            <h3 className="text-neutral-900 font-medium text-sm mb-2">{faq.q}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-center">
        <p className="text-neutral-900 font-medium mb-1">Still need help?</p>
        <p className="text-neutral-500 text-sm mb-4">Our team responds within 24 hours.</p>
        <Link href="/contact" className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer hover:bg-neutral-700 transition-colors group">
          Contact Support
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </StaticShell>
  );
}
