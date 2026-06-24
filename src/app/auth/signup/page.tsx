"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Eye, EyeOff, AlertCircle, Check } from "lucide-react";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export default function SignupPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (!passwordRules.every(r => r.test(form.password))) e.password = "Password doesn't meet requirements";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setErrors({});
    setLoading(true);
    try {
      const r = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const d = await r.json();
      if (!r.ok) {
        const msg = d.error ?? "Signup failed";
        if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
        else setErrors({ name: msg });
        return;
      }
      window.location.href = "/onboarding";
    } catch {
      setErrors({ name: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-neutral-100">
        <Link href="/" className="flex items-center gap-2 cursor-pointer w-fit">
          <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="text-neutral-900 font-semibold text-sm">Buildr</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Create your account</h1>
          <p className="text-neutral-500 text-sm mb-8">Free forever. Upgrade when you&apos;re ready.</p>

          <div className="space-y-2 mb-6">
            {[
              {
                label: "Continue with Google",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                ),
              },
              {
                label: "Continue with LinkedIn",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                ),
              },
            ].map(({ label, icon }) => (
              <Link key={label} href="/onboarding">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 cursor-pointer transition-all">
                  {icon}
                  <span>{label}</span>
                </button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-neutral-400 text-xs">or</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="text-neutral-500 text-xs font-medium uppercase tracking-wide block mb-1.5">Full name</label>
              <input
                id="name" type="text" placeholder="Alex Johnson"
                value={form.name}
                onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: undefined })); }}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`w-full bg-neutral-50 border text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none transition-colors ${errors.name ? "border-red-400 focus:border-red-500" : "border-neutral-200 focus:border-neutral-400"}`}
              />
              {errors.name && <p id="name-error" role="alert" className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="text-neutral-500 text-xs font-medium uppercase tracking-wide block mb-1.5">Email</label>
              <input
                id="email" type="email" placeholder="you@example.com"
                value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: undefined })); }}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full bg-neutral-50 border text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none transition-colors ${errors.email ? "border-red-400 focus:border-red-500" : "border-neutral-200 focus:border-neutral-400"}`}
              />
              {errors.email && <p id="email-error" role="alert" className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-neutral-500 text-xs font-medium uppercase tracking-wide block mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password" type={show ? "text" : "password"} placeholder="Create a strong password"
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: undefined })); }}
                  onFocus={() => setFocusedPassword(true)}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby="password-rules"
                  className={`w-full bg-neutral-50 border text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none transition-colors pr-11 ${errors.password ? "border-red-400 focus:border-red-500" : "border-neutral-200 focus:border-neutral-400"}`}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors p-1"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p id="password-error" role="alert" className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5"><AlertCircle className="w-3 h-3" />{errors.password}</p>}

              {(focusedPassword && form.password) && (
                <div id="password-rules" className="mt-2 space-y-1">
                  {passwordRules.map(rule => {
                    const ok = rule.test(form.password);
                    return (
                      <div key={rule.label} className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? "text-neutral-700" : "text-neutral-400"}`}>
                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${ok ? "bg-neutral-900 border-neutral-900" : "border-neutral-300"}`}>
                          {ok && <Check className="w-2 h-2 text-white" />}
                        </div>
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-neutral-600 hover:text-neutral-900 cursor-pointer transition-colors underline underline-offset-2">Terms</Link>
              {" and "}
              <Link href="/privacy" className="text-neutral-600 hover:text-neutral-900 cursor-pointer transition-colors underline underline-offset-2">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white font-semibold py-3 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : "Create account"}
            </button>
          </form>

          <p className="text-center text-neutral-400 text-xs mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-neutral-700 hover:text-neutral-900 cursor-pointer transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
