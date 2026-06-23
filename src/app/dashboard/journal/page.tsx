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
  great: "text-emerald-400",
  good: "text-blue-400",
  okay: "text-yellow-400",
  hard: "text-orange-400",
  terrible: "text-red-400",
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
          <h1 className="text-2xl font-bold text-white">Journal</h1>
          <p className="text-[#555] text-sm mt-1">{entries.length} {entries.length === 1 ? "entry" : "entries"}</p>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New entry
        </button>
      </div>

      {/* Mood filter */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {["all", ...moods.map((m) => m.value)].map((m) => (
          <button
            key={m}
            onClick={() => setFilterMood(m)}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer capitalize ${filterMood === m ? "bg-white/10 text-white" : "text-[#555] hover:text-[#888]"}`}
          >
            {m === "all" ? "All" : moods.find((x) => x.value === m)?.label}
          </button>
        ))}
      </div>

      {/* New entry editor */}
      {showEditor && (
        <div className="bg-[#161616] border border-white/12 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white text-sm font-medium">New entry</span>
            <button onClick={() => setShowEditor(false)} className="text-[#555] hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-colors ${selectedMood === m.value ? "bg-white text-black font-medium" : "border border-white/12 text-[#555] hover:text-white"}`}
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
            className="w-full bg-[#0c0c0c] border border-white/12 rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#333] focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <div className="flex gap-3 mt-3">
            <button onClick={() => setShowEditor(false)} className="px-4 py-2 border border-white/12 text-[#555] text-sm rounded-lg hover:text-white cursor-pointer transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 cursor-pointer transition-colors disabled:opacity-50">
              {saving ? "Saving…" : "Save entry"}
            </button>
          </div>
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#161616] border border-white/12 rounded-xl p-5 animate-pulse">
              <div className="h-3 w-1/4 bg-white/8 rounded mb-3" />
              <div className="h-12 w-full bg-white/8 rounded" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-[#161616] border border-white/12 rounded-xl p-12 text-center">
          <BookOpen className="w-8 h-8 text-[#333] mx-auto mb-3" />
          <p className="text-[#555] text-sm">No journal entries yet.</p>
          <button onClick={() => setShowEditor(true)} className="text-white text-xs mt-2 hover:underline cursor-pointer">
            Write your first entry →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-[#161616] border border-white/12 rounded-xl p-5 hover:border-white/20 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-xs font-medium capitalize ${moodColors[entry.mood] ?? "text-[#555]"}`}>{entry.mood}</span>
                  <span className="text-[#333] text-xs mx-2">·</span>
                  <span className="text-[#444] text-xs">{formatDate(entry.createdAt)}</span>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-400 transition-all cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[#888] text-sm leading-relaxed mb-3">{entry.content}</p>
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-[#444] bg-white/4 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {entry.insight && (
                <div className="border-t border-white/6 pt-3 mt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444] mb-1">AI Insight</p>
                  <p className="text-[#555] text-xs leading-relaxed">{entry.insight}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
