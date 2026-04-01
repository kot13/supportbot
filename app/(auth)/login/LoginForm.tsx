"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/src/ui/Button";
import { Input } from "@/src/ui/Input";
import { Alert } from "@/src/ui/Alert";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: fd,
      });
      const json = (await res.json()) as { ok: boolean; error?: { message: string } };
      if (!res.ok || !json.ok) {
        setError(json.error?.message ?? "Login failed");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm text-zinc-700">Login</label>
        <Input name="login" autoComplete="username" required />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-zinc-700">Password</label>
        <Input name="password" type="password" autoComplete="current-password" required />
      </div>

      {error ? <Alert title="Sign in failed" message={error} /> : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

