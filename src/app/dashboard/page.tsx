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

// Static Daily Big 3 actions (in a real app these come from the AI/API)
const BIG3_ACTIONS = [
  { id: "1", label: "Review your top goal and write one next step", category: "Focus" },
  { id: "2", label: "Complete a 20-minute deep work block before noon", category: "Productivity" },
  { id: "3", label: "Journal for 5 minutes on what's working", category: "Reflection" },
];

function DailyBig3() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));

  const completedCount = Object.values(done).filter(Boolean).length;

  return (
    <div className="bg-neutral-900 rounded-2xl p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white font-semibold text-sm">Daily Big 3</p>
          <p className="text-neutral-500 text-xs mt-0.5">Your 3 highest-impact actions today</p>
        </div>
        <div className="text-right">
          <span className="text-white text-sm font-bold">{completedCount}</span>
          <span className="text-neutral-500 text-sm">/3</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/10 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / 3) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {BIG3_ACTIONS.map((action, i) => (
          <button
            key={action.id}
            onClick={() => toggle(action.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
              done[action.id] ? "bg-white/5 opacity-50" : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              done[action.id] ? "bg-white border-white" : "border-white/30"
            }`}>
              {done[action.id] && (
                <svg className="w-2.5 h-2.5 text-neutral-900" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${done[action.id] ? "line-through text-neutral-500" : "text-white"}`}>
                {action.label}
              </p>
              <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wide mt-0.5 block">
                {action.category}
              </span>
            </div>
            <span className="text-neutral-600 text-xs flex-shrink-0 mt-0.5">#{i + 1}</span>
          </button>
        ))}
      </div>

      {completedCount === 3 && (
        <div className="mt-4 text-center">
          <p className="text-white text-sm font-semibold">All done! 🎯 Great work today.</p>
        </div>
      )}
    </div>
  );
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
      {/* Header */}
      <div className="mb-8 pt-2">
        <p className="text-neutral-400 text-xs mb-1">{today}</p>
        <h1 className="text-2xl font-bold text-neutral-900">{greeting}, {name}</h1>
        <p className="text-neutral-500 text-sm mt-1">
          {analytics ? `${analytics.kpis.activeGoals} active goals · ${analytics.weeklyReview.focus}` : "Loading your dashboard…"}
        </p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-neutral-200 rounded-xl p-4">
              <Icon className="w-4 h-4 text-neutral-400 mb-3" strokeWidth={1.5} />
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
              <div className="text-neutral-500 text-xs mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column: Daily Big 3 + Goals */}
        <div className="lg:col-span-2">
          <DailyBig3 />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-neutral-900 font-semibold text-sm">Active Goals</h2>
            <Link href="/dashboard/goals" className="text-neutral-400 hover:text-neutral-700 text-xs flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
              <p className="text-neutral-500 text-sm">No active goals yet.</p>
              <Link href="/dashboard/goals" className="text-neutral-900 text-xs mt-2 inline-block hover:underline">
                Add your first goal →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-400 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-neutral-900 font-medium text-sm">{goal.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-neutral-400 text-xs">{goal.category}</span>
                        <span className="text-neutral-400 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />{goal.daysLeft}d left
                        </span>
                        {goal.streak > 0 && (
                          <span className="text-neutral-400 text-xs flex items-center gap-1">
                            <Flame className="w-3 h-3" />{goal.streak}d
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-neutral-900 text-sm font-semibold">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-1 bg-neutral-100" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Weekly Review */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-neutral-900 font-semibold text-sm">Weekly Review</h2>
            <Link href="/dashboard/coach" className="text-neutral-400 hover:text-neutral-700 text-xs flex items-center gap-1 transition-colors">
              Coach <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {analytics?.weeklyReview.wins.map((win, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-xl p-4">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">Win</div>
                <p className="text-neutral-600 text-xs leading-relaxed">{win}</p>
              </div>
            ))}
            {analytics && (
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">Recommendation</div>
                <p className="text-neutral-600 text-xs leading-relaxed">{analytics.weeklyReview.recommendation}</p>
              </div>
            )}
            {!analytics && (
              <>
                <div className="bg-white border border-neutral-200 rounded-xl p-4 animate-pulse h-20" />
                <div className="bg-white border border-neutral-200 rounded-xl p-4 animate-pulse h-16" />
              </>
            )}
            <Link href="/dashboard/coach" className="w-full mt-1 py-2.5 border border-dashed border-neutral-200 text-neutral-400 text-xs rounded-xl hover:border-neutral-400 hover:text-neutral-700 transition-all flex items-center justify-center gap-2">
              Ask your coach
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
