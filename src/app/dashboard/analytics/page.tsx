"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface AnalyticsData {
  kpis: {
    activeGoals: number;
    completedGoals: number;
    avgProgress: number;
    currentStreak: number;
    journalEntries: number;
    avgMood: number;
  };
  weeklyPerformance: { day: string; completion: number | null }[];
  lifeAreas: { name: string; value: number; goals: number }[];
  weeklyReview: { wins: string[]; focus: string; recommendation: string };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { if (d.kpis) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const maxBar = data
    ? Math.max(...data.weeklyPerformance.map((d) => d.completion ?? 0), 1)
    : 100;

  const kpiCards = data
    ? [
        { label: "Active goals", value: String(data.kpis.activeGoals) },
        { label: "Avg progress", value: `${data.kpis.avgProgress}%` },
        { label: "Day streak", value: String(data.kpis.currentStreak) },
        { label: "Journal entries", value: String(data.kpis.journalEntries) },
      ]
    : [];

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8 pt-2">
          <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
          <p className="text-neutral-500 text-sm mt-1">Loading your data…</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-xl p-4 animate-pulse h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 lg:pb-6 max-w-4xl mx-auto">
      <div className="mb-8 pt-2">
        <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
        <p className="text-neutral-500 text-sm mt-1">Your performance at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-neutral-900 mb-1">{kpi.value}</div>
            <div className="text-neutral-500 text-xs">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
            <h2 className="text-neutral-900 text-sm font-semibold">Weekly Activity</h2>
          </div>
          {data && (
            <div className="flex items-end gap-2 h-32">
              {data.weeklyPerformance.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-sm transition-all ${d.completion === null ? "bg-neutral-100 border border-dashed border-neutral-200" : "bg-neutral-800"}`}
                    style={{
                      height: d.completion !== null ? `${(d.completion / maxBar) * 100}%` : "8px",
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-neutral-400 text-[10px]">{d.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-neutral-900 text-sm font-semibold mb-4">Goal Areas</h2>
          {data && data.lifeAreas.length > 0 ? (
            <div className="space-y-3">
              {data.lifeAreas.map((area) => (
                <div key={area.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-600">{area.name}</span>
                    <span className="text-neutral-400">{area.value}%</span>
                  </div>
                  <Progress value={area.value} className="h-1 bg-neutral-100" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400 text-sm">Add goals to see area breakdown.</p>
          )}
        </div>
      </div>

      {data && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-neutral-900 text-sm font-semibold mb-4">Weekly Review</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">Wins</p>
              <ul className="space-y-1">
                {data.weeklyReview.wins.map((w, i) => (
                  <li key={i} className="text-neutral-600 text-xs leading-relaxed">· {w}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">Focus</p>
              <p className="text-neutral-600 text-xs leading-relaxed">{data.weeklyReview.focus}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">Recommendation</p>
              <p className="text-neutral-600 text-xs leading-relaxed">{data.weeklyReview.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
