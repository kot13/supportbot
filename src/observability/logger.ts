type LogLevel = "debug" | "info" | "warn" | "error";

function redact(value: unknown): unknown {
  if (value && typeof value === "object") {
    // Avoid accidentally logging raw binary/file-like values (e.g. multipart uploads).
    if (value instanceof ArrayBuffer) return "[REDACTED_BINARY]";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maybeTypedArray = value as any;
    if (typeof maybeTypedArray?.byteLength === "number" && typeof maybeTypedArray?.buffer === "object") {
      return "[REDACTED_BINARY]";
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maybeFile = value as any;
    if (typeof maybeFile?.arrayBuffer === "function" && typeof maybeFile?.name === "string") {
      return "[REDACTED_FILE]";
    }

    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const key = k.toLowerCase();
      if (key.includes("token") || key.includes("password") || key.includes("secret")) {
        out[k] = "[REDACTED]";
      } else {
        out[k] = redact(v);
      }
    }
    return out;
  }
  return value;
}

export function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const line = {
    ts: new Date().toISOString(),
    level,
    message,
    meta: meta ? redact(meta) : undefined,
  };
  console.log(JSON.stringify(line));
}

export const logger = {
  debug: (m: string, meta?: Record<string, unknown>) => log("debug", m, meta),
  info: (m: string, meta?: Record<string, unknown>) => log("info", m, meta),
  warn: (m: string, meta?: Record<string, unknown>) => log("warn", m, meta),
  error: (m: string, meta?: Record<string, unknown>) => log("error", m, meta),
};

