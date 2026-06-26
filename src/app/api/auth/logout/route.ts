import { NextRequest } from "next/server";
import { getSession, revokeUserSessions } from "@/lib/auth";

const SECURE = process.env.NODE_ENV === "production" ? "; Secure" : "";

export async function POST(req: NextRequest) {
  // Increment token_version so the old JWT is rejected by verifyToken from this point on.
  const session = await getSession(req);
  if (session) {
    revokeUserSessions(session.sub);
  }

  const res = Response.json({ message: "Logged out" });
  res.headers.set("Set-Cookie", `buildr_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${SECURE}`);
  return res;
}
