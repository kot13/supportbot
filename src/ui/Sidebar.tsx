"use client";

import { Link } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "./Button";

const nav = [
  { href: "/chats", label: "Chats" },
  { href: "/broadcast", label: "Broadcast" },
  { href: "/broadcast/history", label: "History" },
  { href: "/bot", label: "Bots" },
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
        "bg-white",
        variant === "sidebar"
          ? "flex h-full flex-col gap-4 border-r border-zinc-200 p-4"
          : "flex items-center justify-between gap-3 p-2",
      ].join(" ")}
    >
      <div className="space-y-1">
        <div className="text-sm font-semibold">supportbot</div>
        {variant === "sidebar" ? <div className="text-xs text-zinc-500">Admin panel</div> : null}
      </div>

      <nav className={variant === "sidebar" ? "flex flex-col gap-1" : "flex flex-wrap items-center gap-1"}>
        {nav.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-md px-3 py-2 text-sm no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                active ? "bg-zinc-100 text-zinc-900" : "text-zinc-700 hover:bg-zinc-50",
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

