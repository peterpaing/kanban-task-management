"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import lightLogo from "@/app/assets/logo-light.svg";
import darkLogo from "@/app/assets/logo-dark.svg";
import lightThemeIcon from "@/app/assets/icon-light-theme.svg";
import darkThemeIcon from "@/app/assets/icon-dark-theme.svg";
import boardIcon from "@/app/assets/icon-board.svg";
import hideSidebar from "@/app/assets/icon-hide-sidebar.svg";
import showSidebar from "@/app/assets/icon-show-sidebar.svg";

const boards = ["Platform Launch", "Marketing Plan", "Roadmap"];

type SidebarProps = {
  isSidebarHidden: boolean;
  setIsSidebarHidden: (isHidden: boolean) => void;
};

export default function Sidebar({
  isSidebarHidden,
  setIsSidebarHidden,
}: SidebarProps) {
  const [selectedBoard, setSelectedBoard] = useState("Platform Launch");
  const [isDark, setIsDark] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const shouldUseDarkTheme = savedTheme === "dark";
    setIsDark(shouldUseDarkTheme);
    setIsThemeReady(true);
  }, []);

  useEffect(() => {
    if (!isThemeReady) return;

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, isThemeReady]);

  return (
    <>
      <aside
        className={`min-h-screen w-[264px] shrink-0 flex-col border-r border-[#e4ebfa] bg-white pt-8 dark:border-[#3e3f4e] dark:bg-[#2b2c37] ${
          isSidebarHidden ? "hidden" : "hidden md:flex"
        }`}
      >
        <div className="px-8">
          <Image
            src={isDark ? lightLogo : darkLogo}
            width={118}
            height={20}
            alt="Kanban"
            priority
          />
        </div>

        <nav className="mt-14" aria-label="Boards">
          <p className="px-8 text-xs font-bold tracking-[0.15em] text-[#828fa3]">
            ALL BOARDS ({boards.length})
          </p>

          <ul className="mt-5 space-y-1 pr-6">
            {boards.map((board) => {
              const isSelected = board === selectedBoard;

              return (
                <li key={board}>
                  <button
                    type="button"
                    onClick={() => setSelectedBoard(board)}
                    aria-current={isSelected ? "page" : undefined}
                    className={`flex h-12 w-full items-center gap-3 rounded-r-full px-8 text-sm font-bold transition-colors ${
                      isSelected
                        ? "bg-[#635fc7] text-white"
                        : "text-[#828fa3] hover:bg-[#f4f7fd] hover:text-[#635fc7] dark:hover:bg-white"
                    }`}
                  >
                    <Image src={boardIcon} width={16} height={16} alt="" />
                    {board}
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className="mt-1 flex h-12 w-[calc(100%-24px)] items-center gap-3 rounded-r-full px-8 text-sm font-bold text-[#635fc7] transition-colors hover:bg-[#f4f7fd] dark:hover:bg-white"
          >
            <span className="text-xl leading-none" aria-hidden="true">
              +
            </span>
            Create New Board
          </button>
        </nav>

        <div className="mt-auto px-3 pb-8">
          <div className="flex h-12 items-center justify-center gap-6 rounded-md bg-[#f4f7fd] dark:bg-[#20212c]">
            <Image src={lightThemeIcon} width={19} height={19} alt="" />

            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              onClick={() => setIsDark((currentTheme) => !currentTheme)}
              className="flex h-5 w-10 items-center rounded-full bg-[#635fc7] p-0.5 transition-colors hover:bg-[#a8a4ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#635fc7]"
            >
              <span
                className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  isDark ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>

            <Image src={darkThemeIcon} width={16} height={16} alt="" />
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarHidden(true)}
            className="mt-4 flex h-12 w-full items-center gap-3 rounded-md px-5 text-sm font-bold text-[#828fa3] transition-colors hover:bg-[#f4f7fd] dark:hover:bg-[#3e3f4e]"
          >
            <Image src={hideSidebar} width={18} height={16} alt="" />
            Hide Sidebar
          </button>
        </div>
      </aside>

      {isSidebarHidden && (
        <button
          type="button"
          onClick={() => setIsSidebarHidden(false)}
          aria-label="Show sidebar"
          className="fixed bottom-8 left-0 z-30 hidden h-12 w-14 items-center justify-center rounded-r-full bg-[#635fc7] transition-colors hover:bg-[#a8a4ff] md:flex"
        >
          <Image src={showSidebar} width={16} height={11} alt="" />
        </button>
      )}
    </>
  );
}