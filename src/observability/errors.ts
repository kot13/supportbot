import { ZodError } from "zod";

export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(message: string, opts: { code: string; status: number }) {
    super(message);
    this.code = opts.code;
    this.status = opts.status;
  }
}

export function toPublicError(err: unknown): { message: string; code: string } {
  if (err instanceof AppError) return { message: err.message, code: err.code };
  if (err instanceof ZodError) {
    const first = err.issues[0];
    const path = first?.path.length ? `${String(first.path.join("."))}: ` : "";
    return {
      message: `${path}${first?.message ?? "Validation failed"}`,
      code: "VALIDATION",
    };
  }
  return { message: "Unexpected error", code: "UNEXPECTED" };
}

