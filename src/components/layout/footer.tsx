import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/upgrade" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact", href: "/contact" },
    { label: "Status", href: "/status" },
    { label: "API Docs", href: "/docs" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-100">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 cursor-pointer">
              <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" fill="white" />
              </div>
              <span className="text-neutral-900 font-semibold text-sm">Buildr</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Your AI-powered life operating system. Build goals, track progress, become your best self.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-neutral-900 text-xs font-semibold mb-4 uppercase tracking-widest">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-neutral-700 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400 text-xs">
          <p>&copy; 2025 Buildr, Inc. All rights reserved.</p>
          <p>Built for humans.</p>
        </div>
      </div>
    </footer>
  );
}
