"use client";

import { useState, type ReactNode } from "react";

import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isSidebarHidden={isSidebarHidden}
        setIsSidebarHidden={setIsSidebarHidden}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header showDesktopLogo={isSidebarHidden} />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}