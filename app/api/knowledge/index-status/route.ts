import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { getKnowledgeIndexStatus } from "@/src/rag/knowledgeIndexStatus";

export async function GET() {
  await requireAuth();
  const status = await getKnowledgeIndexStatus();

  return NextResponse.json({ ok: true, data: status }, { status: 200 });
}
