import { StaticShell, StaticHeading } from "@/components/layout/static-shell";

export const metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <StaticShell>
      <StaticHeading
        label="Legal"
        title="Cookie Policy"
        subtitle="Last updated June 2025"
      />

      <div className="space-y-8 text-neutral-600 text-sm leading-relaxed">
        <section>
          <h2 className="text-neutral-900 font-semibold text-base mb-3">What are cookies?</h2>
          <p>
            Cookies are small text files placed on your device by websites you visit. Buildr uses cookies to keep you signed in, remember your preferences, and understand how you use the product.
          </p>
        </section>

        <section>
          <h2 className="text-neutral-900 font-semibold text-base mb-3">Cookies we use</h2>
          <div className="space-y-3">
            {[
              {
                name: "Essential",
                desc: "Required for the service to work — session tokens, authentication, and security. Cannot be disabled.",
              },
              {
                name: "Analytics",
                desc: "Help us understand how you use Buildr so we can improve it. We use privacy-first analytics that do not track you across other sites.",
              },
              {
                name: "Preferences",
                desc: "Remember your settings such as dashboard layout and notification choices.",
              },
            ].map((c) => (
              <div key={c.name} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                <p className="text-neutral-900 font-medium text-sm mb-1">{c.name}</p>
                <p className="text-neutral-500 text-xs">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-neutral-900 font-semibold text-base mb-3">Third-party cookies</h2>
          <p>
            We do not use third-party advertising cookies or sell your data. Some embedded content may set their own cookies subject to their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-neutral-900 font-semibold text-base mb-3">Managing cookies</h2>
          <p>
            You can control cookies through your browser settings. Blocking essential cookies will prevent you from signing in to Buildr.
          </p>
        </section>

        <section>
          <h2 className="text-neutral-900 font-semibold text-base mb-3">Questions?</h2>
          <p>
            Email{" "}
            <a href="mailto:privacy@buildr.app" className="text-neutral-900 underline underline-offset-2 hover:text-neutral-500 transition-colors">
              privacy@buildr.app
            </a>
          </p>
        </section>
      </div>
    </StaticShell>
  );
}
