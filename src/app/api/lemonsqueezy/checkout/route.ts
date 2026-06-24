import { NextRequest } from "next/server";
import { getSession, requireSession, jsonResponse, errorResponse } from "@/lib/auth";
import { getDb } from "@/lib/db";

// Plan → Lemon Squeezy Variant ID mapping
// After creating products in your LS dashboard, paste the variant IDs into .env.local:
//   LS_VARIANT_PRO_MONTHLY, LS_VARIANT_PRO_ANNUAL,
//   LS_VARIANT_PREMIUM_MONTHLY, LS_VARIANT_PREMIUM_ANNUAL,
//   LS_VARIANT_ELITE_MONTHLY, LS_VARIANT_ELITE_ANNUAL
const VARIANT_MAP: Record<string, { monthly: string; annual: string }> = {
  pro:     { monthly: process.env.LS_VARIANT_PRO_MONTHLY     ?? "", annual: process.env.LS_VARIANT_PRO_ANNUAL     ?? "" },
  premium: { monthly: process.env.LS_VARIANT_PREMIUM_MONTHLY ?? "", annual: process.env.LS_VARIANT_PREMIUM_ANNUAL ?? "" },
  elite:   { monthly: process.env.LS_VARIANT_ELITE_MONTHLY   ?? "", annual: process.env.LS_VARIANT_ELITE_ANNUAL   ?? "" },
};

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;

  if (!process.env.LS_API_KEY) {
    return errorResponse(
      "Payment not configured. Add LS_API_KEY and LS_STORE_ID to .env.local",
      503
    );
  }

  const { plan, billing = "monthly" } = await req.json();
  const variants = VARIANT_MAP[plan];
  if (!variants) return errorResponse("Invalid plan");

  const variantId = billing === "annual" ? variants.annual : variants.monthly;
  if (!variantId) {
    return errorResponse(
      `Lemon Squeezy variant ID not configured for ${plan}/${billing}. ` +
        `Set LS_VARIANT_${plan.toUpperCase()}_${billing.toUpperCase()} in .env.local`,
      503
    );
  }

  const db = getDb();
  const user = db
    .prepare("SELECT id, email, name FROM users WHERE id = ?")
    .get(session!.sub) as Record<string, string>;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_options: {
          embed: false,
          media: false,
          button_color: "#171717",
        },
        checkout_data: {
          email: user.email,
          name: user.name,
          custom: {
            user_id: user.id,
            plan,
          },
        },
        product_options: {
          redirect_url: `${appUrl}/dashboard?upgraded=true&plan=${plan}`,
        },
      },
      relationships: {
        store: {
          data: { type: "stores", id: process.env.LS_STORE_ID },
        },
        variant: {
          data: { type: "variants", id: variantId },
        },
      },
    },
  };

  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${process.env.LS_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.errors?.[0]?.detail ?? "Failed to create checkout";
    return errorResponse(msg, 500);
  }

  const checkoutUrl = data?.data?.attributes?.url;
  if (!checkoutUrl) return errorResponse("No checkout URL returned", 500);

  return jsonResponse({ url: checkoutUrl });
}
