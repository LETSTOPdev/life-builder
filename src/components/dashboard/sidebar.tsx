"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Target, Brain, BarChart3, BookOpen, Settings, Zap, ArrowUp, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; email: string; plan: string } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => { if (d.profile) setProfile(d.profile); })
      .catch(() => {});
  }, []);

  const initials = profile?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch {
      toast.error("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-neutral-100 h-screen sticky top-0">
      <div className="px-4 py-4 border-b border-neutral-100">
        <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
          <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" fill="white" />
          </div>
          <span className="text-neutral-900 font-semibold text-sm">Buildr</span>
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
                active ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50"
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
          <div className="border border-neutral-200 rounded-lg p-3 mb-2 bg-neutral-50">
            <div className="flex items-center gap-2 mb-1.5">
              <ArrowUp className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-900 text-xs font-medium">Upgrade to Pro</span>
            </div>
            <p className="text-neutral-400 text-xs mb-3 leading-relaxed">Unlock unlimited goals and AI coaching.</p>
            <Link
              href="/upgrade"
              className="w-full text-xs font-medium bg-neutral-900 text-white py-1.5 rounded-full cursor-pointer hover:bg-neutral-700 transition-colors inline-flex items-center justify-center"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}

      <div className="px-2 pb-2 border-t border-neutral-100 pt-2 space-y-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
                active ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50"
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-neutral-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>

        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-neutral-50 cursor-pointer transition-colors mt-1">
          <div className="w-5 h-5 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-700 text-[9px] font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-neutral-900 text-xs font-medium truncate">{profile?.name ?? "Loading…"}</div>
            <div className="text-neutral-400 text-[10px] truncate capitalize">{profile?.plan ?? ""} plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
