import { StaticShell, StaticHeading } from "@/components/layout/static-shell";
import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";

const openRoles = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Own features end-to-end across our Next.js frontend and Node.js backend. You'll work closely with our AI team to ship the core product.",
  },
  {
    title: "AI/ML Engineer",
    team: "AI",
    location: "Remote",
    type: "Full-time",
    description: "Build the Digital Twin — the personalization engine at the heart of Buildr. LLM fine-tuning, embeddings, retrieval, and behavioral modeling.",
  },
  {
    title: "Product Designer",
    team: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Own the end-to-end design of our product. We care deeply about craft. You'll be the first dedicated designer on the team.",
  },
  {
    title: "Growth Lead",
    team: "Growth",
    location: "Remote (US)",
    type: "Full-time",
    description: "Own acquisition, activation, and retention. Data-driven and creative — you'll experiment your way to our first 100K users.",
  },
];

const values = [
  { title: "Small, high-trust team", body: "We move fast and trust each other to own outcomes. No bureaucracy." },
  { title: "Async by default", body: "We work across time zones. Great writing beats endless meetings." },
  { title: "Outcomes, not hours", body: "We measure what ships, not when you were at your desk." },
  { title: "Generous equity", body: "Early team members get meaningful ownership in what we're building." },
];

export default function CareersPage() {
  return (
    <StaticShell maxWidth="max-w-3xl">
      <StaticHeading
        label="Careers"
        title="Help people build better lives."
        subtitle="We're a small team solving a big problem. If you want your work to matter, you're in the right place."
      />

      {/* Culture / values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
        {values.map((v) => (
          <div key={v.title} className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
            <p className="text-neutral-900 font-semibold text-sm mb-1.5">{v.title}</p>
            <p className="text-neutral-500 text-sm leading-relaxed">{v.body}</p>
          </div>
        ))}
      </div>

      {/* Open roles */}
      <h2 className="text-neutral-900 font-semibold text-base mb-4 pb-2 border-b border-neutral-100">
        Open roles ({openRoles.length})
      </h2>
      <div className="space-y-3 mb-14">
        {openRoles.map((role) => (
          <div
            key={role.title}
            className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-400 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {role.team}
                  </span>
                  <span className="flex items-center gap-1 text-neutral-400 text-xs">
                    <MapPin className="w-3 h-3" />{role.location}
                  </span>
                  <span className="flex items-center gap-1 text-neutral-400 text-xs">
                    <Clock className="w-3 h-3" />{role.type}
                  </span>
                </div>
                <h3 className="text-neutral-900 font-semibold text-sm mb-2">{role.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{role.description}</p>
              </div>
              <Link
                href={`/contact?subject=careers&role=${encodeURIComponent(role.title)}`}
                className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 border border-neutral-200 rounded-full px-4 py-2 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all group-hover:border-neutral-400"
              >
                Apply <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* General CTA */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8">
        <p className="text-white font-bold text-lg mb-2">Don&apos;t see your role?</p>
        <p className="text-neutral-400 text-sm mb-5 leading-relaxed max-w-sm">
          We hire for exceptional people first, roles second. Send us a note — we read everything.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-white text-neutral-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-colors"
        >
          Get in touch <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </StaticShell>
  );
}
