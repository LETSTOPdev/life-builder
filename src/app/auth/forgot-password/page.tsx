"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {!sent ? (
            <>
              <Link href="/auth" className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-neutral-700 text-xs mb-8 cursor-pointer transition-colors group">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                Back to sign in
              </Link>

              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Reset your password</h1>
              <p className="text-neutral-500 text-sm mb-8">Enter your email and we&apos;ll send a reset link.</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder-neutral-300 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-neutral-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-neutral-900 text-white font-semibold py-3 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-6 h-6 text-neutral-500" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Check your email</h2>
              <p className="text-neutral-500 text-sm mb-6">
                We sent a reset link to <span className="text-neutral-900">{email}</span>
              </p>
              <Link href="/auth" className="text-neutral-400 hover:text-neutral-700 text-sm cursor-pointer transition-colors">
                Back to sign in
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
