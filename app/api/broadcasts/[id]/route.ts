import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { getBroadcastDetails } from "@/src/db/broadcasts";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireAuth();
  const { id } = await ctx.params;
  const broadcastId = Number(id);
  if (!Number.isFinite(broadcastId)) {
    return NextResponse.json(
      { ok: false, error: { message: "Invalid id", code: "VALIDATION" } },
      { status: 400 },
    );
  }

  const data = await getBroadcastDetails(broadcastId);
  if (!data.broadcast) {
    return NextResponse.json(
      { ok: false, error: { message: "Not found", code: "NOT_FOUND" } },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, data }, { status: 200 });
}

