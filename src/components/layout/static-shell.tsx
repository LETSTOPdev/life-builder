import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface StaticShellProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function StaticShell({ children, maxWidth = "max-w-2xl" }: StaticShellProps) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <Navbar />
      <div className={`flex-1 ${maxWidth} mx-auto px-6 pt-28 pb-20 w-full`}>
        {children}
      </div>
      <Footer />
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
