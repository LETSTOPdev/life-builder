"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Brain, BarChart3, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNav = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Goals", href: "/dashboard/goals", icon: Target },
  { label: "Coach", href: "/dashboard/coach", icon: Brain },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Journal", href: "/dashboard/journal", icon: BookOpen },
];

export function MobileDashboardNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="lg:hidden flex items-center px-4 py-3 bg-[#0a0a0a] border-b border-white/6">
        <span className="text-white font-semibold text-sm">Buildr</span>
      </div>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/6 z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg cursor-pointer transition-colors",
                  active ? "text-white" : "text-[#444] hover:text-[#888]"
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={active ? 2 : 1.5} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
