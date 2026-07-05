"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "./Sidebar";

const STORAGE_KEY = "sidebar-collapsed";

export function PanelShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function toggleCollapsed() {
    setCollapsed((value) => {
      const next = !value;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="h-screen overflow-hidden bg-white text-zinc-900">
      <div className="mx-auto flex h-full max-w-6xl flex-col md:flex-row">
        <div className="shrink-0 md:h-full">
          <div className="hidden md:block md:h-full">
            <Sidebar
              variant="sidebar"
              collapsed={collapsed}
              onToggleCollapsed={toggleCollapsed}
            />
          </div>
          <div className="border-b border-zinc-200 md:hidden">
            <Sidebar variant="mobileBar" />
          </div>
        </div>
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
