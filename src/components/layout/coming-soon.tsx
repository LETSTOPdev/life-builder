import Link from "next/link";
import { Zap } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col">
      <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <Zap className="w-3 h-3 text-black" fill="black" />
          </div>
          <span className="text-white font-semibold text-sm">Buildr</span>
        </Link>
        <Link href="/" className="text-[#555] hover:text-white text-sm cursor-pointer transition-colors">
          ← Back
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-[#444] text-xs font-medium tracking-widest uppercase mb-4">Coming Soon</p>
        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        <p className="text-[#555] text-sm mb-8 max-w-sm">
          {description ?? "This page is under construction. Check back soon."}
        </p>
        <Link
          href="/"
          className="bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-white/90 transition-colors inline-flex items-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
