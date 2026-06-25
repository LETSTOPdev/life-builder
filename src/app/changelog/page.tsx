import { StaticShell, StaticHeading } from "@/components/layout/static-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new in Buildr — features shipped, improvements made, bugs fixed.",
};

const entries = [
  {
    version: "v1.4.0",
    date: "June 20, 2026",
    badge: "Major",
    badgeColor: "bg-neutral-900 text-white",
    items: [
      { type: "New", text: "Digital Twin — personalized AI memory that learns your patterns over time" },
      { type: "New", text: "Correlation insights panel in Analytics showing sleep, mood, and productivity links" },
      { type: "New", text: "Weekly strategy review auto-generated every Sunday night" },
      { type: "Improved", text: "AI Coach responses are now 40% faster with better context retention" },
    ],
  },
  {
    version: "v1.3.2",
    date: "June 4, 2026",
    badge: "Fix",
    badgeColor: "bg-neutral-100 text-neutral-600",
    items: [
      { type: "Fixed", text: "Goal progress not updating after journal entry in some timezones" },
      { type: "Fixed", text: "Mobile sidebar overlapping content on small screens" },
      { type: "Improved", text: "Streak counter now correctly handles midnight edge cases" },
    ],
  },
  {
    version: "v1.3.0",
    date: "May 22, 2026",
    badge: "Minor",
    badgeColor: "bg-neutral-100 text-neutral-600",
    items: [
      { type: "New", text: "Daily Big 3 — AI picks your three highest-impact actions each morning" },
      { type: "New", text: "Goal categories: Health, Career, Learning, Finance, Other" },
      { type: "New", text: "Mood filter on Journal page" },
      { type: "Improved", text: "Onboarding flow reduced from 12 steps to 8" },
    ],
  },
  {
    version: "v1.2.0",
    date: "May 5, 2026",
    badge: "Minor",
    badgeColor: "bg-neutral-100 text-neutral-600",
    items: [
      { type: "New", text: "Analytics dashboard with weekly activity bar chart and life-area breakdown" },
      { type: "New", text: "Progress export to CSV from Settings → Account" },
      { type: "Improved", text: "Dashboard loads 2× faster with server-side data prefetching" },
      { type: "Fixed", text: "Notification preferences not persisting after page reload" },
    ],
  },
  {
    version: "v1.1.0",
    date: "April 17, 2026",
    badge: "Minor",
    badgeColor: "bg-neutral-100 text-neutral-600",
    items: [
      { type: "New", text: "AI Coach — conversational coaching powered by your goal history" },
      { type: "New", text: "Journal with mood tracking, tags, and AI-generated insights" },
      { type: "New", text: "Annual billing option (save 20%)" },
    ],
  },
  {
    version: "v1.0.0",
    date: "April 1, 2026",
    badge: "Launch",
    badgeColor: "bg-emerald-100 text-emerald-700",
    items: [
      { type: "New", text: "Buildr is live — goal tracking, AI roadmaps, and progress analytics" },
      { type: "New", text: "Onboarding flow with personalized plan generation" },
      { type: "New", text: "Free, Pro, Premium, and Elite plans available" },
    ],
  },
];

const typeColors: Record<string, string> = {
  New: "text-emerald-600 bg-emerald-50",
  Improved: "text-blue-600 bg-blue-50",
  Fixed: "text-orange-600 bg-orange-50",
};

export default function ChangelogPage() {
  return (
    <StaticShell maxWidth="max-w-2xl">
      <StaticHeading
        label="Changelog"
        title="What&apos;s new in Buildr."
        subtitle="New features, improvements, and fixes — updated with every release."
      />

      <div className="space-y-10">
        {entries.map((entry) => (
          <div key={entry.version} className="relative pl-6 border-l border-neutral-200">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-neutral-300" />

            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-neutral-900 font-bold text-sm">{entry.version}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${entry.badgeColor}`}>
                {entry.badge}
              </span>
              <span className="text-neutral-400 text-xs">{entry.date}</span>
            </div>

            <div className="space-y-2">
              {entry.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded mt-0.5 ${typeColors[item.type] ?? "text-neutral-500 bg-neutral-100"}`}>
                    {item.type}
                  </span>
                  <p className="text-neutral-600 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </StaticShell>
  );
}
