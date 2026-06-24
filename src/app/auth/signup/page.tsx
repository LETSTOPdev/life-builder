"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

function SignupForm() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedPassword, setFocusedPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  // Pre-fill email if passed from /auth
  useEffect(() => {
    const email = searchParams.get("email");
    if (email) setForm(p => ({ ...p, email }));
  }, [searchParams]);

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
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">Create your account</h1>
      <p className="text-neutral-500 text-sm mb-8">Free forever. Upgrade when you&apos;re ready.</p>

      {/* Google OAuth */}
      <div className="mb-6">
        <a
          href="/api/auth/google"
          className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-600 hover:text-neutral-900 hover:border-neutral-400 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </a>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-neutral-400 text-xs">or sign up with email</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <div>
          <label htmlFor="name" className="text-neutral-500 text-xs font-medium uppercase tracking-wide block mb-1.5">Full name</label>
          <input
            id="name" type="text" placeholder="Alex Johnson"
            value={form.name}
            onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: undefined })); }}
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={`w-full bg-neutral-50 border text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none transition-colors ${errors.name ? "border-red-400 focus:border-red-500" : "border-neutral-200 focus:border-neutral-400"}`}
          />
          {errors.name && <p role="alert" className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="text-neutral-500 text-xs font-medium uppercase tracking-wide block mb-1.5">Email</label>
          <input
            id="email" type="email" placeholder="you@example.com"
            value={form.email}
            onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: undefined })); }}
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={`w-full bg-neutral-50 border text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none transition-colors ${errors.email ? "border-red-400 focus:border-red-500" : "border-neutral-200 focus:border-neutral-400"}`}
          />
          {errors.email && <p role="alert" className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
        </div>

        {/* Password */}
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
              className={`w-full bg-neutral-50 border text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none transition-colors pr-11 ${errors.password ? "border-red-400 focus:border-red-500" : "border-neutral-200 focus:border-neutral-400"}`}
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors p-1"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p role="alert" className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
          {(focusedPassword && form.password) && (
            <div className="mt-2 space-y-1">
              {passwordRules.map(rule => {
                const ok = rule.test(form.password);
                return (
                  <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-neutral-700" : "text-neutral-400"}`}>
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
          <Link href="/terms" className="text-neutral-600 hover:text-neutral-900 underline underline-offset-2">Terms</Link>
          {" and "}
          <Link href="/privacy" className="text-neutral-600 hover:text-neutral-900 underline underline-offset-2">Privacy Policy</Link>.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-900 text-white font-semibold py-3 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Creating account…</>
          ) : "Create account"}
        </button>
      </form>

      <p className="text-center text-neutral-400 text-xs mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 pt-28">
        <Suspense fallback={<div className="w-4 h-4 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />}>
          <SignupForm />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
