import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pricing", href: "/upgrade" },
  { label: "Help Center", href: "/help" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
        <p className="text-neutral-100 text-8xl font-bold mb-6 tracking-tight select-none">404</p>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Page not found</h1>
        <p className="text-neutral-500 text-sm mb-10 max-w-xs leading-relaxed">
          This page doesn&apos;t exist. It may have moved, or you may have followed an old link.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-14">
          <Link
            href="/"
            className="bg-neutral-900 text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-neutral-700 transition-colors inline-flex items-center justify-center"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400 px-5 py-2.5 rounded-full text-sm transition-all inline-flex items-center justify-center"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="border-t border-neutral-100 pt-8">
          <p className="text-neutral-400 text-xs uppercase tracking-widest mb-4">Quick links</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-neutral-500 text-sm hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
