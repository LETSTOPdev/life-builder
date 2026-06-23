"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Plus, Clock, Flame, CheckCircle2, X, Target, Trash2 } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number;
  daysLeft: number;
  streak: number;
  status: string;
  description: string;
}

const categories = ["All", "Health", "Career", "Learning", "Finance", "Other"];
const catOptions = ["Health", "Career", "Learning", "Finance", "Other"];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", description: "", category: "Health", daysLeft: 30 });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadGoals() {
    try {
      const r = await fetch("/api/goals?status=all");
      const d = await r.json();
      if (d.goals) setGoals(d.goals);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { loadGoals(); }, []);

  const filtered = goals.filter((g) => {
    const statusMatch = activeTab === "all" || g.status === activeTab;
    const catMatch = activeCategory === "All" || g.category === activeCategory;
    return statusMatch && catMatch;
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!newGoal.title.trim()) return setFormError("Title is required");
    if (newGoal.daysLeft < 1) return setFormError("Days must be at least 1");
    setSaving(true);
    try {
      const r = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newGoal, daysLeft: Number(newGoal.daysLeft) }),
      });
      const d = await r.json();
      if (!r.ok) return setFormError(d.error ?? "Failed to create goal");
      setGoals((prev) => [d.goal, ...prev]);
      setShowModal(false);
      setNewGoal({ title: "", description: "", category: "Health", daysLeft: 30 });
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/goals/${id}`, { method: "DELETE" });
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch {}
  }

  async function handleComplete(goal: Goal) {
    try {
      const r = await fetch(`/api/goals/${goal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: goal.status === "completed" ? "active" : "completed", progress: goal.status === "completed" ? goal.progress : 100 }),
      });
      const d = await r.json();
      if (d.goal) setGoals((prev) => prev.map((g) => g.id === goal.id ? d.goal : g));
    } catch {}
  }

  async function handleProgressChange(id: string, progress: number) {
    try {
      const r = await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      });
      const d = await r.json();
      if (d.goal) setGoals((prev) => prev.map((g) => g.id === id ? d.goal : g));
    } catch {}
  }

  return (
    <div className="p-6 pb-24 lg:pb-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Goals</h1>
          <p className="text-[#555] text-sm mt-1">{goals.filter((g) => g.status === "active").length} active · {goals.filter((g) => g.status === "completed").length} completed</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New goal
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {["active", "completed", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer capitalize ${activeTab === tab ? "bg-white/10 text-white" : "text-[#555] hover:text-[#888]"}`}
          >
            {tab}
          </button>
        ))}
        <div className="w-px h-4 bg-white/10 mx-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${activeCategory === cat ? "bg-white/10 text-white" : "text-[#555] hover:text-[#888]"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Goal list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#161616] border border-white/12 rounded-xl p-5 animate-pulse">
              <div className="h-4 w-1/2 bg-white/8 rounded mb-3" />
              <div className="h-1 w-full bg-white/8 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#161616] border border-white/12 rounded-xl p-12 text-center">
          <Target className="w-8 h-8 text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm">No goals here yet.</p>
          <button onClick={() => setShowModal(true)} className="text-white text-xs mt-2 hover:underline cursor-pointer">
            Create your first goal →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((goal) => (
            <div key={goal.id} className={`bg-[#161616] border rounded-xl p-5 transition-colors group ${goal.status === "completed" ? "border-white/6 opacity-70" : "border-white/12 hover:border-white/20"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => handleComplete(goal)}
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${goal.status === "completed" ? "bg-white border-white" : "border-white/25 hover:border-white/50"}`}
                    >
                      {goal.status === "completed" && <CheckCircle2 className="w-3 h-3 text-black" />}
                    </button>
                    <h3 className={`text-white font-medium text-sm ${goal.status === "completed" ? "line-through text-[#555]" : ""}`}>{goal.title}</h3>
                  </div>
                  {goal.description && <p className="text-[#444] text-xs ml-6 mb-2">{goal.description}</p>}
                  <div className="flex items-center gap-3 ml-6">
                    <span className="text-[#444] text-xs bg-white/5 px-2 py-0.5 rounded">{goal.category}</span>
                    <span className="text-[#444] text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{goal.daysLeft}d left</span>
                    {goal.streak > 0 && <span className="text-[#444] text-xs flex items-center gap-1"><Flame className="w-3 h-3" />{goal.streak}d streak</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">{goal.progress}%</span>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-400 transition-all cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="ml-6">
                <Progress value={goal.progress} className="h-1 mb-2 bg-white/8" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={goal.progress}
                  onChange={(e) => setGoals((prev) => prev.map((g) => g.id === goal.id ? { ...g, progress: Number(e.target.value) } : g))}
                  onMouseUp={(e) => handleProgressChange(goal.id, Number((e.target as HTMLInputElement).value))}
                  onTouchEnd={(e) => handleProgressChange(goal.id, Number((e.target as HTMLInputElement).value))}
                  className="w-full h-1 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:appearance-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add goal modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-[#111] border border-white/12 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold">New Goal</h2>
              <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-white cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-[#666] text-xs block mb-1.5">Goal title *</label>
                <input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Run a half marathon"
                  className="w-full bg-[#0c0c0c] border border-white/12 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#333] focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-[#666] text-xs block mb-1.5">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal((p) => ({ ...p, description: e.target.value }))}
                  placeholder="What does success look like?"
                  rows={2}
                  className="w-full bg-[#0c0c0c] border border-white/12 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#333] focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#666] text-xs block mb-1.5">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal((p) => ({ ...p, category: e.target.value }))}
                    className="w-full bg-[#0c0c0c] border border-white/12 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                  >
                    {catOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[#666] text-xs block mb-1.5">Days to achieve</label>
                  <input
                    type="number"
                    min={1}
                    value={newGoal.daysLeft}
                    onChange={(e) => setNewGoal((p) => ({ ...p, daysLeft: Number(e.target.value) }))}
                    className="w-full bg-[#0c0c0c] border border-white/12 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>
              {formError && <p className="text-red-400 text-xs">{formError}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-white/12 text-[#555] text-sm rounded-lg hover:text-white hover:border-white/25 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-50">
                  {saving ? "Saving…" : "Create goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
