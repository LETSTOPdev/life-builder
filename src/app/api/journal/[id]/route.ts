import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getSession, requireSession, jsonResponse, errorResponse } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession(req);
  const guard = requireSession(session);
  if (guard) return guard;
  const { id } = await params;
  const db = getDb();
  const result = db.prepare("DELETE FROM journal_entries WHERE id = ? AND user_id = ?").run(id, session!.sub);
  if (result.changes === 0) return errorResponse("Entry not found", 404);
  return jsonResponse({ message: "Entry deleted" });
}
