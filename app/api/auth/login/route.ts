import { NextResponse } from "next/server";

import { createSession } from "@/src/auth/session";
import { checkAndIncrement } from "@/src/auth/bruteforce";
import { verifyCredentials } from "@/src/auth/verifyCredentials";
import { toPublicError } from "@/src/observability/errors";
import { logger } from "@/src/observability/logger";

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const form = await request.formData();
    const login = String(form.get("login") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const throttle = checkAndIncrement(`${ip}:${login || "-"}`, {
      windowMs: 60_000,
      maxAttempts: 10,
    });
    if (!throttle.allowed) {
      return NextResponse.json(
        { ok: false, error: { message: "Too many attempts. Try again later.", code: "THROTTLED" } },
        { status: 429 },
      );
    }

    if (!login || !password) {
      return NextResponse.json({ ok: false, error: { message: "Login and password are required", code: "VALIDATION" } }, { status: 400 });
    }

    const { adminUserId } = await verifyCredentials(login, password);
    await createSession(adminUserId);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const pub = toPublicError(err);
    logger.warn("login_failed", { code: pub.code });
    const status = (err as { status?: number }).status ?? 400;
    return NextResponse.json({ ok: false, error: pub }, { status });
  }
}

