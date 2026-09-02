"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useState,
  type Dispatch,
  type SetStateAction,
  type SyntheticEvent,
} from "react";
import { FiPlus } from "react-icons/fi";

import lightLogo from "@/app/assets/logo-light.svg";
import darkLogo from "@/app/assets/logo-dark.svg";
import lightThemeIcon from "@/app/assets/icon-light-theme.svg";
import darkThemeIcon from "@/app/assets/icon-dark-theme.svg";
import boardIcon from "@/app/assets/icon-board.svg";
import hideSidebar from "@/app/assets/icon-hide-sidebar.svg";
import showSidebar from "@/app/assets/icon-show-sidebar.svg";
import crossIcon from "@/app/assets/icon-cross.svg";

type Board = {
  name: string;
  href: string;
  columns: string[];
};

type SidebarProps = {
  boards: Board[];
  setBoards: Dispatch<SetStateAction<Board[]>>;
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
  isCreateBoardOpen: boolean;
  setIsCreateBoardOpen: Dispatch<SetStateAction<boolean>>;
  isSidebarHidden: boolean;
  setIsSidebarHidden: (isHidden: boolean) => void;
};

const DEFAULT_COLUMNS = ["Todo", "Doing"];

export default function Sidebar({
  boards,
  setBoards,
  isDark,
  setIsDark,
  isCreateBoardOpen,
  setIsCreateBoardOpen,
  isSidebarHidden,
  setIsSidebarHidden,
}: SidebarProps) {
  const pathname = usePathname();
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState<string[]>([...DEFAULT_COLUMNS]);

  function closeCreateBoardModal() {
    setIsCreateBoardOpen(false);
    setBoardName("");
    setColumns([...DEFAULT_COLUMNS]);
  }

  function handleCreateBoard(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = boardName.trim();

    if (!name) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    setBoards((currentBoards) => [
      ...currentBoards,
      {
        name,
        href: `/${slug}`,
        columns: columns.map((column) => column.trim()).filter(Boolean),
      },
    ]);

    closeCreateBoardModal();
  }

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
              const isSelected = pathname === board.href;

              return (
                <li key={board.href}>
                  <Link
                    href={board.href}
                    aria-current={isSelected ? "page" : undefined}
                    className={`flex h-12 w-full items-center gap-3 rounded-r-full px-8 text-sm font-bold transition-colors ${
                      isSelected
                        ? "bg-[#635fc7] text-white"
                        : "text-[#828fa3] hover:bg-[#f4f7fd] hover:text-[#635fc7] dark:hover:bg-white"
                    }`}
                  >
                    <Image src={boardIcon} width={16} height={16} alt="" />
                    {board.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => setIsCreateBoardOpen(true)}
            className="mt-1 flex h-12 w-[calc(100%-24px)] items-center gap-3 rounded-r-full px-8 text-sm font-bold text-[#635fc7]"
          >
            <FiPlus size={18} className="shrink-0" aria-hidden="true" />
            <span className="leading-none">Create New Board</span>
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
              className="flex h-5 w-10 items-center rounded-full bg-[#635fc7] p-0.5 transition-colors hover:bg-[#a8a4ff]"
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

      {isCreateBoardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleCreateBoard}
            className="w-full max-w-[480px] rounded-md bg-white p-6 dark:bg-[#2b2c37]"
          >
            <h2 className="text-lg font-bold text-[#000112] dark:text-white">
              Add New Board
            </h2>

            <label className="mt-6 block text-xs font-bold text-[#828fa3]">
              Name

              <input
                type="text"
                value={boardName}
                onChange={(event) => setBoardName(event.target.value)}
                placeholder="e.g. Web Design"
                className="mt-2 h-10 w-full rounded border border-[#828fa3]/25 px-4 text-sm text-[#000112] outline-none placeholder:text-[#828fa3]/55 focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white"
              />
            </label>

            <p className="mt-6 text-xs font-bold text-[#828fa3]">Columns</p>

            <div className="mt-2 space-y-3">
              {columns.map((column, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={column}
                    onChange={(event) =>
                      setColumns((currentColumns) =>
                        currentColumns.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      )
                    }
                    className="h-10 flex-1 rounded border border-[#828fa3]/25 px-4 text-sm text-[#000112] outline-none focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white"
                  />

                  <button
                    type="button"
                    aria-label={`Remove ${column || "column"}`}
                    onClick={() =>
                      setColumns((currentColumns) =>
                        currentColumns.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
                      )
                    }
                    className="flex h-10 w-6 items-center justify-center"
                  >
                    <Image src={crossIcon} width={12} height={12} alt="" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setColumns((currentColumns) => [...currentColumns, ""])
              }
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7]"
            >
              <FiPlus size={16} aria-hidden="true" />
              <span>Add New Column</span>
            </button>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeCreateBoardModal}
                className="h-10 flex-1 rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-10 flex-1 rounded-full bg-[#635fc7] text-xs font-bold text-white hover:bg-[#a8a4ff]"
              >
                Create New Board
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}