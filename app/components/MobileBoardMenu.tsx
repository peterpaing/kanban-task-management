"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiPlus } from "react-icons/fi";

import boardIcon from "@/app/assets/icon-board.svg";
import darkThemeIcon from "@/app/assets/icon-dark-theme.svg";
import lightThemeIcon from "@/app/assets/icon-light-theme.svg";
import useModalAccessibility from "@/app/hooks/useModalAccessibility";
import type { Board } from "@/app/types/kanban";

type MobileBoardMenuProps = {
  boards: Board[];
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
  onCreateBoard: () => void;
  onToggleTheme: () => void;
};

export default function MobileBoardMenu({
  boards,
  isOpen,
  isDark,
  onClose,
  onCreateBoard,
  onToggleTheme,
}: MobileBoardMenuProps) {
  const pathname = usePathname();
  const modalRef = useModalAccessibility<HTMLElement>(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 pt-20 md:hidden"
      onClick={onClose}
    >
      <section
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Board navigation"
        onClick={(event) => event.stopPropagation()}
        className="mx-4 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-lg bg-white py-5 outline-none dark:bg-[#2b2c37]"
      >
        <p className="px-6 text-xs font-bold tracking-[0.15em] text-[#828fa3]">
          ALL BOARDS ({boards.length})
        </p>

        <ul className="mt-5 space-y-1 pr-4">
          {boards.map((board) => {
            const isSelected = pathname === board.href;

            return (
              <li key={board.href}>
                <Link
                  href={board.href}
                  onClick={onClose}
                  aria-current={isSelected ? "page" : undefined}
                  className={`flex h-12 w-full items-center gap-4 rounded-r-full px-6 text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#635fc7] ${
                    isSelected
                      ? "bg-[#635fc7] text-white"
                      : "text-[#828fa3] hover:bg-[#f4f7fd] hover:text-[#635fc7] dark:hover:bg-white"
                  }`}
                >
                  <Image src={boardIcon} width={24} height={24} alt="" />
                  {board.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => {
            onCreateBoard();
            onClose();
          }}
          className="mt-1 flex h-12 w-[calc(100%-16px)] items-center gap-4 rounded-r-full px-6 text-lg font-bold text-[#635fc7] transition-colors hover:bg-[#f4f7fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#635fc7] dark:hover:bg-white"
        >
          <FiPlus size={18} className="shrink-0" aria-hidden="true" />
          <span className="leading-none">Create New Board</span>
        </button>

        <div className="mx-4 mt-8 flex h-12 items-center justify-center gap-6 rounded-md bg-[#f4f7fd] dark:bg-[#20212c]">
          <Image src={lightThemeIcon} width={19} height={19} alt="" />

          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            onClick={onToggleTheme}
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
      </section>
    </div>
  );
}