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
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col md:flex-row">
        <div className="md:min-h-screen md:shrink-0">
          <div className="hidden md:block md:min-h-screen">
            <Sidebar
              variant="sidebar"
              collapsed={collapsed}
              onToggleCollapsed={toggleCollapsed}
            />
          </div>
          <div className="border-b border-zinc-200 p-3 md:hidden">
            <Sidebar variant="mobileBar" />
          </div>
        </div>
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
