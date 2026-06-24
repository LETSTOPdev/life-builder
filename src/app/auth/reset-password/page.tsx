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

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token.");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordRules.every(r => r.test(password))) {
      setError("Password doesn't meet all requirements.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Reset failed. Please try again."); return; }
      setDone(true);
      setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-6">
          <Check className="w-6 h-6 text-neutral-500" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Password updated!</h2>
        <p className="text-neutral-500 text-sm">Redirecting you to your dashboard…</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Set new password</h1>
      <p className="text-neutral-500 text-sm mb-8">Choose a strong password for your account.</p>

      {error && (
        <div role="alert" className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          {!token && (
            <Link href="/auth/forgot-password" className="ml-auto text-red-600 underline text-xs whitespace-nowrap">
              Request new link
            </Link>
          )}
        </div>
      )}

      {token && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="text-neutral-500 text-xs font-medium uppercase tracking-wide block mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={show ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused(true)}
                autoComplete="new-password"
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-400 transition-colors pr-11"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors p-1"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {(focused && password) && (
              <div className="mt-2 space-y-1">
                {passwordRules.map(rule => {
                  const ok = rule.test(password);
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white font-semibold py-3 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Updating…
              </>
            ) : "Update Password"}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 pt-28">
        <div className="w-full max-w-sm">
          <Suspense fallback={<div className="text-neutral-400 text-sm">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
