export async function POST() {
  const res = Response.json({ message: "Logged out" });
  res.headers.set("Set-Cookie", "buildr_session=; Path=/; HttpOnly; Max-Age=0");
  return res;
}
