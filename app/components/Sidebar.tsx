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

import boardIcon from "@/app/assets/icon-board.svg";
import crossIcon from "@/app/assets/icon-cross.svg";
import darkLogo from "@/app/assets/logo-dark.svg";
import darkThemeIcon from "@/app/assets/icon-dark-theme.svg";
import hideSidebar from "@/app/assets/icon-hide-sidebar.svg";
import lightLogo from "@/app/assets/logo-light.svg";
import lightThemeIcon from "@/app/assets/icon-light-theme.svg";
import showSidebar from "@/app/assets/icon-show-sidebar.svg";
import useModalAccessibility from "@/app/hooks/useModalAccessibility";

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
  const [boardNameError, setBoardNameError] = useState("");

  function closeCreateBoardModal() {
    setIsCreateBoardOpen(false);
    setBoardName("");
    setColumns([...DEFAULT_COLUMNS]);
    setBoardNameError("");
  }

  const modalRef = useModalAccessibility<HTMLFormElement>(
    isCreateBoardOpen,
    closeCreateBoardModal,
  );

  function createUniqueSlug(name: string) {
    const baseSlug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "board";

    const usedHrefs = new Set(boards.map((board) => board.href));

    let slug = baseSlug;
    let number = 2;

    while (usedHrefs.has(`/${slug}`)) {
      slug = `${baseSlug}-${number}`;
      number += 1;
    }

    return slug;
  }

  function handleCreateBoard(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = boardName.trim();

    if (!name) {
      setBoardNameError("Board name cannot be empty.");
      return;
    }

    const hasSameName = boards.some(
      (board) => board.name.trim().toLowerCase() === name.toLowerCase(),
    );

    if (hasSameName) {
      setBoardNameError("A board with this name already exists.");
      return;
    }

    const slug = createUniqueSlug(name);

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
                    className={`flex h-12 w-full items-center gap-3 rounded-r-full px-8 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#635fc7] ${
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
            className="mt-1 flex h-12 w-[calc(100%-24px)] items-center gap-3 rounded-r-full px-8 text-sm font-bold text-[#635fc7] transition-colors hover:bg-[#f4f7fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#635fc7] dark:hover:bg-white"
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
              className="flex h-5 w-10 items-center rounded-full bg-[#635fc7] p-0.5 transition-colors hover:bg-[#a8a4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#20212c]"
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
            className="mt-4 flex h-12 w-full items-center gap-3 rounded-md px-5 text-sm font-bold text-[#828fa3] transition-colors hover:bg-[#f4f7fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] dark:hover:bg-[#3e3f4e]"
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
          className="fixed bottom-8 left-0 z-30 hidden h-12 w-14 items-center justify-center rounded-r-full bg-[#635fc7] transition-colors hover:bg-[#a8a4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#20212c] md:flex"
        >
          <Image src={showSidebar} width={16} height={11} alt="" />
        </button>
      )}

      {isCreateBoardOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 md:p-6"
          onClick={closeCreateBoardModal}
        >
          <form
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-board-title"
            onSubmit={handleCreateBoard}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] overscroll-contain overflow-y-auto rounded-md bg-white p-5 outline-none dark:bg-[#2b2c37] sm:max-h-[90dvh] sm:p-6 md:p-8"
          >
            <h2
              id="create-board-title"
              className="text-lg font-bold text-[#000112] dark:text-white"
            >
              Add New Board
            </h2>

            <label className="mt-6 block text-xs font-bold text-[#828fa3]">
              Name

              <input
                type="text"
                value={boardName}
                onChange={(event) => {
                  setBoardName(event.target.value);
                  setBoardNameError("");
                }}
                placeholder="e.g. Web Design"
                aria-invalid={Boolean(boardNameError)}
                className={`mt-2 h-10 w-full rounded border bg-white px-4 text-sm text-[#000112] outline-none placeholder:text-[#828fa3]/55 focus:border-[#635fc7] focus-visible:ring-2 focus-visible:ring-[#635fc7]/40 dark:bg-[#2b2c37] dark:text-white ${
                  boardNameError
                    ? "border-[#ea5555]"
                    : "border-[#828fa3]/25"
                }`}
              />
            </label>

            {boardNameError && (
              <p className="mt-2 text-xs font-bold text-[#ea5555]">
                {boardNameError}
              </p>
            )}

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
                    className="h-10 min-w-0 flex-1 rounded border border-[#828fa3]/25 bg-white px-4 text-sm text-[#000112] outline-none focus:border-[#635fc7] focus-visible:ring-2 focus-visible:ring-[#635fc7]/40 dark:bg-[#2b2c37] dark:text-white"
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
                    className="flex h-10 w-6 shrink-0 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea5555]"
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
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7] transition-colors hover:bg-[#635fc7]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2b2c37]"
            >
              <FiPlus size={16} aria-hidden="true" />
              <span>Add New Column</span>
            </button>

            <div className="mt-6 flex flex-col-reverse items-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={closeCreateBoardModal}
                className="h-10 w-full max-w-[280px] rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7] transition-colors hover:bg-[#635fc7]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2b2c37] sm:max-w-none sm:flex-1"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="h-10 w-full max-w-[280px] rounded-full bg-[#635fc7] text-xs font-bold text-white transition-colors hover:bg-[#a8a4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2b2c37] sm:max-w-none sm:flex-1"
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