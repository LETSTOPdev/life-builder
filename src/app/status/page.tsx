import { StaticShell, StaticHeading } from "@/components/layout/static-shell";

export default function StatusPage() {
  const services = [
    { name: "API", status: "Operational" },
    { name: "Web App", status: "Operational" },
    { name: "AI Coach", status: "Operational" },
    { name: "Authentication", status: "Operational" },
    { name: "Database", status: "Operational" },
    { name: "Email Notifications", status: "Operational" },
  ];

  return (
    <StaticShell>
      <StaticHeading label="System Status" title="All systems operational." subtitle="Uptime: 99.98% over last 90 days." />
      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.name} className="flex items-center justify-between bg-[#161616] border border-white/10 rounded-xl px-5 py-4">
            <span className="text-white text-sm">{s.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/50" />
              <span className="text-[#666] text-xs">{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </StaticShell>
  );
}
