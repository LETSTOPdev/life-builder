/**
 * Buildr — Lemon Squeezy Setup Script
 * Run: LS_API_KEY="your_key" node setup-lemonsqueezy.mjs
 *
 * Fetches all products/variants from your store, auto-maps them to
 * Pro / Premium / Elite plans, writes .env.local, and prints Railway vars.
 *
 * Works with 3 variants OR 6 (monthly+annual). Annual falls back to monthly if missing.
 */

import { randomBytes } from "crypto";
import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const LS_API_KEY = process.env.LS_API_KEY;
const APP_URL    = process.env.APP_URL ?? "https://life-builder-production.up.railway.app";

if (!LS_API_KEY) {
  console.error('\nSet LS_API_KEY first:  LS_API_KEY="your_key" node setup-lemonsqueezy.mjs\n');
  process.exit(1);
}

const BASE = "https://api.lemonsqueezy.com/v1";
const H = {
  Authorization: `Bearer ${LS_API_KEY}`,
  Accept: "application/vnd.api+json",
  "Content-Type": "application/vnd.api+json",
};

async function api(path) {
  const res = await fetch(`${BASE}${path}`, { headers: H });
  const data = await res.json();
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}: ${data?.errors?.[0]?.detail ?? JSON.stringify(data)}`);
  return data;
}

async function apiPost(path, body) {
  const res = await fetch(`${BASE}${path}`, { method: "POST", headers: H, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}: ${data?.errors?.[0]?.detail ?? JSON.stringify(data)}`);
  return data;
}

// Flexible name → plan key matching (handles platinum/premium, case-insensitive)
function toPlanKey(name) {
  const n = name.toLowerCase();
  if (n.includes("elite"))                        return "elite";
  if (n.includes("premium") || n.includes("plat")) return "premium";
  if (n.includes("pro"))                           return "pro";
  return null;
}

function toBilling(name) {
  const n = name.toLowerCase();
  if (n.includes("annual") || n.includes("yearly") || n.includes("year")) return "annual";
  return "monthly";
}

async function main() {
  console.log("\n🍋  Buildr × Lemon Squeezy Setup\n");

  // 1. Store
  const storesData = await api("/stores");
  const store = storesData.data?.[0];
  if (!store) throw new Error("No store found.");
  const storeId = store.id;
  console.log(`Store: "${store.attributes.name}" (ID: ${storeId})\n`);

  // 2. All products
  const productsData = await api(`/products?filter[store_id]=${storeId}&page[size]=50`);
  const products = productsData.data ?? [];
  console.log(`Found ${products.length} product(s):`);
  products.forEach(p => console.log(`  • ${p.attributes.name} (ID: ${p.id})`));
  console.log();

  // 3. All variants
  const found = {}; // { "pro_monthly": id, "pro_annual": id, ... }

  for (const product of products) {
    const varData = await api(`/variants?filter[product_id]=${product.id}&page[size]=50`);
    for (const v of varData.data ?? []) {
      const planKey = toPlanKey(v.attributes.name) ?? toPlanKey(product.attributes.name);
      const billing  = toBilling(v.attributes.name);
      if (planKey) {
        const key = `${planKey}_${billing}`;
        found[key] = v.id;
        console.log(`  ✅ "${v.attributes.name}" → ${planKey}/${billing} (variant ID: ${v.id})`);
      } else {
        console.log(`  ⚠️  Skipping unrecognised variant: "${v.attributes.name}"`);
      }
    }
  }

  // 4. Fill in missing annual with monthly fallback
  for (const plan of ["pro", "premium", "elite"]) {
    if (!found[`${plan}_annual`] && found[`${plan}_monthly`]) {
      found[`${plan}_annual`] = found[`${plan}_monthly`];
      console.log(`  ↩  ${plan}_annual not found — using monthly variant as fallback`);
    }
  }

  // 5. Check we have the minimum 3
  const missing = ["pro","premium","elite"].filter(p => !found[`${p}_monthly`]);
  if (missing.length > 0) {
    console.log(`\n❌  Missing plans: ${missing.join(", ")}`);
    console.log("    Create products for these in app.lemonsqueezy.com/products and re-run.\n");
    process.exit(1);
  }

  // 6. Webhook
  console.log("\nCreating webhook…");
  const webhookSecret = randomBytes(32).toString("hex");
  const webhookUrl = `${APP_URL}/api/lemonsqueezy/webhook`;
  try {
    const wh = await apiPost("/webhooks", {
      data: {
        type: "webhooks",
        attributes: {
          url: webhookUrl,
          events: ["order_created","subscription_created","subscription_updated","subscription_cancelled","subscription_expired"],
          secret: webhookSecret,
        },
        relationships: { store: { data: { type: "stores", id: String(storeId) } } },
      },
    });
    console.log(`✅  Webhook → ${webhookUrl} (ID: ${wh.data.id})`);
  } catch (e) {
    console.log(`⚠️   Webhook: ${e.message}`);
  }

  // 7. Update .env.local
  const envPath = join(__dirname, ".env.local");
  let env = readFileSync(envPath, "utf8");

  const updates = {
    LS_API_KEY,
    LS_STORE_ID: storeId,
    LS_WEBHOOK_SECRET: webhookSecret,
    LS_VARIANT_PRO_MONTHLY:     found["pro_monthly"],
    LS_VARIANT_PRO_ANNUAL:      found["pro_annual"],
    LS_VARIANT_PREMIUM_MONTHLY: found["premium_monthly"],
    LS_VARIANT_PREMIUM_ANNUAL:  found["premium_annual"],
    LS_VARIANT_ELITE_MONTHLY:   found["elite_monthly"],
    LS_VARIANT_ELITE_ANNUAL:    found["elite_annual"],
  };

  for (const [k, v] of Object.entries(updates)) {
    const re = new RegExp(`^(${k}=).*$`, "m");
    env = re.test(env) ? env.replace(re, `$1${v}`) : env + `\n${k}=${v}`;
  }
  writeFileSync(envPath, env);
  console.log("\n✅  .env.local updated\n");

  // 8. Print Railway vars
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Paste these into Railway → Variables:\n");
  for (const [k, v] of Object.entries(updates)) console.log(`${k}=${v}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch(e => { console.error("\n❌ ", e.message); process.exit(1); });
