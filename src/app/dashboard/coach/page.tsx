"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Zap } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What should I focus on this week?",
  "How can I improve my consistency?",
  "Review my current goal progress",
  "Help me plan tomorrow",
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    fetch("/api/coach/message")
      .then((r) => r.json())
      .then((d) => {
        if (d.messages && d.messages.length > 0) {
          setMessages(d.messages.map((m: { role: string; content: string }, i: number) => ({ id: String(i), ...m })));
        } else {
          setMessages([{
            id: "welcome",
            role: "assistant",
            content: "Hi! I'm your AI coach. I can see your goals and progress. What would you like to work on today?",
          }]);
        }
      })
      .catch(() => {
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: "Hi! I'm your AI coach. What would you like to work on today?",
        }]);
      })
      .finally(() => setLoading(false));
  }, []);

  const send = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const r = await fetch("/api/coach/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });
      const d = await r.json();
      if (d.message) {
        if (d.live !== undefined) setIsLive(d.live);
        setMessages((prev) => [...prev, { id: Date.now().toString() + "a", role: "assistant", content: d.message }]);
      }
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString() + "e", role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const showSuggested = messages.length <= 1 && !isTyping;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-white/12 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-white text-sm font-medium">AI Coach</div>
            {isLive !== null && (
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-400" : "bg-[#444]"}`} />
                <span className="text-[10px] text-[#555]">{isLive ? "Live" : "Offline mode"}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : ""}`}>
                <div className={`h-12 rounded-xl animate-pulse ${i % 2 === 0 ? "w-48 bg-white/8" : "w-64 bg-[#161616]"}`} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-white text-black rounded-br-sm"
                      : "bg-[#161616] border border-white/12 text-[#ccc] rounded-bl-sm"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#161616] border border-white/12 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#444] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showSuggested && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs text-[#555] border border-white/8 px-3 py-1.5 rounded-full hover:border-white/20 hover:text-[#888] transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-3 flex-shrink-0 border-t border-white/6">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Message your coach…"
            rows={1}
            className="flex-1 bg-[#161616] border border-white/12 rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#333] focus:outline-none focus:border-white/25 transition-colors resize-none leading-relaxed"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-30 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
