"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Enter your email to continue"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address"); return; }
    setError("");
    window.location.href = `/auth/signup?email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 pt-28">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Create your account</h1>
          <p className="text-neutral-500 text-sm mb-8">Free forever. No credit card required.</p>

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

          <form onSubmit={handleEmail} className="space-y-2 mb-4" noValidate>
            <div>
              <label htmlFor="auth-email" className="sr-only">Email address</label>
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                autoComplete="email"
                aria-invalid={!!error}
                aria-describedby={error ? "auth-email-error" : undefined}
                className={`w-full bg-neutral-50 border text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none transition-colors ${error ? "border-red-400" : "border-neutral-200 focus:border-neutral-400"}`}
              />
              {error && (
                <p id="auth-email-error" role="alert" className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-neutral-900 text-white font-semibold py-3 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors"
            >
              Continue with Email →
            </button>
          </form>

          <p className="text-neutral-400 text-xs text-center mb-3">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-neutral-300 text-xs text-center">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-neutral-400 hover:text-neutral-700 transition-colors">Terms</Link>
            {" & "}
            <Link href="/privacy" className="text-neutral-400 hover:text-neutral-700 transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
