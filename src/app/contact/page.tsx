"use client";

import { useState } from "react";
import { StaticShell, StaticHeading } from "@/components/layout/static-shell";
import { CheckCircle2, Clock, Mail, Building2 } from "lucide-react";

const channels = [
  {
    icon: Clock,
    label: "Response time",
    value: "Under 24 hours",
    sub: "Mon – Fri, 9am – 6pm PT",
  },
  {
    icon: Mail,
    label: "General",
    value: "hello@buildr.io",
    sub: "Questions, partnerships, press",
  },
  {
    icon: Building2,
    label: "Enterprise",
    value: "enterprise@buildr.io",
    sub: "Teams, custom plans, SSO",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <StaticShell>
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-6 h-6 text-neutral-400" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Message sent</h2>
          <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
            We read every message and typically respond within 24 hours on weekdays.
          </p>
        </div>
      </StaticShell>
    );
  }

  return (
    <StaticShell>
      <StaticHeading
        label="Contact"
        title="Get in touch."
        subtitle="We read every message. Real humans, real replies."
      />

      {/* Channel cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {channels.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
            <Icon className="w-4 h-4 text-neutral-400 mb-3" strokeWidth={1.5} />
            <p className="text-neutral-400 text-xs uppercase tracking-widest mb-1">{label}</p>
            <p className="text-neutral-900 text-sm font-medium">{value}</p>
            <p className="text-neutral-400 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">Name</label>
            <input
              required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Alex Johnson"
              className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">Topic</label>
          <select
            required
            value={form.subject}
            onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
            className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-400 transition-colors appearance-none cursor-pointer"
          >
            <option value="" disabled>Select a topic</option>
            <option value="general">General question</option>
            <option value="support">Product support</option>
            <option value="billing">Billing</option>
            <option value="enterprise">Enterprise / Teams</option>
            <option value="press">Press inquiry</option>
            <option value="partnership">Partnership</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">Message</label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            placeholder="Tell us how we can help..."
            className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-400 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-neutral-900 text-white font-semibold py-3 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors"
        >
          Send Message
        </button>

        <p className="text-center text-neutral-400 text-xs">
          By submitting you agree to our{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">Privacy Policy</a>.
        </p>
      </form>
    </StaticShell>
  );
}
