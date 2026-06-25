"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const STORAGE_KEY = "buildr_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage unavailable — don't show banner
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch {}
    setVisible(false);
  };

  const decline = () => {
    try { localStorage.setItem(STORAGE_KEY, "declined"); } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[380px] z-50"
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
        >
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-lg p-5">
            <p className="text-neutral-900 font-semibold text-sm mb-1">We use cookies</p>
            <p className="text-neutral-500 text-xs leading-relaxed mb-4">
              We use essential cookies to operate the site and optional analytics cookies to improve it. See our{" "}
              <Link href="/cookies" className="text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors">
                Privacy Policy
              </Link>.
            </p>
            <div className="flex gap-2">
              <button
                onClick={accept}
                className="flex-1 bg-neutral-900 text-white text-xs font-semibold py-2 rounded-full hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Accept all
              </button>
              <button
                onClick={decline}
                className="flex-1 bg-neutral-100 text-neutral-600 text-xs font-semibold py-2 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Essential only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
