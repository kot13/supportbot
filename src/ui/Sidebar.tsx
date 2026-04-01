"use client";

import { Link } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "./Button";

const nav = [
  { href: "/bot", label: "Bot" },
  { href: "/chats", label: "Chats" },
  { href: "/broadcast", label: "Broadcast" },
  { href: "/broadcast/history", label: "History" },
] as const;

export function Sidebar({ variant = "sidebar" }: { variant?: "sidebar" | "mobileBar" }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Even if the request fails, proceed with client-side redirect to drop any cached UI state.
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside
      className={[
        "bg-zinc-950/30",
        variant === "sidebar"
          ? "flex h-full flex-col gap-4 border-r border-zinc-800 p-4"
          : "flex items-center justify-between gap-3 p-2",
      ].join(" ")}
    >
      <div className="space-y-1">
        <div className="text-sm font-semibold">supportbot</div>
        {variant === "sidebar" ? <div className="text-xs text-zinc-400">Admin panel</div> : null}
      </div>

      <nav className={variant === "sidebar" ? "flex flex-col gap-1" : "flex flex-wrap items-center gap-1"}>
        {nav.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-md px-3 py-2 text-sm no-underline",
                active ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-900",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={variant === "sidebar" ? "mt-auto" : ""}>
        <Button variant="secondary" className={variant === "sidebar" ? "w-full" : ""} onClick={logout}>
          Sign out
        </Button>
      </div>
    </aside>
  );
}

