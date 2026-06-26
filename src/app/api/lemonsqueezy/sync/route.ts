import { NextRequest } from "next/server";
import { getSession, requireSession, signToken, setSessionCookie, jsonResponse, errorResponse } from "@/lib/auth";
import { getDb } from "@/lib/db";

// Map variant IDs → plan names
function planFromVariantId(variantId: string | number): string | null {
  const id = String(variantId);
  const map: Record<string, string> = {
    [process.env.LS_VARIANT_PRO_MONTHLY     ?? "__1"]: "pro",
    [process.env.LS_VARIANT_PRO_ANNUAL      ?? "__2"]: "pro",
    [process.env.LS_VARIANT_PREMIUM_MONTHLY ?? "__3"]: "premium",
    [process.env.LS_VARIANT_PREMIUM_ANNUAL  ?? "__4"]: "premium",
    [process.env.LS_VARIANT_ELITE_MONTHLY   ?? "__5"]: "elite",
    [process.env.LS_VARIANT_ELITE_ANNUAL    ?? "__6"]: "elite",
  };
  return map[id] ?? null;
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  if (!process.env.LS_API_KEY) {
    return errorResponse("LS_API_KEY not configured", 503);
  }

  const db = getDb();
  const user = db
    .prepare("SELECT id, email, name, plan FROM users WHERE id = ?")
    .get(session!.sub) as { id: string; email: string; name: string; plan: string } | undefined;

  if (!user) return errorResponse("User not found", 404);

  // Fetch subscriptions for this user's email from LemonSqueezy
  const lsRes = await fetch(
    `https://api.lemonsqueezy.com/v1/subscriptions?filter[user_email]=${encodeURIComponent(user.email)}&filter[store_id]=${process.env.LS_STORE_ID}`,
    {
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: `Bearer ${process.env.LS_API_KEY}`,
      },
    }
  );

  if (!lsRes.ok) {
    const err = await lsRes.text();
    console.error("LS sync fetch failed:", err);
    return errorResponse("Failed to fetch subscription from LemonSqueezy", 502);
  }

  const lsData = await lsRes.json() as {
    data: Array<{
      id: string;
      attributes: {
        status: string;
        variant_id: number;
        customer_id: number;
        user_email: string;
        custom_data?: Record<string, string>;
      };
    }>;
  };

  const subs = lsData.data ?? [];

  // Find an active or trialing subscription
  const activeSub = subs.find(s =>
    ["active", "trialing", "past_due"].includes(s.attributes.status)
  );

  if (!activeSub) {
    return jsonResponse({
      synced: false,
      message: "No active subscription found for your email in LemonSqueezy.",
      subscriptions: subs.map(s => ({ id: s.id, status: s.attributes.status })),
    });
  }

  const plan = planFromVariantId(activeSub.attributes.variant_id);
  if (!plan) {
    return jsonResponse({
      synced: false,
      message: `Subscription found (status: ${activeSub.attributes.status}) but variant ID ${activeSub.attributes.variant_id} isn't mapped to a plan. Check your LS_VARIANT_* env vars in Railway.`,
    });
  }

  // Update DB
  db.prepare(
    "UPDATE users SET plan = ?, stripe_customer_id = ?, stripe_subscription_id = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(plan, String(activeSub.attributes.customer_id), activeSub.id, user.id);

  // Re-issue session cookie with new plan
  const tokenVersion = (db.prepare("SELECT token_version FROM users WHERE id = ?").get(user.id) as { token_version: number }).token_version;
  const newToken = await signToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    plan,
    ver: tokenVersion,
  });

  const res = jsonResponse({
    synced: true,
    plan,
    subscriptionId: activeSub.id,
    status: activeSub.attributes.status,
  });
  return setSessionCookie(res, newToken);
}
