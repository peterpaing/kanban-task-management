"use client";

import { useEffect, useState, type ReactNode } from "react";

import EditBoardModal from "@/app/components/EditBoardModal";
import Header from "@/app/components/Header";
import MobileBoardMenu from "@/app/components/MobileBoardMenu";
import Sidebar from "@/app/components/Sidebar";

type Board = {
  name: string;
  href: string;
  columns: string[];
};

const initialBoards: Board[] = [
  {
    name: "Platform Launch",
    href: "/",
    columns: ["Todo", "Doing", "Done"],
  },
  {
    name: "Marketing Plan",
    href: "/marketing-plan",
    columns: [],
  },
  {
    name: "Roadmap",
    href: "/roadmap",
    columns: [],
  },
];

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [isBoardsReady, setIsBoardsReady] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);

  useEffect(() => {
    const savedBoards = window.localStorage.getItem("boards");

    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }

    setIsBoardsReady(true);
  }, []);

  useEffect(() => {
    if (!isBoardsReady) return;

    window.localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards, isBoardsReady]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");

    setIsDark(savedTheme === "dark");
    setIsThemeReady(true);
  }, []);

  useEffect(() => {
    if (!isThemeReady) return;

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, isThemeReady]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        boards={boards}
        setBoards={setBoards}
        isDark={isDark}
        setIsDark={setIsDark}
        isCreateBoardOpen={isCreateBoardOpen}
        setIsCreateBoardOpen={setIsCreateBoardOpen}
        isSidebarHidden={isSidebarHidden}
        setIsSidebarHidden={setIsSidebarHidden}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          showDesktopLogo={isSidebarHidden}
          isMobileMenuOpen={isMobileMenuOpen}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onEditBoard={() => setIsEditBoardOpen(true)}
          onDeleteBoard={() => console.log("Delete board later")}
        />

        <main className="flex-1">{children}</main>
      </div>

      <MobileBoardMenu
        boards={boards}
        isOpen={isMobileMenuOpen}
        isDark={isDark}
        onClose={() => setIsMobileMenuOpen(false)}
        onCreateBoard={() => setIsCreateBoardOpen(true)}
        onToggleTheme={() => setIsDark((currentTheme) => !currentTheme)}
      />

      <EditBoardModal
        isOpen={isEditBoardOpen}
        onClose={() => setIsEditBoardOpen(false)}
      />
    </div>
  );
}