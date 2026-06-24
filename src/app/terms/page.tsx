import { StaticShell, StaticHeading } from "@/components/layout/static-shell";

export default function TermsPage() {
  return (
    <StaticShell>
      <StaticHeading
        label="Legal"
        title="Terms of Service"
        subtitle="Last updated: June 22, 2026"
      />

      <div className="space-y-8 text-neutral-500 text-sm leading-relaxed">
        {[
          {
            title: "1. Acceptance of Terms",
            body: "By accessing or using Buildr, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the service.",
          },
          {
            title: "2. Your Account",
            body: "You are responsible for maintaining the security of your account credentials. You must be at least 16 years of age to use Buildr. You may not share your account with others or use another person's account without permission.",
          },
          {
            title: "3. Acceptable Use",
            body: "You may use Buildr only for lawful personal development purposes. You may not use the service to harass others, distribute harmful content, attempt to reverse-engineer our AI systems, or violate any applicable laws.",
          },
          {
            title: "4. Subscriptions and Billing",
            body: "Paid subscriptions are billed monthly or annually as selected. You can cancel at any time from Settings → Billing. Cancellations take effect at the end of the current billing period. We do not offer refunds for partial billing periods.",
          },
          {
            title: "5. Your Content",
            body: "You retain ownership of all content you create in Buildr (goals, journal entries, notes). By using Buildr, you grant us a limited license to process this content to provide and improve the service.",
          },
          {
            title: "6. AI Limitations",
            body: "Buildr's AI coaching is for informational and motivational purposes only. It is not a substitute for professional medical, psychological, financial, or legal advice. Always consult qualified professionals for such matters.",
          },
          {
            title: "7. Termination",
            body: "We may suspend or terminate your account if you violate these terms. You may delete your account at any time from Settings. Upon termination, your data will be deleted per our Privacy Policy.",
          },
          {
            title: "8. Limitation of Liability",
            body: "Buildr is provided 'as is.' To the maximum extent permitted by law, we disclaim all warranties and limit liability for indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.",
          },
          {
            title: "9. Governing Law",
            body: "These terms are governed by the laws of the State of California, USA, without regard to conflict of law principles. Disputes shall be resolved through binding arbitration in San Francisco, CA.",
          },
          {
            title: "10. Contact",
            body: "For questions about these terms, contact us at legal@buildr.io.",
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
