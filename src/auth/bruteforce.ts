type Key = string;

type Entry = {
  count: number;
  resetAt: number;
};

// In-memory throttle (best-effort). For multi-instance deployments, replace with shared storage.
const store = new Map<Key, Entry>();

export function checkAndIncrement(key: string, opts?: { windowMs?: number; maxAttempts?: number }) {
  const windowMs = opts?.windowMs ?? 60_000;
  const maxAttempts = opts?.maxAttempts ?? 10;

  const now = Date.now();
  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    const entry: Entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { allowed: true, remaining: maxAttempts - 1, resetAt: entry.resetAt };
  }

  existing.count += 1;
  if (existing.count > maxAttempts) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  return { allowed: true, remaining: Math.max(0, maxAttempts - existing.count), resetAt: existing.resetAt };
}

