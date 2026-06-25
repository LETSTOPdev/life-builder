import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getDb } from "@/lib/db";

function verifySignature(payload: string, sigHeader: string, secret: string): boolean {
  try {
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    return timingSafeEqual(Buffer.from(sigHeader, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

const VALID_PLANS = ["pro", "premium", "elite"] as const;
type ValidPlan = typeof VALID_PLANS[number];

// Map Lemon Squeezy variant ID → plan name using env vars.
// Returns null if the variant ID is unknown — never falls back to a free upgrade.
function planFromVariantId(variantId: string): ValidPlan | null {
  const map: Record<string, ValidPlan> = {
    [process.env.LS_VARIANT_PRO_MONTHLY     ?? "__UNSET1"]: "pro",
    [process.env.LS_VARIANT_PRO_ANNUAL      ?? "__UNSET2"]: "pro",
    [process.env.LS_VARIANT_PREMIUM_MONTHLY ?? "__UNSET3"]: "premium",
    [process.env.LS_VARIANT_PREMIUM_ANNUAL  ?? "__UNSET4"]: "premium",
    [process.env.LS_VARIANT_ELITE_MONTHLY   ?? "__UNSET5"]: "elite",
    [process.env.LS_VARIANT_ELITE_ANNUAL    ?? "__UNSET6"]: "elite",
  };
  return map[variantId] ?? null;
}

function safePlan(raw: string | undefined | null, variantId?: string): ValidPlan | null {
  if (raw && VALID_PLANS.includes(raw as ValidPlan)) return raw as ValidPlan;
  if (variantId) return planFromVariantId(variantId);
  return null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.LS_WEBHOOK_SECRET;
  if (!secret) {
    console.error("LS_WEBHOOK_SECRET not set — webhook rejected");
    return Response.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const sigHeader = req.headers.get("x-signature") ?? "";

  if (!verifySignature(rawBody, sigHeader, secret)) {
    console.warn("Webhook signature verification failed");
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    meta: { event_name: string; custom_data?: { user_id?: string; plan?: string } };
    data: { attributes: Record<string, unknown> };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const db = getDb();
  const { event_name, custom_data } = event.meta;
  const attrs = event.data.attributes;

  switch (event_name) {
    // One-time order (non-subscription purchase)
    case "order_created": {
      const userId = custom_data?.user_id ?? (attrs.custom_data as Record<string, string>)?.user_id;
      const variantId = String((attrs.first_order_item as Record<string, unknown>)?.variant_id ?? "");
      const plan = safePlan(custom_data?.plan, variantId);
      const lsCustomerId = String(attrs.customer_id ?? "");
      const lsOrderId = String(attrs.identifier ?? "");

      if (!plan) {
        console.error(`order_created: unknown variant_id="${variantId}" — no plan upgrade applied`);
        break;
      }
      if (userId && attrs.status === "paid") {
        db.prepare(
          "UPDATE users SET plan = ?, stripe_customer_id = ?, stripe_subscription_id = ?, updated_at = datetime('now') WHERE id = ?"
        ).run(plan, lsCustomerId, lsOrderId, userId);
        console.log(`order_created: user ${userId} upgraded to ${plan}`);
      }
      break;
    }

    // Subscription started or renewed
    case "subscription_created":
    case "subscription_updated": {
      const userId = custom_data?.user_id ?? (attrs.custom_data as Record<string, string>)?.user_id;
      const variantId = String(attrs.variant_id ?? "");
      const plan = safePlan(custom_data?.plan, variantId);
      const status = attrs.status as string;
      const subId = String(attrs.id ?? "");
      const lsCustomerId = String(attrs.customer_id ?? "");

      if (!plan) {
        console.error(`${event_name}: unknown variant_id="${variantId}" — no plan upgrade applied`);
        break;
      }
      if (userId && (status === "active" || status === "trialing")) {
        db.prepare(
          "UPDATE users SET plan = ?, stripe_customer_id = ?, stripe_subscription_id = ?, updated_at = datetime('now') WHERE id = ?"
        ).run(plan, lsCustomerId, subId, userId);
        console.log(`${event_name}: user ${userId} → ${plan} (${status})`);
      }
      break;
    }

    // Subscription cancelled or expired → downgrade to free
    case "subscription_cancelled":
    case "subscription_expired": {
      const subId = String(attrs.id ?? "");
      const result = db.prepare(
        "UPDATE users SET plan = 'free', stripe_subscription_id = NULL, updated_at = datetime('now') WHERE stripe_subscription_id = ?"
      ).run(subId);
      console.log(`${event_name}: subscription ${subId} cancelled — ${result.changes} user(s) downgraded to free`);
      break;
    }

    default:
      // Log unhandled events but always return 200 to prevent LS retries
      console.log(`Unhandled webhook event: ${event_name}`);
  }

  return Response.json({ received: true });
}
