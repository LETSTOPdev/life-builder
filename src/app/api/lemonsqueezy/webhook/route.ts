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

// Map Lemon Squeezy variant ID → plan name using env vars
function planFromVariantId(variantId: string): string {
  const map: Record<string, string> = {
    [process.env.LS_VARIANT_PRO_MONTHLY     ?? "__"]: "pro",
    [process.env.LS_VARIANT_PRO_ANNUAL      ?? "__"]: "pro",
    [process.env.LS_VARIANT_PREMIUM_MONTHLY ?? "__"]: "premium",
    [process.env.LS_VARIANT_PREMIUM_ANNUAL  ?? "__"]: "premium",
    [process.env.LS_VARIANT_ELITE_MONTHLY   ?? "__"]: "elite",
    [process.env.LS_VARIANT_ELITE_ANNUAL    ?? "__"]: "elite",
  };
  return map[variantId] ?? "pro";
}

export async function POST(req: NextRequest) {
  const secret = process.env.LS_WEBHOOK_SECRET;
  if (!secret) {
    console.error("LS_WEBHOOK_SECRET not set");
    return Response.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const sigHeader = req.headers.get("x-signature") ?? "";

  if (!verifySignature(rawBody, sigHeader, secret)) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
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
      const plan = custom_data?.plan ?? planFromVariantId(variantId);
      const lsCustomerId = String(attrs.customer_id ?? "");
      const lsOrderId = String(attrs.identifier ?? "");

      if (userId && attrs.status === "paid") {
        db.prepare(
          "UPDATE users SET plan = ?, stripe_customer_id = ?, stripe_subscription_id = ?, updated_at = datetime('now') WHERE id = ?"
        ).run(plan, lsCustomerId, lsOrderId, userId);
      }
      break;
    }

    // Subscription started or renewed
    case "subscription_created":
    case "subscription_updated": {
      const userId = custom_data?.user_id ?? (attrs.custom_data as Record<string, string>)?.user_id;
      const variantId = String(attrs.variant_id ?? "");
      const plan = custom_data?.plan ?? planFromVariantId(variantId);
      const status = attrs.status as string;
      const subId = String(attrs.id ?? "");
      const lsCustomerId = String(attrs.customer_id ?? "");

      if (userId && (status === "active" || status === "trialing")) {
        db.prepare(
          "UPDATE users SET plan = ?, stripe_customer_id = ?, stripe_subscription_id = ?, updated_at = datetime('now') WHERE id = ?"
        ).run(plan, lsCustomerId, subId, userId);
      }
      break;
    }

    // Subscription cancelled or expired → downgrade to free
    case "subscription_cancelled":
    case "subscription_expired": {
      const subId = String(attrs.id ?? "");
      db.prepare(
        "UPDATE users SET plan = 'free', stripe_subscription_id = NULL, updated_at = datetime('now') WHERE stripe_subscription_id = ?"
      ).run(subId);
      break;
    }
  }

  return Response.json({ received: true });
}
