"use client";

import { Link } from "@heroui/react";
import { useEffect, useState } from "react";
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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

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

        const link = (
          <Link
            href={item.href}
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

        return collapsed ? (
          <span key={item.href} title={item.label} className="inline-flex">
            {link}
          </span>
        ) : (
          <span key={item.href}>{link}</span>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
      <header className="bg-white">
        <div className="flex items-center justify-between gap-3 p-3">
          <div className="text-sm font-semibold">supportbot</div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <MenuIcon open={mobileMenuOpen} />
          </button>
        </div>

        {mobileMenuOpen ? (
          <nav className="flex flex-col gap-1 border-t border-zinc-200 p-3">
            <NavLinks pathname={pathname} collapsed={false} />
            <Button variant="secondary" className="mt-2 w-full" onClick={logout}>
              Sign out
            </Button>
          </nav>
        ) : null}
      </header>
    );
  }

  return (
    <aside
      className={[
        "flex h-full flex-col border-r border-zinc-200 bg-white transition-[width,padding] duration-200 ease-in-out",
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
          aria-label={collapsed ? "Sign out" : undefined}
        >
          <LogoutIcon className="h-4 w-4 shrink-0" />
          {!collapsed ? <span>Sign out</span> : null}
        </Button>
      </div>
    </aside>
  );
}
