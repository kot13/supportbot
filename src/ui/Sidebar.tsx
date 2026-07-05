"use client";

import { Link } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "./Button";
import {
  BroadcastIcon,
  ChatsIcon,
  HistoryIcon,
  LogoutIcon,
  SettingsIcon,
  UnansweredIcon,
} from "./sidebarIcons";

const nav = [
  { href: "/chats", label: "Chats", icon: ChatsIcon },
  { href: "/unanswered", label: "Unanswered", icon: UnansweredIcon },
  { href: "/broadcast", label: "Broadcast", icon: BroadcastIcon },
  { href: "/broadcast/history", label: "History", icon: HistoryIcon },
  { href: "/bot", label: "Settings", icon: SettingsIcon },
] as const;

type SidebarProps = {
  variant?: "sidebar" | "mobileBar";
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {direction === "left" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      )}
    </svg>
  );
}

function NavLinks({
  pathname,
  collapsed,
}: {
  pathname: string | null;
  collapsed: boolean;
}) {
  return (
    <>
      {nav.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(item.href + "/");
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            aria-label={collapsed ? item.label : undefined}
            className={[
              "rounded-md text-sm no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
              collapsed
                ? "flex h-9 w-9 items-center justify-center"
                : "flex items-center gap-2 px-3 py-2",
              active ? "bg-zinc-100 text-zinc-900" : "text-zinc-700 hover:bg-zinc-50",
            ].join(" ")}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed ? <span>{item.label}</span> : null}
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar({
  variant = "sidebar",
  collapsed = false,
  onToggleCollapsed,
}: SidebarProps) {
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

  if (variant === "mobileBar") {
    return (
      <aside className="flex items-center justify-between gap-3 bg-white p-2">
        <div className="space-y-1">
          <div className="text-sm font-semibold">supportbot</div>
        </div>

        <nav className="flex flex-wrap items-center gap-1">
          <NavLinks pathname={pathname} collapsed={false} />
        </nav>

        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
      </aside>
    );
  }

  return (
    <aside
      className={[
        "flex min-h-screen flex-col border-r border-zinc-200 bg-white transition-[width,padding] duration-200 ease-in-out",
        collapsed ? "w-16 gap-3 p-2" : "w-[260px] gap-4 p-4",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center",
          collapsed ? "justify-center" : "justify-between gap-2",
        ].join(" ")}
      >
        {!collapsed ? (
          <div className="min-w-0 space-y-1">
            <div className="truncate text-sm font-semibold">supportbot</div>
            <div className="text-xs text-zinc-500">Admin panel</div>
          </div>
        ) : null}

        {onToggleCollapsed ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <ChevronIcon direction={collapsed ? "right" : "left"} />
          </button>
        ) : null}
      </div>

      <nav className={collapsed ? "flex flex-col items-center gap-1" : "flex flex-col gap-1"}>
        <NavLinks pathname={pathname} collapsed={collapsed} />
      </nav>

      <div className="mt-auto">
        <Button
          variant="secondary"
          className={
            collapsed
              ? "flex w-full items-center justify-center px-0"
              : "flex w-full items-center justify-center gap-2"
          }
          onClick={logout}
          title={collapsed ? "Sign out" : undefined}
          aria-label={collapsed ? "Sign out" : undefined}
        >
          <LogoutIcon className="h-4 w-4 shrink-0" />
          {!collapsed ? <span>Sign out</span> : null}
        </Button>
      </div>
    </aside>
  );
}
