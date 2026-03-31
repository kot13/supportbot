"use client";

import { useMemo } from "react";

import { Input } from "./Input";

export function MessageEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const preview = useMemo(() => {
    // v1: render HTML preview as-is (admin-only tool). In prod, consider sanitization.
    return value;
  }, [value]);

  return (
    <div className="space-y-2">
      <textarea
        className="min-h-[140px] w-full rounded-md bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 ring-1 ring-zinc-800 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type message (HTML supported)"
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
          <div className="mb-2 text-xs text-zinc-400">Preview</div>
          <div className="prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: preview }} />
        </div>

        <div className="rounded-md border border-zinc-800 bg-zinc-950/40 p-3">
          <div className="mb-2 text-xs text-zinc-400">Tips</div>
          <div className="space-y-2 text-xs text-zinc-300">
            <div>Use Telegram HTML formatting, e.g. <span className="font-mono">&lt;b&gt;bold&lt;/b&gt;</span></div>
            <div>Links: <span className="font-mono">&lt;a href="https://..."&gt;text&lt;/a&gt;</span></div>
          </div>
          <div className="mt-3">
            <label className="text-xs text-zinc-400">Optional title</label>
            <Input className="mt-1" placeholder="Not used in v1" disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

