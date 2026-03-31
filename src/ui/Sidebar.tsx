"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "./Button";

const nav = [
  { href: "/bot", label: "Bot" },
  { href: "/chats", label: "Chats" },
  { href: "/broadcast", label: "Broadcast" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full flex-col gap-4 border-r border-zinc-800 bg-zinc-950/30 p-4">
      <div className="space-y-1">
        <div className="text-sm font-semibold">supportbot</div>
        <div className="text-xs text-zinc-400">Admin panel</div>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-md px-3 py-2 text-sm",
                active ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-900",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Button variant="secondary" className="w-full" onClick={logout}>
          Sign out
        </Button>
      </div>
    </aside>
  );
}

