import { NextResponse } from "next/server";

import { requireAuth } from "@/src/auth/requireAuth";
import { getBroadcastComposePayload } from "@/src/db/broadcasts";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  await requireAuth();
  const { id: raw } = await ctx.params;
  const id = Number(raw);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json(
      { ok: false, error: { message: "Invalid id", code: "VALIDATION" } },
      { status: 400 },
    );
  }

  const url = new URL(request.url);
  const failedOnly = url.searchParams.get("failedOnly") === "1";

  try {
    const data = await getBroadcastComposePayload(id, { failedOnly });
    if (!data) {
      return NextResponse.json(
        { ok: false, error: { message: "Not found", code: "NOT_FOUND" } },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (err) {
    if (err instanceof Error && err.message === "NO_FAILURES") {
      return NextResponse.json(
        { ok: false, error: { message: "No failed deliveries to retry", code: "NO_FAILURES" } },
        { status: 400 },
      );
    }
    throw err;
  }
}
