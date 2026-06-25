"use client";

import { useEffect, useState } from "react";
import { Plus, X, BookOpen, Trash2 } from "lucide-react";

interface JournalEntry {
  id: string;
  mood: string;
  content: string;
  tags: string[];
  insight: string;
  createdAt: string;
}

const moods = [
  { value: "great", label: "Great" },
  { value: "good", label: "Good" },
  { value: "okay", label: "Okay" },
  { value: "hard", label: "Hard" },
  { value: "terrible", label: "Terrible" },
];

const moodColors: Record<string, string> = {
  great: "text-emerald-500",
  good: "text-blue-500",
  okay: "text-yellow-500",
  hard: "text-orange-500",
  terrible: "text-red-500",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedMood, setSelectedMood] = useState("okay");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterMood, setFilterMood] = useState("all");

  async function loadEntries() {
    try {
      const url = filterMood !== "all" ? `/api/journal?mood=${filterMood}` : "/api/journal";
      const r = await fetch(url);
      const d = await r.json();
      if (d.entries) setEntries(d.entries);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { loadEntries(); }, [filterMood]);

  async function handleSave() {
    setError("");
    if (content.trim().length < 10) return setError("Write at least 10 characters.");
    setSaving(true);
    try {
      const r = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), mood: selectedMood }),
      });
      const d = await r.json();
      if (!r.ok) return setError(d.error ?? "Failed to save");
      setEntries((prev) => [d.entry, ...prev]);
      setContent("");
      setShowEditor(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/journal/${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {}
  }

  return (
    <div className="p-6 pb-24 lg:pb-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Journal</h1>
          <p className="text-neutral-500 text-sm mt-1">{entries.length} {entries.length === 1 ? "entry" : "entries"}</p>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-neutral-700 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New entry
        </button>
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {["all", ...moods.map((m) => m.value)].map((m) => (
          <button
            key={m}
            onClick={() => setFilterMood(m)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer capitalize ${filterMood === m ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-700"}`}
          >
            {m === "all" ? "All" : moods.find((x) => x.value === m)?.label}
          </button>
        ))}
      </div>

      {showEditor && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-neutral-900 text-sm font-medium">New entry</span>
            <button onClick={() => setShowEditor(false)} className="text-neutral-400 hover:text-neutral-700 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-colors ${selectedMood === m.value ? "bg-neutral-900 text-white font-medium" : "border border-neutral-200 text-neutral-500 hover:text-neutral-900"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today?"
            rows={5}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-neutral-900 text-sm placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors resize-none leading-relaxed"
            autoFocus
          />
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 mt-2">
              <p className="text-red-600 text-xs">{error}</p>
              {error.includes("Upgrade") && (
                <a href="/upgrade" className="text-xs font-medium text-red-700 underline mt-1 inline-block">View upgrade options →</a>
              )}
            </div>
          )}
          <div className="flex gap-3 mt-3">
            <button onClick={() => setShowEditor(false)} className="px-4 py-2 border border-neutral-200 text-neutral-500 text-sm rounded-full hover:text-neutral-900 cursor-pointer transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-700 cursor-pointer transition-colors disabled:opacity-50">
              {saving ? "Saving…" : "Save entry"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 animate-pulse">
              <div className="h-3 w-1/4 bg-neutral-100 rounded mb-3" />
              <div className="h-12 w-full bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <BookOpen className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">No journal entries yet.</p>
          <button onClick={() => setShowEditor(true)} className="text-neutral-900 text-xs mt-2 hover:underline cursor-pointer">
            Write your first entry →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-400 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-xs font-medium capitalize ${moodColors[entry.mood] ?? "text-neutral-500"}`}>{entry.mood}</span>
                  <span className="text-neutral-200 text-xs mx-2">·</span>
                  <span className="text-neutral-400 text-xs">{formatDate(entry.createdAt)}</span>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-red-500 transition-all cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed mb-3">{entry.content}</p>
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {entry.insight && (
                <div className="border-t border-neutral-100 pt-3 mt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">AI Insight</p>
                  <p className="text-neutral-500 text-xs leading-relaxed">{entry.insight}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
