"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Zap, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "/upgrade" },
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
        backgroundColor: scrolled ? "rgba(10, 10, 10, 0.92)" : "rgba(13, 13, 13, 0.35)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-black" fill="black" />
            </div>
            <span className="text-white font-semibold text-base tracking-tight">Buildr</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#888] hover:text-white text-sm transition-colors duration-150 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/auth"
              className="text-[#888] hover:text-white hover:bg-white/8 text-sm h-8 px-3 cursor-pointer inline-flex items-center rounded-md transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth"
              className="bg-white text-black hover:bg-white/90 text-sm font-medium h-8 px-4 rounded-md cursor-pointer inline-flex items-center transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Mobile hamburger — SheetTrigger is already a button; don't nest another button inside */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden inline-flex items-center justify-center w-8 h-8 text-white rounded-md hover:bg-white/8 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0a0a0a] border-[#1a1a1a] text-white w-64 p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
                    <Zap className="w-3 h-3 text-black" fill="black" />
                  </div>
                  <span className="font-semibold">Buildr</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="text-[#444] hover:text-white cursor-pointer transition-colors p-1 rounded-md hover:bg-white/5"
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
                    className="text-[#888] hover:text-white text-sm py-2.5 px-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-[#1a1a1a]">
                  <Link
                    href="/auth"
                    onClick={() => setOpen(false)}
                    className="text-[#888] hover:text-white cursor-pointer text-sm py-2 px-2 rounded-md hover:bg-white/5 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth"
                    onClick={() => setOpen(false)}
                    className="w-full bg-white text-black hover:bg-white/90 cursor-pointer text-sm font-medium px-4 py-2.5 rounded-md transition-colors text-center"
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
