import { StaticShell, StaticHeading } from "@/components/layout/static-shell";

export const metadata = { title: "GDPR" };

export default function GdprPage() {
  return (
    <StaticShell>
      <StaticHeading
        label="Legal"
        title="GDPR"
        subtitle="Your rights under the General Data Protection Regulation"
      />

      <div className="space-y-8 text-neutral-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-neutral-900 font-semibold text-base mb-3">Your rights</h2>
          <div className="space-y-3">
            {[
              { right: "Right to access", desc: "Request a copy of all personal data we hold about you." },
              { right: "Right to rectification", desc: "Ask us to correct inaccurate or incomplete data." },
              { right: "Right to erasure", desc: "Request deletion of your personal data ('right to be forgotten')." },
              { right: "Right to portability", desc: "Receive your data in a structured, machine-readable format." },
              { right: "Right to object", desc: "Object to processing of your data for certain purposes." },
            ].map((r) => (
              <div key={r.right} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                <p className="text-neutral-900 font-medium text-sm mb-1">{r.right}</p>
                <p className="text-neutral-500 text-xs">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-neutral-900 font-semibold text-base mb-3">Data controller</h2>
          <p>
            Buildr, Inc. is the data controller responsible for your personal data. We process data lawfully, fairly, and transparently in accordance with GDPR.
          </p>
        </section>

        <section>
          <h2 className="text-neutral-900 font-semibold text-base mb-3">Legal basis for processing</h2>
          <p>
            We process your data based on your consent (account creation), contract performance (providing the service), and legitimate interests (improving the product and preventing fraud).
          </p>
        </section>

        <section>
          <h2 className="text-neutral-900 font-semibold text-base mb-3">Data retention</h2>
          <p>
            We retain your data for as long as your account is active. You may request deletion at any time from Settings → Privacy → Delete account.
          </p>
        </section>

        <section>
          <h2 className="text-neutral-900 font-semibold text-base mb-3">Contact our DPO</h2>
          <p>
            For GDPR requests, email{" "}
            <a href="mailto:privacy@buildr.app" className="text-neutral-900 underline underline-offset-2 hover:text-neutral-500 transition-colors">
              privacy@buildr.app
            </a>
            . We will respond within 30 days.
          </p>
        </section>
      </div>
    </StaticShell>
  );
}
