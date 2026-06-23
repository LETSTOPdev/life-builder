"use client";

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

function HeroSplineBackground() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      pointerEvents: 'auto',
      overflow: 'hidden',
    }}>
      <Spline
        style={{
          width: '100%',
          height: '100vh',
          pointerEvents: 'auto',
        }}
        scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode"
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: `
            linear-gradient(to right, rgba(0,0,0,0.75), transparent 28%, transparent 72%, rgba(0,0,0,0.75)),
            linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.95))
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function HeroContent() {
  return (
    <div className="text-white px-6 max-w-5xl mx-auto w-full">
      <div className="max-w-2xl">
        <p className="text-[13px] font-medium tracking-widest uppercase text-white/40 mb-6 letter-spacing-wider">
          AI Life Operating System
        </p>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
          Find Your Direction.<br />Build Your Future.
        </h1>
        <p className="text-[17px] text-white/55 mb-8 leading-relaxed max-w-lg">
          Buildr helps you discover what fits you, create a personalized plan, and take action every day until you achieve meaningful results.
        </p>
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link href="/auth">
            <button className="bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-white/90 transition-colors cursor-pointer">
              Start Free →
            </button>
          </Link>
          <Link href="#how-it-works">
            <button className="text-white/60 hover:text-white text-sm px-5 py-2.5 rounded-md border border-white/12 hover:border-white/25 transition-all cursor-pointer">
              See How It Works
            </button>
          </Link>
        </div>
        <p className="text-white/25 text-xs mt-4">No credit card required · Free plan available</p>
      </div>
    </div>
  );
}

function ScreenshotSection({ screenshotRef }: { screenshotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 mt-16">
      <div
        ref={screenshotRef}
        className="rounded-xl overflow-hidden border border-white/8"
        style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.6)' }}
      >
        <div className="bg-[#111] px-4 py-3 flex items-center gap-1.5 border-b border-white/6">
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="flex-1 mx-3">
            <div className="bg-white/6 rounded text-center text-white/25 text-xs py-0.5 px-3 mx-auto max-w-xs">
              app.buildr.io/dashboard
            </div>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&q=85&auto=format&fit=crop"
          alt="Buildr dashboard"
          className="w-full h-auto block"
        />
      </div>
    </section>
  );
}

export function HeroSection() {
  const screenshotRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollPosition = window.pageYOffset;
        if (screenshotRef.current) {
          screenshotRef.current.style.transform = `translateY(-${scrollPosition * 0.4}px)`;
        }
        if (heroContentRef.current) {
          const maxScroll = 350;
          heroContentRef.current.style.opacity = String(1 - Math.min(scrollPosition / maxScroll, 1));
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <HeroSplineBackground />
        </div>
        <div
          ref={heroContentRef}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
            display: 'flex', alignItems: 'center', zIndex: 10, pointerEvents: 'none',
            paddingTop: '80px',
          }}
        >
          <HeroContent />
        </div>
      </div>

      <div className="bg-[#0a0a0a] relative z-10" style={{ marginTop: '-8vh' }}>
        <ScreenshotSection screenshotRef={screenshotRef} />
      </div>
    </div>
  );
}
