import { StaticShell, StaticHeading } from "@/components/layout/static-shell";
import Link from "next/link";
import { ArrowRight, Terminal, Key, Webhook, BookOpen, Zap, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Docs",
  description: "REST API reference for integrating Buildr into your own tools and workflows.",
};

const sections = [
  {
    icon: Key,
    title: "Authentication",
    id: "auth",
    content: [
      { label: "All API requests require an API key in the Authorization header.", code: null },
      { label: "Authorization header format:", code: "Authorization: Bearer YOUR_API_KEY" },
      { label: "Get your API key from Dashboard → Settings → API Keys.", code: null },
    ],
  },
  {
    icon: Terminal,
    title: "Goals API",
    id: "goals",
    content: [
      { label: "List all goals", code: "GET /api/v1/goals" },
      { label: "Create a goal", code: "POST /api/v1/goals" },
      { label: "Update a goal", code: "PATCH /api/v1/goals/:id" },
      { label: "Delete a goal", code: "DELETE /api/v1/goals/:id" },
    ],
  },
  {
    icon: BookOpen,
    title: "Journal API",
    id: "journal",
    content: [
      { label: "List journal entries", code: "GET /api/v1/journal" },
      { label: "Create an entry", code: "POST /api/v1/journal" },
      { label: "Filter by mood", code: "GET /api/v1/journal?mood=great" },
      { label: "Delete an entry", code: "DELETE /api/v1/journal/:id" },
    ],
  },
  {
    icon: Zap,
    title: "Analytics API",
    id: "analytics",
    content: [
      { label: "Get KPI summary", code: "GET /api/v1/analytics" },
      { label: "Get weekly performance", code: "GET /api/v1/analytics/weekly" },
      { label: "Get life area breakdown", code: "GET /api/v1/analytics/areas" },
    ],
  },
  {
    icon: Webhook,
    title: "Webhooks",
    id: "webhooks",
    content: [
      { label: "Buildr can POST events to your endpoint on goal completion, streak milestones, and weekly reviews.", code: null },
      { label: "Register a webhook endpoint:", code: "POST /api/v1/webhooks" },
      { label: "Event payload format:", code: '{ "event": "goal.completed", "data": { ... }, "timestamp": "..." }' },
    ],
  },
  {
    icon: Shield,
    title: "Rate Limits",
    id: "limits",
    content: [
      { label: "Free plan: 100 requests/hour", code: null },
      { label: "Pro plan: 1,000 requests/hour", code: null },
      { label: "Premium & Elite: 10,000 requests/hour", code: null },
      { label: "Rate limit headers are returned with every response.", code: "X-RateLimit-Remaining: 998" },
    ],
  },
];

const quickLinks = [
  { label: "Authentication", href: "#auth" },
  { label: "Goals API", href: "#goals" },
  { label: "Journal API", href: "#journal" },
  { label: "Analytics API", href: "#analytics" },
  { label: "Webhooks", href: "#webhooks" },
  { label: "Rate Limits", href: "#limits" },
];

export default function DocsPage() {
  return (
    <StaticShell maxWidth="max-w-3xl">
      <StaticHeading
        label="API Docs"
        title="Build with Buildr."
        subtitle="REST API reference for integrating Buildr data into your own tools and workflows."
      />

      {/* Base URL callout */}
      <div className="bg-neutral-900 rounded-xl p-4 mb-10 flex items-center gap-3">
        <Terminal className="w-4 h-4 text-neutral-400 flex-shrink-0" strokeWidth={1.5} />
        <div>
          <p className="text-neutral-400 text-[10px] uppercase tracking-widest mb-0.5">Base URL</p>
          <code className="text-white text-sm font-mono">https://api.buildr.io/v1</code>
        </div>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2 mb-12">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-xs text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-full px-3.5 py-1.5 hover:border-neutral-400 hover:text-neutral-900 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* API sections */}
      <div className="space-y-12">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id} id={section.id}>
              <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-neutral-100">
                <Icon className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                <h2 className="text-neutral-900 font-semibold text-base">{section.title}</h2>
              </div>
              <div className="space-y-2.5">
                {section.content.map((item, i) => (
                  <div key={i}>
                    {item.code ? (
                      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                        <p className="text-neutral-500 text-xs mb-2">{item.label}</p>
                        <code className="text-neutral-900 text-sm font-mono bg-white border border-neutral-200 rounded-lg px-3 py-1.5 block">
                          {item.code}
                        </code>
                      </div>
                    ) : (
                      <p className="text-neutral-500 text-sm leading-relaxed pl-1">{item.label}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full docs CTA */}
      <div className="mt-14 bg-neutral-50 border border-neutral-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-neutral-900 font-semibold text-sm">Need more detail?</p>
          <p className="text-neutral-500 text-sm mt-0.5">Full SDK reference, code examples, and Postman collection coming soon.</p>
        </div>
        <Link
          href="/contact"
          className="flex-shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 border border-neutral-200 rounded-full px-5 py-2.5 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
        >
          Request access <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </StaticShell>
  );
}
