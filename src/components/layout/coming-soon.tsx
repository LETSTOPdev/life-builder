import Link from "next/link";
import { Zap } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="text-neutral-900 font-semibold text-sm">Buildr</span>
        </Link>
        <Link href="/" className="text-neutral-400 hover:text-neutral-700 text-sm cursor-pointer transition-colors">
          ← Back
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase mb-4">Coming Soon</p>
        <h1 className="text-3xl font-bold text-neutral-900 mb-3">{title}</h1>
        <p className="text-neutral-500 text-sm mb-8 max-w-sm">
          {description ?? "This page is under construction. Check back soon."}
        </p>
        <Link
          href="/"
          className="bg-neutral-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer hover:bg-neutral-700 transition-colors inline-flex items-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
