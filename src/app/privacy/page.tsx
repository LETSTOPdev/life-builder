import { StaticShell, StaticHeading } from "@/components/layout/static-shell";

export default function PrivacyPage() {
  return (
    <StaticShell>
      <StaticHeading
        label="Legal"
        title="Privacy Policy"
        subtitle="Last updated: June 22, 2026"
      />

      <div className="space-y-8 text-neutral-500 text-sm leading-relaxed">
        {[
          {
            title: "1. Information We Collect",
            body: "We collect information you provide directly to us when you create an account, complete onboarding, use our services, or contact us. This includes your name, email address, goals, journal entries, and usage data.",
          },
          {
            title: "2. How We Use Your Information",
            body: "We use your information to provide, personalize, and improve the Buildr service; to generate AI-powered recommendations and coaching; to communicate with you about your account; and to comply with legal obligations.",
          },
          {
            title: "3. AI and Your Data",
            body: "Your goals, journal entries, and progress data are used to power Buildr's AI coach. We process this data to generate personalized recommendations. We do not sell your personal data to third parties. AI models used are governed by our data processing agreements.",
          },
          {
            title: "4. Data Storage and Security",
            body: "Your data is stored on secure servers. We use industry-standard encryption (TLS 1.3) in transit and AES-256 at rest. We undergo regular security audits and comply with SOC 2 Type II requirements.",
          },
          {
            title: "5. Cookies",
            body: "We use essential cookies to operate the service (session authentication, preferences) and optional analytics cookies to understand usage patterns. You can control cookie preferences via your browser settings.",
          },
          {
            title: "6. Your Rights",
            body: "You have the right to access, correct, or delete your personal data at any time from Settings → Account. For EU/UK residents, you have additional rights under GDPR including data portability and the right to object to processing.",
          },
          {
            title: "7. Data Retention",
            body: "We retain your data for as long as your account is active. If you delete your account, we will delete or anonymize your data within 30 days, except where required by law.",
          },
          {
            title: "8. Contact",
            body: "For privacy questions, contact our Data Protection Officer at privacy@buildr.io or via our Contact page.",
          },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="text-neutral-900 font-semibold text-base mb-2">{section.title}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </div>
    </StaticShell>
  );
}
