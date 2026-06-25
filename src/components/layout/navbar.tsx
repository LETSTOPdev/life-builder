"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Zap, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/upgrade" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 rounded-md bg-neutral-900 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" fill="white" />
            </div>
            <span className="text-neutral-900 font-semibold text-base tracking-tight">Buildr</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-neutral-500 hover:text-neutral-900 text-sm transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/auth/login"
              className="text-neutral-500 hover:text-neutral-900 text-sm h-8 px-3 inline-flex items-center rounded-md transition-colors hover:bg-neutral-100"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-neutral-900 text-white hover:bg-neutral-700 text-sm font-medium h-8 px-4 rounded-full inline-flex items-center transition-colors"
            >
              Get started
            </Link>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden inline-flex items-center justify-center w-8 h-8 text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-neutral-100 text-neutral-900 w-64 p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" fill="white" />
                  </div>
                  <span className="font-semibold text-neutral-900">Buildr</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="text-neutral-400 hover:text-neutral-900 transition-colors p-1 rounded-md hover:bg-neutral-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-neutral-500 hover:text-neutral-900 text-sm py-2.5 px-2 rounded-md hover:bg-neutral-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-neutral-100">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="text-neutral-500 hover:text-neutral-900 text-sm py-2 px-2 rounded-md hover:bg-neutral-50 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setOpen(false)}
                    className="w-full bg-neutral-900 text-white hover:bg-neutral-700 text-sm font-medium px-4 py-2.5 rounded-full transition-colors text-center"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
