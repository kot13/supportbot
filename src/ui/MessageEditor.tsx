"use client";

import { useMemo } from "react";

import { Card, CardContent, TextArea } from "@heroui/react";

export function MessageEditor({
  value,
  onChange,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
}) {
  const preview = useMemo(() => {
    // v1: render HTML preview as-is (admin-only tool). In prod, consider sanitization.
    return value;
  }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs opacity-70">Characters</div>
        <div className="text-xs opacity-70">
          {value.length}/{maxLength}
        </div>
      </div>
      <TextArea
        data-testid="message-textarea"
        className="min-h-[140px] w-full"
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type message (HTML supported)"
      />

      <Card className="rounded-md border border-zinc-200 bg-white">
        <CardContent>
          <div className="mb-2 text-xs opacity-70">Preview</div>
          <div
            data-testid="message-preview"
            className="prose max-w-none whitespace-pre-wrap text-sm"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

