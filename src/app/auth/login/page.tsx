"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setErrors({});
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const d = await r.json();
      if (!r.ok) { setErrors({ general: d.error ?? "Login failed" }); return; }
      window.location.href = "/dashboard";
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const field = (id: string, label: string, type: string, placeholder: string, key: "email" | "password") => (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-neutral-500 text-xs font-medium uppercase tracking-wide">{label}</label>
        {key === "password" && (
          <Link href="/auth/forgot-password" className="text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer transition-colors">
            Forgot password?
          </Link>
        )}
      </div>
      <div className="relative">
        <input
          id={id}
          type={key === "password" ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: undefined })); }}
          autoComplete={key === "email" ? "email" : "current-password"}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${id}-error` : undefined}
          className={`w-full bg-neutral-50 border text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none transition-colors ${
            errors[key] ? "border-red-400 focus:border-red-500" : "border-neutral-200 focus:border-neutral-400"
          } ${key === "password" ? "pr-11" : ""}`}
        />
        {key === "password" && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors p-1"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {errors[key] && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {errors[key]}
        </p>
      )}
    </div>
  );

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
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Welcome back</h1>
          <p className="text-neutral-500 text-sm mb-8">Sign in to continue building.</p>

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
                label: "Continue with Apple",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.56-1.32 3.1-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
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

          {errors.general && (
            <div role="alert" className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {field("email", "Email", "email", "you@example.com", "email")}
            {field("password", "Password", "password", "••••••••", "password")}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white font-semibold py-3 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p className="text-center text-neutral-400 text-xs mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth" className="text-neutral-700 hover:text-neutral-900 cursor-pointer transition-colors">
              Start free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
