"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AuroraLights } from "@/components/ui/aurora-lights";

// ─── Rotating career outcomes (slot-machine style) ───────────────────────────

const ROLES = ["AI Engineer", "Product Lead", "Founder", "Data Scientist", "UX Director"];

function SlotWord() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setIndex(i => (i + 1) % ROLES.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="relative inline-block overflow-hidden" style={{ minWidth: "12ch", verticalAlign: "bottom" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={mounted ? { y: "105%", opacity: 0 } : false}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-105%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="block text-[#0070f3]"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── 3-D product card ─────────────────────────────────────────────────────────

function ProductCard() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValueXY();
  const rotX = useSpring(useTransform(mx.y, [-0.5, 0.5], [5, -5]), { stiffness: 160, damping: 28 });
  const rotY = useSpring(useTransform(mx.x, [-0.5, 0.5], [-7, 7]), { stiffness: 160, damping: 28 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.x.set((e.clientX - r.left) / r.width - 0.5);
    mx.y.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() { mx.x.set(0); mx.y.set(0); }

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.div
      ref={ref}
      style={{ y: cardY, perspective: 1000 }}
      className="w-full"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 56 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="rounded-2xl overflow-hidden border border-neutral-200 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.08)]"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <div className="flex-1 mx-4 flex justify-center">
            <span className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded px-3 py-0.5 text-[11px] text-neutral-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              app.buildr.io/roadmap
            </span>
          </div>
        </div>

        {/* Dashboard */}
        <div className="bg-white p-5 grid grid-cols-5 gap-4">
          {/* Sidebar */}
          <div className="col-span-2 space-y-3">
            <div className="rounded-xl border border-neutral-100 p-4 bg-neutral-50">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Match score</p>
              <p className="text-3xl font-bold text-neutral-900 leading-none">94%</p>
              <p className="text-xs text-neutral-500 mt-1">AI Engineer path</p>
              <div className="mt-2.5 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#0070f3]"
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  transition={{ delay: 1.3, duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>
            {[
              { k: "Salary jump", v: "+$62k/yr" },
              { k: "Time to role", v: "14 months" },
              { k: "Skills gap", v: "3 courses" },
            ].map(s => (
              <div key={s.k} className="rounded-xl border border-neutral-100 px-3.5 py-3 bg-neutral-50">
                <p className="text-[10px] text-neutral-400 mb-0.5">{s.k}</p>
                <p className="text-sm font-semibold text-neutral-800">{s.v}</p>
              </div>
            ))}
          </div>

          {/* Roadmap */}
          <div className="col-span-3 rounded-xl border border-neutral-100 p-4 bg-neutral-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400">Roadmap · Phase 1/3</p>
                <p className="text-sm font-semibold text-neutral-800 mt-0.5">AI Engineer</p>
              </div>
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">On track</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Python for Data Science", pct: 100 },
                { label: "ML Fundamentals", pct: 100 },
                { label: "Deep Learning", pct: 43 },
                { label: "MLOps & Deployment", pct: 0 },
              ].map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 + i * 0.07 }}
                  className="flex items-center gap-2.5"
                >
                  <div className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${m.pct === 100 ? "bg-emerald-500" : "border-2 border-neutral-200 bg-white"}`}>
                    {m.pct === 100 && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] mb-1 truncate ${m.pct === 100 ? "line-through text-neutral-400" : "text-neutral-700 font-medium"}`}>{m.label}</p>
                    <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${m.pct === 100 ? "bg-emerald-400" : "bg-[#0070f3]"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${m.pct}%` }}
                        transition={{ delay: 1.4 + i * 0.1, duration: 0.9, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0 w-7 text-right">{m.pct}%</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function useMotionValueXY() {
  return { x: useMotionValue(0), y: useMotionValue(0) };
}

// ─── Live proof strip ─────────────────────────────────────────────────────────

const PROOF = [
  "Priya pivoted to AI Engineering in 7 months",
  "Marcus reached $50k MRR with his SaaS",
  "Sofia became Director of Product at 28",
  "Jordan landed a Google PM offer",
  "Alex built a $200k/yr freelance business",
];

function ProofStrip() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(n => (n + 1) % PROOF.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-2.5 text-sm text-neutral-500">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.25 }}
        >
          {PROOF[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      <AuroraLights />
      {/* Noise texture overlay — very subtle */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-0">
        {/* Top label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.18em] text-neutral-400 font-medium mb-10"
        >
          AI Career Platform
        </motion.p>

        {/* Headline */}
        <div className="max-w-4xl">
          <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1.04] tracking-[-0.03em] text-neutral-900">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              Your roadmap to
            </motion.span>
            <motion.span
              className="flex items-baseline gap-3 flex-wrap"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              becoming a
              <SlotWord />
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              starts here.
            </motion.span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.6, ease: "easeOut" }}
            className="mt-8 text-xl text-neutral-500 max-w-xl leading-relaxed font-normal"
          >
            Answer five questions. Get a personalized career path,
            skill-gap analysis, and daily action plan — built by AI,
            tailored to you.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.66, duration: 0.55 }}
            className="mt-10 flex items-center gap-5"
          >
            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-6 py-3.5 rounded-full hover:bg-neutral-700 transition-colors duration-150"
              >
                Get started free
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </motion.button>
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors border-b border-neutral-200 hover:border-neutral-500 pb-px">
              See how it works
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.82 }}
            className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
          >
            {/* Avatars + count */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=36&h=36&fit=crop&crop=face&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=36&h=36&fit=crop&crop=face&q=80",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=36&h=36&fit=crop&crop=face&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=36&h=36&fit=crop&crop=face&q=80",
                ].map((src, idx) => (
                  <img key={idx} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <p className="text-sm text-neutral-500">
                <strong className="text-neutral-800 font-semibold">12,400+</strong> paths mapped
              </p>
            </div>

            <div className="w-px h-4 bg-neutral-200 hidden sm:block" />
            <ProofStrip />
          </motion.div>
        </div>

        {/* Product preview */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <ProductCard />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="h-24 bg-gradient-to-b from-white/0 to-white pointer-events-none" />
    </section>
  );
}
