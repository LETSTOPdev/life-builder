import { NextRequest } from "next/server";
import { getSession, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return jsonResponse({ user: null }, 200);
  return jsonResponse({
    user: { id: session.sub, email: session.email, name: session.name, plan: session.plan },
  });
}
