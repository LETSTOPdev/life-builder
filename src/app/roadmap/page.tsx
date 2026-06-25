import { StaticShell, StaticHeading } from "@/components/layout/static-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "See what Buildr is building next — upcoming features, improvements, and our product vision.",
};

const quarters = [
  {
    label: "Q2 2026",
    status: "In progress",
    statusColor: "bg-blue-100 text-blue-700",
    items: [
      { title: "Digital Twin v2", detail: "Long-term memory, cross-session context, behavioral fingerprinting", done: false },
      { title: "Integrations (Calendar, Notion)", detail: "Sync your tasks and goals with tools you already use", done: false },
      { title: "Mobile apps (iOS & Android)", detail: "Full-featured native apps with offline support", done: false },
      { title: "Streak recovery system", detail: "Graceful handling of missed days with catch-up logic", done: true },
    ],
  },
  {
    label: "Q3 2026",
    status: "Planned",
    statusColor: "bg-neutral-100 text-neutral-600",
    items: [
      { title: "Voice journaling", detail: "Speak your journal entry, AI transcribes and extracts insights", done: false },
      { title: "Team goals & org dashboard", detail: "Shared goals, manager view, team analytics for Elite plan", done: false },
      { title: "Public accountability partners", detail: "Opt-in to share progress with a friend or coach", done: false },
      { title: "Zapier & Make integrations", detail: "Connect Buildr to 5,000+ apps via no-code automation", done: false },
    ],
  },
  {
    label: "Q4 2026",
    status: "Planned",
    statusColor: "bg-neutral-100 text-neutral-600",
    items: [
      { title: "Coaching marketplace", detail: "Book sessions with certified human coaches directly in Buildr", done: false },
      { title: "Advanced reporting", detail: "Exportable PDF reports for quarterly reviews and coaching sessions", done: false },
      { title: "Habit stacking", detail: "AI-designed habit chains that trigger automatically", done: false },
      { title: "Milestone celebrations", detail: "Shareable achievement cards when you hit major milestones", done: false },
    ],
  },
  {
    label: "Q1 2026 (Done)",
    status: "Shipped",
    statusColor: "bg-emerald-100 text-emerald-700",
    items: [
      { title: "Daily Big 3", detail: "AI-curated top 3 actions per day", done: true },
      { title: "AI Coach", detail: "Conversational coaching backed by your goal history", done: true },
      { title: "Journal with mood & insights", detail: "Full journal with AI summaries and mood tracking", done: true },
      { title: "Analytics dashboard", detail: "Weekly activity chart, life-area breakdown, KPI cards", done: true },
      { title: "Annual billing", detail: "Save 20% by paying yearly", done: true },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <StaticShell maxWidth="max-w-2xl">
      <StaticHeading
        label="Roadmap"
        title="What we&apos;re building next."
        subtitle="A living document. We ship fast and update this often — suggest features via the button below."
      />

      <div className="space-y-12 mb-10">
        {quarters.map((q) => (
          <div key={q.label}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-neutral-900 font-bold text-base">{q.label}</h2>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${q.statusColor}`}>
                {q.status}
              </span>
            </div>

            <div className="space-y-2">
              {q.items.map((item) => (
                <div
                  key={item.title}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${
                    item.done
                      ? "bg-neutral-50 border-neutral-100 opacity-60"
                      : "bg-white border-neutral-200"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                    item.done ? "bg-neutral-400 border-neutral-400" : "border-neutral-300"
                  }`}>
                    {item.done && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${item.done ? "line-through text-neutral-400" : "text-neutral-900"}`}>
                      {item.title}
                    </p>
                    <p className="text-neutral-500 text-xs leading-relaxed mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 text-center">
        <p className="text-neutral-900 font-medium text-sm mb-1">Have a feature request?</p>
        <p className="text-neutral-500 text-sm mb-4">We genuinely read every suggestion and vote on them as a team.</p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-700 transition-colors"
        >
          Suggest a feature
        </a>
      </div>
    </StaticShell>
  );
}
