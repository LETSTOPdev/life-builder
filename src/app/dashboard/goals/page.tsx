"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Plus, Clock, Flame, CheckCircle2, X, Target, Trash2, Sparkles, ArrowRight, Loader2, ChevronRight } from "lucide-react";

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

interface Suggestion {
  title: string;
  description: string;
  category: string;
  daysLeft: number;
  why: string;
}

const categories = ["All", "Health", "Career", "Learning", "Finance", "Other"];
const catOptions = ["Health", "Career", "Learning", "Finance", "Other"];

const categoryColors: Record<string, string> = {
  Health: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Career: "bg-blue-50 text-blue-700 border-blue-100",
  Learning: "bg-violet-50 text-violet-700 border-violet-100",
  Finance: "bg-amber-50 text-amber-700 border-amber-100",
  Other: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalView, setModalView] = useState<"suggest" | "custom">("suggest");
  const [newGoal, setNewGoal] = useState({ title: "", description: "", category: "Health", daysLeft: 30 });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);

  async function loadGoals() {
    try {
      const r = await fetch("/api/goals?status=all");
      const d = await r.json();
      if (d.goals) setGoals(d.goals);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { loadGoals(); }, []);

  async function loadSuggestions() {
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const r = await fetch("/api/goals/suggest", { method: "POST" });
      const d = await r.json();
      if (d.suggestions) setSuggestions(d.suggestions);
    } catch {}
    setLoadingSuggestions(false);
  }

  function openModal() {
    setShowModal(true);
    setModalView("suggest");
    setSelectedSuggestion(null);
    setNewGoal({ title: "", description: "", category: "Health", daysLeft: 30 });
    setFormError("");
    loadSuggestions();
  }

  function applySuggestion(s: Suggestion, idx: number) {
    setSelectedSuggestion(idx);
    setNewGoal({ title: s.title, description: s.description, category: s.category, daysLeft: s.daysLeft });
    setModalView("custom");
  }

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
    if (!confirm("Delete this goal? This cannot be undone.")) return;
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
          <h1 className="text-2xl font-bold text-neutral-900">Goals</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {goals.filter((g) => g.status === "active").length} active · {goals.filter((g) => g.status === "completed").length} completed
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-neutral-700 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New goal
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {["active", "completed", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer capitalize ${activeTab === tab ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-700"}`}
          >
            {tab}
          </button>
        ))}
        <div className="w-px h-4 bg-neutral-200 mx-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${activeCategory === cat ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-700"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 animate-pulse">
              <div className="h-4 w-1/2 bg-neutral-100 rounded mb-3" />
              <div className="h-1 w-full bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <Target className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">No goals here yet.</p>
          <button onClick={openModal} className="text-neutral-900 text-xs mt-2 hover:underline cursor-pointer">
            Create your first goal →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((goal) => (
            <div key={goal.id} className={`bg-white border rounded-xl p-5 transition-colors group ${goal.status === "completed" ? "border-neutral-100 opacity-70" : "border-neutral-200 hover:border-neutral-300"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => handleComplete(goal)}
                      className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${goal.status === "completed" ? "bg-neutral-900 border-neutral-900" : "border-neutral-300 hover:border-neutral-500"}`}
                    >
                      {goal.status === "completed" && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                    <h3 className={`text-neutral-900 font-medium text-sm ${goal.status === "completed" ? "line-through text-neutral-400" : ""}`}>{goal.title}</h3>
                  </div>
                  {goal.description && <p className="text-neutral-400 text-xs ml-6 mb-2 leading-relaxed">{goal.description}</p>}
                  <div className="flex items-center gap-2 ml-6 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded border text-[11px] font-medium ${categoryColors[goal.category] ?? categoryColors.Other}`}>{goal.category}</span>
                    <span className="text-neutral-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{goal.daysLeft}d left</span>
                    {goal.streak > 0 && <span className="text-orange-500 text-xs flex items-center gap-1"><Flame className="w-3 h-3" />{goal.streak}d streak</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-900 text-sm font-semibold tabular-nums">{goal.progress}%</span>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-red-500 transition-all cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="ml-6">
                <Progress value={goal.progress} className="h-1 mb-2 bg-neutral-100" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={goal.progress}
                  onChange={(e) => setGoals((prev) => prev.map((g) => g.id === goal.id ? { ...g, progress: Number(e.target.value) } : g))}
                  onMouseUp={(e) => handleProgressChange(goal.id, Number((e.target as HTMLInputElement).value))}
                  onTouchEnd={(e) => handleProgressChange(goal.id, Number((e.target as HTMLInputElement).value))}
                  onBlur={(e) => handleProgressChange(goal.id, Number((e.target as HTMLInputElement).value))}
                  className="w-full h-1 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 [&::-webkit-slider-thumb]:appearance-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Goal Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
          <div className="bg-white border border-neutral-200 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100 flex-shrink-0">
              <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setModalView("suggest")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${modalView === "suggest" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
                >
                  <Sparkles className="w-3 h-3" />
                  AI Suggestions
                </button>
                <button
                  onClick={() => setModalView("custom")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${modalView === "custom" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
                >
                  <Plus className="w-3 h-3" />
                  Custom
                </button>
              </div>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Suggestions View */}
            {modalView === "suggest" && (
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <p className="text-neutral-500 text-sm mb-5">
                  {loadingSuggestions ? "Analyzing your profile…" : "Goals picked for you based on your profile and direction."}
                </p>

                {loadingSuggestions ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="border border-neutral-100 rounded-xl p-4 animate-pulse">
                        <div className="h-4 w-3/4 bg-neutral-100 rounded mb-2" />
                        <div className="h-3 w-full bg-neutral-50 rounded mb-1" />
                        <div className="h-3 w-1/2 bg-neutral-50 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => applySuggestion(s, i)}
                        className="w-full text-left border border-neutral-200 rounded-xl p-4 hover:border-neutral-400 hover:bg-neutral-50 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${categoryColors[s.category] ?? categoryColors.Other}`}>{s.category}</span>
                              <span className="text-neutral-400 text-[10px]">{s.daysLeft} days</span>
                            </div>
                            <p className="text-neutral-900 text-sm font-medium mb-1">{s.title}</p>
                            <p className="text-neutral-400 text-xs leading-relaxed mb-2">{s.description}</p>
                            <p className="text-neutral-500 text-xs italic">"{s.why}"</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 flex-shrink-0 mt-1 transition-colors" />
                        </div>
                      </button>
                    ))}

                    <button
                      onClick={loadSuggestions}
                      className="w-full py-3 border border-dashed border-neutral-200 rounded-xl text-neutral-400 text-sm hover:border-neutral-400 hover:text-neutral-600 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Loader2 className="w-3.5 h-3.5" />
                      Generate different suggestions
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Custom / Edit View */}
            {modalView === "custom" && (
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {selectedSuggestion !== null && suggestions[selectedSuggestion] && (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-neutral-500 text-xs">Why this goal for you:</p>
                      <p className="text-neutral-700 text-xs mt-0.5 italic">"{suggestions[selectedSuggestion].why}"</p>
                    </div>
                  </div>
                )}
                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="text-neutral-500 text-xs block mb-1.5 font-medium">Goal *</label>
                    <input
                      autoFocus
                      value={newGoal.title}
                      onChange={(e) => setNewGoal((p) => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Apply to 5 target companies this month"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-sm placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-500 text-xs block mb-1.5 font-medium">How you&apos;ll achieve it</label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal((p) => ({ ...p, description: e.target.value }))}
                      placeholder="The specific steps or approach you'll take…"
                      rows={2}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-sm placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors resize-none leading-relaxed"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-neutral-500 text-xs block mb-1.5 font-medium">Category</label>
                      <select
                        value={newGoal.category}
                        onChange={(e) => setNewGoal((p) => ({ ...p, category: e.target.value }))}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-3 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer"
                      >
                        {catOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-neutral-500 text-xs block mb-1.5 font-medium">Days to achieve</label>
                      <input
                        type="number"
                        min={1}
                        max={365}
                        value={newGoal.daysLeft}
                        onChange={(e) => setNewGoal((p) => ({ ...p, daysLeft: Number(e.target.value) }))}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
                      />
                    </div>
                  </div>

                  {formError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                      <p className="text-red-600 text-xs">{formError}</p>
                      {formError.includes("Upgrade") && (
                        <a href="/upgrade" className="text-xs font-medium text-red-700 underline mt-1 inline-block">View upgrade options →</a>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setModalView("suggest")}
                      className="flex items-center gap-1.5 px-4 py-2.5 border border-neutral-200 text-neutral-500 text-sm rounded-full hover:text-neutral-900 hover:border-neutral-400 transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !newGoal.title.trim()}
                      className="flex-1 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</> : "Add Goal"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
