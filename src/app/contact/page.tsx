"use client";

import { useState } from "react";
import { StaticShell, StaticHeading } from "@/components/layout/static-shell";
import { CheckCircle2 } from "lucide-react";

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
          <p className="text-neutral-500 text-sm">We&apos;ll get back to you within 24 hours.</p>
        </div>
      </StaticShell>
    );
  }

  return (
    <StaticShell>
      <StaticHeading
        label="Contact"
        title="Get in touch."
        subtitle="We read every message. Typical response time is under 24 hours."
      />

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
          <label className="block text-xs font-medium text-neutral-500 mb-1.5 uppercase tracking-wide">Subject</label>
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
      </form>

      <div className="mt-12 pt-8 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-neutral-400 text-xs uppercase tracking-widest mb-1">Email</p>
          <p className="text-neutral-900 text-sm">hello@buildr.io</p>
        </div>
        <div>
          <p className="text-neutral-400 text-xs uppercase tracking-widest mb-1">Support</p>
          <p className="text-neutral-900 text-sm">support@buildr.io</p>
        </div>
      </div>
    </StaticShell>
  );
}
