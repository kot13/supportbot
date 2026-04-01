"use client";

import { Spinner } from "@heroui/react";

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-950/40 p-3 text-sm opacity-80">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}

