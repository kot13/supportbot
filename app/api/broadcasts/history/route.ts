import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { listBroadcasts } from "@/src/db/broadcasts";

export async function GET() {
  await requireAuth();
  const rows = await listBroadcasts();
  return NextResponse.json({ ok: true, data: rows }, { status: 200 });
}

