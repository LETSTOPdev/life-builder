import { StaticShell, StaticHeading } from "@/components/layout/static-shell";

export default function AboutPage() {
  return (
    <StaticShell>
      <StaticHeading
        label="About"
        title="We believe everyone deserves a clear path forward."
        subtitle="Buildr was built for the millions of people who know they're capable of more — but don't know where to start."
      />

      <div className="space-y-8 text-neutral-500 text-base leading-relaxed">
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

        <div className="border-t border-neutral-100 pt-8">
          <p className="text-neutral-400 text-sm">Founded in 2024 · San Francisco, CA · Remote-first</p>
        </div>
      </div>
    </StaticShell>
  );
}
