import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col">
      <div className="px-6 py-4 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2 cursor-pointer w-fit">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <Zap className="w-3 h-3 text-black" fill="black" />
          </div>
          <span className="text-white font-semibold text-sm">Buildr</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-[#333] text-7xl font-bold mb-4 tracking-tight">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-[#555] text-sm mb-8 max-w-xs">
          This page doesn&apos;t exist. It may have moved, or you may have followed an old link.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="bg-white text-black font-semibold px-5 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-white/90 transition-colors inline-flex items-center justify-center"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="border border-white/12 text-white/70 hover:text-white px-5 py-2.5 rounded-xl text-sm cursor-pointer hover:border-white/25 transition-all inline-flex items-center justify-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
