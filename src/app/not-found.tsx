import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <div className="px-6 py-4 border-b border-neutral-100">
        <Link href="/" className="flex items-center gap-2 cursor-pointer w-fit">
          <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="text-neutral-900 font-semibold text-sm">Buildr</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-neutral-200 text-7xl font-bold mb-4 tracking-tight">404</p>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Page not found</h1>
        <p className="text-neutral-500 text-sm mb-8 max-w-xs">
          This page doesn&apos;t exist. It may have moved, or you may have followed an old link.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="bg-neutral-900 text-white font-semibold px-5 py-2.5 rounded-full text-sm cursor-pointer hover:bg-neutral-700 transition-colors inline-flex items-center justify-center"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 px-5 py-2.5 rounded-full text-sm cursor-pointer transition-all inline-flex items-center justify-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
