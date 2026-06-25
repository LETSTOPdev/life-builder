/**
 * Plan feature limits — single source of truth for what each plan can do.
 * Check these on every API route that writes data.
 */
export type Plan = "free" | "pro" | "premium" | "elite";

export const PLAN_LIMITS = {
  free: {
    maxActiveGoals: 3,
    coachMessagesPerDay: 5,
    journalEntriesPerDay: 3,
  },
  pro: {
    maxActiveGoals: Infinity,
    coachMessagesPerDay: Infinity,
    journalEntriesPerDay: Infinity,
  },
  premium: {
    maxActiveGoals: Infinity,
    coachMessagesPerDay: Infinity,
    journalEntriesPerDay: Infinity,
  },
  elite: {
    maxActiveGoals: Infinity,
    coachMessagesPerDay: Infinity,
    journalEntriesPerDay: Infinity,
  },
} as const;

export function getLimits(plan: string) {
  return PLAN_LIMITS[(plan as Plan) in PLAN_LIMITS ? (plan as Plan) : "free"];
}
