"use client";

import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";

type Tab = "profile" | "notifications" | "subscription" | "password" | "privacy";
const tabs: Tab[] = ["profile", "notifications", "subscription", "password", "privacy"];

interface Profile {
  id: string;
  name: string;
  email: string;
  bio: string;
  timezone: string;
  plan: string;
}

interface Notifications {
  weeklyReview: boolean;
  goalAlerts: boolean;
  aiInsights: boolean;
  emailDigest: boolean;
  streakReminders: boolean;
  coachMessages: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<Notifications>({
    weeklyReview: true, goalAlerts: true, aiInsights: true,
    emailDigest: false, streakReminders: true, coachMessages: true,
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) setProfile(d.profile);
        if (d.notifications) setNotifications(d.notifications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, bio: profile.bio, timezone: profile.timezone }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {} finally { setSaving(false); }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {} finally { setSaving(false); }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${checked ? "bg-neutral-900" : "bg-neutral-200"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );

  const SaveBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 bg-neutral-900 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
    >
      {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : saving ? "Saving…" : "Save changes"}
    </button>
  );

  const initials = profile?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "??";

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Settings</h1>
        <div className="bg-white border border-neutral-200 rounded-xl p-6 animate-pulse h-48" />
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 lg:pb-6 max-w-2xl mx-auto">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-1 bg-neutral-100 border border-neutral-200 rounded-lg p-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize cursor-pointer transition-all whitespace-nowrap ${activeTab === tab ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "profile" && profile && (
        <div className="space-y-5">
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <h2 className="text-neutral-900 font-medium text-sm mb-5">Profile</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-700 text-sm font-bold flex-shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-neutral-900 text-sm font-medium">{profile.name}</p>
                <p className="text-neutral-400 text-xs">{profile.email}</p>
                <span className="text-[10px] text-neutral-500 border border-neutral-200 px-2 py-0.5 rounded mt-1 inline-block capitalize">{profile.plan}</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full name", key: "name", type: "text", placeholder: "Your name" },
                { label: "Timezone", key: "timezone", type: "text", placeholder: "UTC-5 (New York)" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-neutral-500 text-xs block mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={(profile as unknown as Record<string, string>)[key] ?? ""}
                    onChange={(e) => setProfile((p) => p ? { ...p, [key]: e.target.value } : p)}
                    placeholder={placeholder}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-neutral-900 text-sm placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="text-neutral-500 text-xs block mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => p ? { ...p, bio: e.target.value } : p)}
                  placeholder="Tell us about yourself"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-neutral-900 text-sm placeholder:text-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors resize-none"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <SaveBtn onClick={handleSaveProfile} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-neutral-900 font-medium text-sm mb-5">Notifications</h2>
          <div className="space-y-4">
            {(Object.entries(notifications) as [keyof Notifications, boolean][]).map(([key, val]) => {
              const labels: Record<string, string> = {
                weeklyReview: "Weekly review", goalAlerts: "Goal alerts",
                aiInsights: "AI insights", emailDigest: "Email digest",
                streakReminders: "Streak reminders", coachMessages: "Coach messages",
              };
              const descs: Record<string, string> = {
                weeklyReview: "Get a weekly summary of your progress",
                goalAlerts: "Be notified when goals are approaching",
                aiInsights: "Daily AI-generated insights about your patterns",
                emailDigest: "Weekly email with your top metrics",
                streakReminders: "Reminders to maintain your daily streak",
                coachMessages: "Proactive messages from your AI coach",
              };
              return (
                <div key={key} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-neutral-900 text-sm">{labels[key]}</p>
                    <p className="text-neutral-400 text-xs mt-0.5">{descs[key]}</p>
                  </div>
                  <Toggle checked={val} onChange={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))} />
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex justify-end">
            <SaveBtn onClick={handleSaveNotifications} />
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-neutral-900 font-medium text-sm mb-2">Subscription</h2>
          <p className="text-neutral-400 text-xs mb-5">Current plan: <span className="text-neutral-900 capitalize">{profile?.plan ?? "free"}</span></p>
          <Link
            href="/upgrade"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-neutral-700 transition-colors"
          >
            View plans →
          </Link>
        </div>
      )}

      {activeTab === "password" && (
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <h2 className="text-neutral-900 font-medium text-sm mb-5">Change Password</h2>
          <div className="space-y-4">
            {[
              { label: "Current password", show: showCurrentPw, toggle: () => setShowCurrentPw((p) => !p) },
              { label: "New password", show: showNewPw, toggle: () => setShowNewPw((p) => !p) },
            ].map(({ label, show, toggle }) => (
              <div key={label}>
                <label className="text-neutral-500 text-xs block mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors pr-10"
                  />
                  <button onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <p className="text-neutral-400 text-xs">Minimum 8 characters, one uppercase, one number.</p>
          </div>
          <div className="mt-5 flex justify-end">
            <button className="flex items-center gap-2 bg-neutral-900 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-neutral-700 transition-colors cursor-pointer">
              Update password
            </button>
          </div>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <h2 className="text-neutral-900 font-medium text-sm mb-4">Privacy</h2>
            <div className="space-y-3">
              <button className="w-full text-left text-neutral-500 text-sm py-2 hover:text-neutral-900 transition-colors cursor-pointer">Export my data →</button>
              <Link href="#" className="block text-neutral-500 text-sm py-2 hover:text-neutral-900 transition-colors">Privacy policy →</Link>
            </div>
          </div>
          <div className="bg-white border border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-neutral-900 font-medium text-sm mb-1">Danger zone</h3>
                <p className="text-neutral-500 text-xs">These actions are permanent and cannot be undone.</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left text-red-400 hover:text-red-600 text-sm py-2 transition-colors cursor-pointer">Delete all goal data</button>
              <button className="w-full text-left text-red-400 hover:text-red-600 text-sm py-2 transition-colors cursor-pointer">Delete account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
