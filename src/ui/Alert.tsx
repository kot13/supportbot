"use client";

import { Card, CardContent } from "@heroui/react";

export function Alert({ title, message }: { title: string; message?: string }) {
  return (
    <Card className="rounded-md border border-zinc-800 bg-zinc-950/40">
      <CardContent className="space-y-1">
        <div className="text-sm font-medium">{title}</div>
        {message ? <div className="text-sm opacity-80">{message}</div> : null}
      </CardContent>
    </Card>
  );
}

