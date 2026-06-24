import Link from "next/link";
import { Zap } from "lucide-react";

interface StaticShellProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function StaticShell({ children, maxWidth = "max-w-2xl" }: StaticShellProps) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
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
      <div className={`${maxWidth} mx-auto px-6 py-20`}>
        {children}
      </div>
    </div>
  );
}

export function StaticHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-12">
      <p className="text-neutral-400 text-xs font-medium tracking-[0.18em] uppercase mb-3">{label}</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3 tracking-tight">{title}</h1>
      {subtitle && <p className="text-neutral-500 text-base">{subtitle}</p>}
    </div>
  );
}
