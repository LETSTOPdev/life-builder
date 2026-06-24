"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  { feature: "Personalized AI coaching", buildr: true, todoApp: false, journalApp: false, coach: true },
  { feature: "Goal tracking & roadmaps", buildr: true, todoApp: true, journalApp: false, coach: true },
  { feature: "Daily action recommendations", buildr: true, todoApp: false, journalApp: false, coach: false },
  { feature: "Pattern & habit analytics", buildr: true, todoApp: false, journalApp: true, coach: false },
  { feature: "Digital Twin memory", buildr: true, todoApp: false, journalApp: false, coach: false },
  { feature: "Learns and improves over time", buildr: true, todoApp: false, journalApp: false, coach: false },
  { feature: "Available 24/7", buildr: true, todoApp: true, journalApp: true, coach: false },
  { feature: "Under $50/month", buildr: true, todoApp: true, journalApp: true, coach: false },
];

const cols = [
  { label: "Buildr", highlight: true },
  { label: "To-do apps", highlight: false },
  { label: "Journal apps", highlight: false },
  { label: "Human coach", highlight: false },
];

function Tick({ yes }: { yes: boolean }) {
  return yes
    ? <Check className="w-4 h-4 text-neutral-900 mx-auto" strokeWidth={2.5} />
    : <X className="w-4 h-4 text-neutral-200 mx-auto" strokeWidth={2} />;
}

export function ComparisonSection() {
  return (
    <section className="py-28 bg-neutral-50 border-t border-neutral-100">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-400 font-medium mb-4">Why Buildr</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight max-w-xl">
            The only tool built<br />for your whole life
          </h2>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left pb-4 pr-6 text-neutral-400 text-xs font-medium uppercase tracking-wide w-1/2">Feature</th>
                {cols.map((col) => (
                  <th
                    key={col.label}
                    className={`pb-4 px-3 text-center text-xs font-semibold w-[12.5%] ${col.highlight ? "text-neutral-900" : "text-neutral-400"}`}
                  >
                    {col.highlight ? (
                      <span className="bg-neutral-900 text-white px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest">
                        {col.label}
                      </span>
                    ) : col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="group"
                >
                  <td className="py-3.5 pr-6 text-neutral-600 text-sm group-hover:text-neutral-900 transition-colors">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-3 text-center bg-neutral-50/80"><Tick yes={row.buildr} /></td>
                  <td className="py-3.5 px-3 text-center"><Tick yes={row.todoApp} /></td>
                  <td className="py-3.5 px-3 text-center"><Tick yes={row.journalApp} /></td>
                  <td className="py-3.5 px-3 text-center"><Tick yes={row.coach} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
