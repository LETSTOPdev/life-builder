import { StaticShell, StaticHeading } from "@/components/layout/static-shell";

export const metadata = { title: "About" };

const values = [
  {
    title: "Clarity over complexity",
    description: "We remove noise. Every feature, every recommendation, every word of coaching must make the user's path clearer.",
  },
  {
    title: "Personalization is non-negotiable",
    description: "Generic advice is noise. We build systems that know the individual — because one-size-fits-all never changes anyone.",
  },
  {
    title: "Progress over perfection",
    description: "We celebrate 1% improvements. Momentum beats motivation. Showing up consistently beats occasional heroics.",
  },
  {
    title: "Privacy by default",
    description: "Your most personal data lives here. We treat it accordingly — encrypted, private, yours forever, deletable anytime.",
  },
];

const team = [
  {
    name: "Alex Rivera",
    role: "CEO & Co-founder",
    bg: "bg-neutral-200",
    initials: "AR",
    bio: "Previously built ML infrastructure at Meta. Obsessed with making AI feel human.",
  },
  {
    name: "Jordan Kim",
    role: "CTO & Co-founder",
    bg: "bg-neutral-300",
    initials: "JK",
    bio: "ex-Stripe engineering lead. Believes great software should feel invisible.",
  },
  {
    name: "Sofia Martins",
    role: "Head of Design",
    bg: "bg-neutral-200",
    initials: "SM",
    bio: "Former Figma product designer. Makes complexity feel effortless.",
  },
  {
    name: "Liam Okafor",
    role: "Head of AI",
    bg: "bg-neutral-300",
    initials: "LO",
    bio: "PhD in Cognitive Science. Turning behavioral research into real product.",
  },
];

export default function AboutPage() {
  return (
    <StaticShell maxWidth="max-w-3xl">
      <StaticHeading
        label="About"
        title="We believe everyone deserves a clear path forward."
        subtitle="Buildr was built for the millions of people who know they're capable of more — but don't know where to start."
      />

      <div className="space-y-16 text-neutral-500 text-base leading-relaxed">

        {/* Story */}
        <div className="space-y-8">
          <div>
            <h2 className="text-neutral-900 font-semibold text-lg mb-3">The Problem</h2>
            <p>
              Most people aren&apos;t lazy. They&apos;re lost. They have goals, ambitions, and real potential — but they lack a clear, personalized system to turn that potential into consistent progress. Generic advice doesn&apos;t work. One-size-fits-all planners don&apos;t work. What works is a system that knows you.
            </p>
          </div>

          <div>
            <h2 className="text-neutral-900 font-semibold text-lg mb-3">Our Mission</h2>
            <p>
              Buildr is the AI Life Operating System that helps you discover what fits you, create a personalized plan, and take action every single day until you achieve meaningful results. We don&apos;t just track goals — we help you build the momentum and belief that makes goals inevitable.
            </p>
          </div>

          <div>
            <h2 className="text-neutral-900 font-semibold text-lg mb-3">Built Different</h2>
            <p>
              We built Buildr around one core insight: the goal of any productivity system is not to collect data — it&apos;s to create belief. When you leave Buildr, you should think: <em className="text-neutral-900">&ldquo;For the first time, I know exactly what I should do next.&rdquo;</em>
            </p>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-neutral-900 font-semibold text-lg mb-6">What we believe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v) => (
              <div key={v.title} className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
                <p className="text-neutral-900 font-semibold text-sm mb-2">{v.title}</p>
                <p className="text-neutral-500 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-neutral-900 font-semibold text-lg mb-6">The team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.map((member) => (
              <div key={member.name} className="flex items-start gap-4 bg-white border border-neutral-200 rounded-xl p-4">
                <div className={`w-10 h-10 rounded-full ${member.bg} flex items-center justify-center text-neutral-700 text-xs font-bold flex-shrink-0`}>
                  {member.initials}
                </div>
                <div>
                  <p className="text-neutral-900 font-medium text-sm">{member.name}</p>
                  <p className="text-neutral-400 text-xs mb-1.5">{member.role}</p>
                  <p className="text-neutral-500 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Numbers */}
        <div className="grid grid-cols-3 gap-6 py-8 border-y border-neutral-100">
          {[
            { value: "2024", label: "Founded" },
            { value: "San Francisco", label: "Headquarters" },
            { value: "Remote-first", label: "Culture" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-neutral-900 font-bold text-base">{item.value}</p>
              <p className="text-neutral-400 text-xs mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="text-neutral-400 text-sm">
          Want to join us?{" "}
          <a href="/careers" className="text-neutral-900 hover:underline underline-offset-2 transition-colors">
            See open roles →
          </a>
        </p>
      </div>
    </StaticShell>
  );
}
