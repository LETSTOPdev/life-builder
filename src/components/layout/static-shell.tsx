import Link from "next/link";
import { Zap } from "lucide-react";

interface StaticShellProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function StaticShell({ children, maxWidth = "max-w-2xl" }: StaticShellProps) {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
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
      <div className={`${maxWidth} mx-auto px-6 py-20`}>
        {children}
      </div>
    </div>
  );
}

export function StaticHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-12">
      <p className="text-[#555] text-xs font-medium tracking-widest uppercase mb-3">{label}</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">{title}</h1>
      {subtitle && <p className="text-[#666] text-base">{subtitle}</p>}
    </div>
  );
}
