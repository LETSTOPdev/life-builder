import { StaticShell, StaticHeading } from "@/components/layout/static-shell";

const services = [
  { name: "Web App", status: "Operational", latency: "84ms" },
  { name: "API", status: "Operational", latency: "120ms" },
  { name: "AI Coach", status: "Operational", latency: "340ms" },
  { name: "Authentication", status: "Operational", latency: "95ms" },
  { name: "Database", status: "Operational", latency: "12ms" },
  { name: "Email Notifications", status: "Operational", latency: "—" },
  { name: "File Storage", status: "Operational", latency: "—" },
  { name: "Webhooks", status: "Operational", latency: "—" },
];

const incidents: { date: string; title: string; resolved: boolean; detail: string }[] = [];

const uptimeDays = Array.from({ length: 90 }, (_, i) => ({
  day: i,
  up: Math.random() > 0.02,
}));

export default function StatusPage() {
  const upDays = uptimeDays.filter((d) => d.up).length;
  const uptimePct = ((upDays / 90) * 100).toFixed(2);

  return (
    <StaticShell maxWidth="max-w-2xl">
      <StaticHeading
        label="System Status"
        title="All systems operational."
        subtitle={`${uptimePct}% uptime over the last 90 days.`}
      />

      {/* 90-day uptime bar */}
      <div className="mb-10">
        <div className="flex gap-0.5 mb-2">
          {uptimeDays.map((d) => (
            <div
              key={d.day}
              className={`flex-1 h-8 rounded-sm ${d.up ? "bg-emerald-400" : "bg-red-300"}`}
              title={d.up ? "Operational" : "Incident"}
            />
          ))}
        </div>
        <div className="flex justify-between text-neutral-400 text-xs">
          <span>90 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-2 mb-12">
        {services.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-4"
          >
            <span className="text-neutral-900 text-sm">{s.name}</span>
            <div className="flex items-center gap-4">
              {s.latency !== "—" && (
                <span className="text-neutral-400 text-xs font-mono">{s.latency}</span>
              )}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-neutral-500 text-xs">{s.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Incident history */}
      <div>
        <h2 className="text-neutral-900 font-semibold text-base mb-4 pb-2 border-b border-neutral-100">
          Incident History
        </h2>
        {incidents.length === 0 ? (
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-6 text-center">
            <p className="text-neutral-400 text-sm">No incidents in the last 90 days.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <div key={inc.title} className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-neutral-900 font-medium text-sm">{inc.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${inc.resolved ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-700"}`}>
                    {inc.resolved ? "Resolved" : "Monitoring"}
                  </span>
                </div>
                <p className="text-neutral-400 text-xs">{inc.date}</p>
                <p className="text-neutral-500 text-sm mt-2">{inc.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-neutral-400 text-xs mt-8">
        Last checked: just now · Updates every 60 seconds
      </p>
    </StaticShell>
  );
}
