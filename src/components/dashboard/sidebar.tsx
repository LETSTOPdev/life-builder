"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Target, Brain, BarChart3, BookOpen, Settings, Zap, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Goals", href: "/dashboard/goals", icon: Target },
  { label: "AI Coach", href: "/dashboard/coach", icon: Brain },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Journal", href: "/dashboard/journal", icon: BookOpen },
];

const bottomItems = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ name: string; email: string; plan: string } | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => { if (d.profile) setProfile(d.profile); })
      .catch(() => {});
  }, []);

  const initials = profile?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-[#0a0a0a] border-r border-white/6 h-screen sticky top-0">
      <div className="px-4 py-4 border-b border-white/6">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <Zap className="w-3 h-3 text-black" fill="black" />
          </div>
          <span className="text-white font-semibold text-sm">Buildr</span>
        </Link>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150 cursor-pointer",
                active ? "bg-white/8 text-white" : "text-[#555] hover:text-[#aaa] hover:bg-white/4"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={active ? 2 : 1.5} />
              <span className={active ? "font-medium" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {profile?.plan === "free" && (
        <div className="px-2 pb-2">
          <div className="border border-white/6 rounded-lg p-3 mb-2">
            <div className="flex items-center gap-2 mb-1.5">
              <ArrowUp className="w-3.5 h-3.5 text-white/40" />
              <span className="text-white text-xs font-medium">Upgrade to Pro</span>
            </div>
            <p className="text-[#444] text-xs mb-3 leading-relaxed">Unlock unlimited goals and AI coaching.</p>
            <Link
              href="/upgrade"
              className="w-full text-xs font-medium bg-white text-black py-1.5 rounded-md cursor-pointer hover:bg-white/90 transition-colors inline-flex items-center justify-center"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}

      <div className="px-2 pb-2 border-t border-white/6 pt-2 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
                active ? "bg-white/8 text-white" : "text-[#555] hover:text-[#aaa] hover:bg-white/4"
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}

        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-white/4 cursor-pointer transition-colors mt-1">
          <div className="w-5 h-5 rounded-full bg-[#222] border border-white/10 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-medium truncate">{profile?.name ?? "Loading…"}</div>
            <div className="text-[#444] text-[10px] truncate capitalize">{profile?.plan ?? ""} plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
