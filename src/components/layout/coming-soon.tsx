import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
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
      <Footer />
    </div>
  );
}
