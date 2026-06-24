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
      <div className="lg:hidden flex items-center px-4 py-3 bg-white border-b border-neutral-100">
        <span className="text-neutral-900 font-semibold text-sm">Buildr</span>
      </div>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 z-40">
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
                  active ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
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
