"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import BoardMenu from "@/app/components/BoardMenu";
import mobileLogo from "@/app/assets/logo-mobile.svg";
import lightLogo from "@/app/assets/logo-light.svg";
import darkLogo from "@/app/assets/logo-dark.svg";
import dropDown from "@/app/assets/icon-chevron-down.svg";
import dropUp from "@/app/assets/icon-chevron-up.svg";
import addTaskIcon from "@/app/assets/icon-add-task-mobile.svg";
import ellipsis from "@/app/assets/icon-vertical-ellipsis.svg";

type HeaderProps = {
  boardName: string;
  showDesktopLogo: boolean;
  isMobileMenuOpen: boolean;
  onOpenMobileMenu: () => void;
  onEditBoard: () => void;
  onDeleteBoard: () => void;
};

export default function Header({
  boardName,
  showDesktopLogo,
  isMobileMenuOpen,
  onOpenMobileMenu,
  onEditBoard,
  onDeleteBoard,
}: HeaderProps) {
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const boardMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const clickedElement = event.target as Node;

      if (
        boardMenuRef.current &&
        !boardMenuRef.current.contains(clickedElement)
      ) {
        setIsBoardMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleEditBoard() {
    setIsBoardMenuOpen(false);
    onEditBoard();
  }

  function handleDeleteBoard() {
    setIsBoardMenuOpen(false);
    onDeleteBoard();
  }

  return (
    <header className="flex w-full items-center justify-between bg-white p-4 text-[#000112] dark:bg-[#2b2c37] dark:text-white">
      <div className="flex items-center gap-3">
        {showDesktopLogo && (
          <div className="hidden shrink-0 md:flex">
            <Image
              src={darkLogo}
              width={118}
              height={20}
              alt="Kanban"
              className="mr-6 dark:hidden"
            />

            <Image
              src={lightLogo}
              width={118}
              height={20}
              alt="Kanban"
              className="mr-6 hidden dark:block"
            />
          </div>
        )}

        <Image
          src={mobileLogo}
          width={24}
          height={25}
          alt=""
          className="md:hidden"
        />

        <h1 className="text-lg font-bold lg:text-xl">{boardName}</h1>

        <button
          type="button"
          aria-label="Open board selector"
          onClick={onOpenMobileMenu}
          className="md:hidden"
        >
          <Image
            src={isMobileMenuOpen ? dropUp : dropDown}
            width={10}
            height={5}
            alt=""
          />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Add new task"
          className="flex h-8 w-12 items-center justify-center gap-2 rounded-full bg-[#a8a4ff] text-white transition-colors duration-300 ease-in-out hover:bg-[#635fc7] dark:bg-[#635fc7] dark:hover:bg-[#a8a4ff] md:w-auto md:px-4"
        >
          <Image src={addTaskIcon} width={12} height={12} alt="" />

          <span className="hidden text-xs font-bold md:inline">
            Add New Task
          </span>
        </button>

        <div ref={boardMenuRef} className="relative">
          <button
            type="button"
            aria-label="Open board menu"
            aria-haspopup="menu"
            aria-expanded={isBoardMenuOpen}
            aria-controls="board-menu"
            onClick={() => setIsBoardMenuOpen((isOpen) => !isOpen)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 ease-out hover:scale-110 hover:bg-[#635fc7]/10 active:scale-95 ${
              isBoardMenuOpen ? "scale-110 bg-[#635fc7]/10" : ""
            }`}
          >
            <Image src={ellipsis} width={5} height={16} alt="" />
          </button>

          <BoardMenu
            isOpen={isBoardMenuOpen}
            onEditBoard={handleEditBoard}
            onDeleteBoard={handleDeleteBoard}
          />
        </div>
      </div>
    </header>
  );
}