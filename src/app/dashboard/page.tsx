"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Target, Flame, CheckCircle2, Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number;
  daysLeft: number;
  streak: number;
}

interface Analytics {
  kpis: {
    activeGoals: number;
    currentStreak: number;
    journalEntries: number;
    avgProgress: number;
  };
  weeklyReview: {
    wins: string[];
    focus: string;
    recommendation: string;
  };
}

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [name, setName] = useState("there");
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    fetch("/api/goals?status=active")
      .then((r) => r.json())
      .then((d) => { if (d.goals) setGoals(d.goals.slice(0, 3)); })
      .catch(() => {});

    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { if (d.kpis) setAnalytics(d); })
      .catch(() => {});

    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => { if (d.profile?.name) setName(d.profile.name.split(" ")[0]); })
      .catch(() => {});
  }, []);

  const stats = analytics
    ? [
        { label: "Active goals", value: String(analytics.kpis.activeGoals), icon: Target },
        { label: "Day streak", value: String(analytics.kpis.currentStreak), icon: Flame },
        { label: "Journal entries", value: String(analytics.kpis.journalEntries), icon: CheckCircle2 },
        { label: "Avg progress", value: `${analytics.kpis.avgProgress}%`, icon: Sparkles },
      ]
    : [
        { label: "Active goals", value: "—", icon: Target },
        { label: "Day streak", value: "—", icon: Flame },
        { label: "Journal entries", value: "—", icon: CheckCircle2 },
        { label: "Avg progress", value: "—", icon: Sparkles },
      ];

  return (
    <div className="p-6 pb-24 lg:pb-6 max-w-5xl mx-auto">
      <div className="mb-8 pt-2">
        <p className="text-[#444] text-xs mb-1">{today}</p>
        <h1 className="text-2xl font-bold text-white">{greeting}, {name}</h1>
        <p className="text-[#555] text-sm mt-1">
          {analytics ? `${analytics.kpis.activeGoals} active goals · ${analytics.weeklyReview.focus}` : "Loading your dashboard…"}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#161616] border border-white/12 rounded-xl p-4">
              <Icon className="w-4 h-4 text-[#555] mb-3" strokeWidth={1.5} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-[#555] text-xs mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Active Goals</h2>
            <Link href="/dashboard/goals" className="text-[#444] hover:text-white text-xs flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className="bg-[#161616] border border-white/12 rounded-xl p-8 text-center">
              <p className="text-[#555] text-sm">No active goals yet.</p>
              <Link href="/dashboard/goals" className="text-white text-xs mt-2 inline-block hover:underline">
                Add your first goal →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-[#161616] border border-white/12 rounded-xl p-5 hover:border-white/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium text-sm">{goal.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[#555] text-xs">{goal.category}</span>
                        <span className="text-[#555] text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />{goal.daysLeft}d left
                        </span>
                        {goal.streak > 0 && (
                          <span className="text-[#555] text-xs flex items-center gap-1">
                            <Flame className="w-3 h-3" />{goal.streak}d
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-white text-sm font-semibold">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-1 bg-white/8" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Weekly Review</h2>
            <Link href="/dashboard/coach" className="text-[#444] hover:text-white text-xs flex items-center gap-1 transition-colors">
              Coach <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {analytics?.weeklyReview.wins.map((win, i) => (
              <div key={i} className="bg-[#161616] border border-white/12 rounded-xl p-4">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[#555] mb-2">Win</div>
                <p className="text-[#888] text-xs leading-relaxed">{win}</p>
              </div>
            ))}
            {analytics && (
              <div className="bg-[#161616] border border-white/12 rounded-xl p-4">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[#555] mb-2">Recommendation</div>
                <p className="text-[#888] text-xs leading-relaxed">{analytics.weeklyReview.recommendation}</p>
              </div>
            )}
            <Link href="/dashboard/coach" className="w-full mt-1 py-2.5 border border-dashed border-white/12 text-[#555] text-xs rounded-xl hover:border-white/25 hover:text-[#888] transition-all flex items-center justify-center gap-2">
              Ask your coach
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
