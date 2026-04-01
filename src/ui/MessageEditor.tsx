"use client";

import { useMemo } from "react";

import { Card, CardContent, TextArea } from "@heroui/react";
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
      <TextArea
        className="min-h-[140px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type message (HTML supported)"
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="rounded-md border border-zinc-800 bg-zinc-950/40">
          <CardContent>
            <div className="mb-2 text-xs opacity-70">Preview</div>
            <div
              className="prose prose-invert max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </CardContent>
        </Card>

        <Card className="rounded-md border border-zinc-800 bg-zinc-950/40">
          <CardContent>
            <div className="mb-2 text-xs opacity-70">Tips</div>
            <div className="space-y-2 text-xs opacity-80">
              <div>
                Use Telegram HTML formatting, e.g.{" "}
                <span className="font-mono">&lt;b&gt;bold&lt;/b&gt;</span>
              </div>
              <div>
                Links:{" "}
                <span className="font-mono">&lt;a href="https://..."&gt;text&lt;/a&gt;</span>
              </div>
            </div>
            <div className="mt-3">
              <Input label="Optional title" placeholder="Not used in v1" disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

