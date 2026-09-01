"use client";

import { useEffect, useState } from "react";

import EmptyBoardState from "@/app/components/EmptyBoardState";

type Board = {
  name: string;
  href: string;
  columns: string[];
};

type UpdatedBoard = {
  name: string;
  columns: string[];
};

const BOARDS_STORAGE_KEY = "kanban-boards-v2";

const columnColors = ["#49C4E5", "#8471F2", "#67E2AE", "#E4EBFA"];

export default function HomePage() {
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function loadBoard() {
      const savedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);

      if (savedBoards) {
        const boards: Board[] = JSON.parse(savedBoards);
        const platformLaunchBoard = boards.find((item) => item.href === "/");

        setBoard(platformLaunchBoard ?? null);
      }

      setIsLoading(false);
    }

    loadBoard();

    window.addEventListener("boards-updated", loadBoard);

    return () => {
      window.removeEventListener("boards-updated", loadBoard);
    };
  }, []);

  function handleSaveBoard(updatedBoard: UpdatedBoard) {
    const savedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);

    if (!savedBoards) return;

    const boards: Board[] = JSON.parse(savedBoards);

    const updatedBoards = boards.map((item) =>
      item.href === "/"
        ? {
            ...item,
            name: updatedBoard.name,
            columns: updatedBoard.columns,
          }
        : item,
    );

    window.localStorage.setItem(
      BOARDS_STORAGE_KEY,
      JSON.stringify(updatedBoards),
    );

    setBoard(updatedBoards.find((item) => item.href === "/") ?? null);
    window.dispatchEvent(new Event("boards-updated"));
  }

  if (isLoading) {
    return null;
  }

  if (!board || board.columns.length === 0) {
    return (
      <EmptyBoardState
      board={board}
      onAddColumn={() => {}}
      onSave={handleSaveBoard}
    />
    );
  }

  return (
    <section className="min-h-full overflow-x-auto bg-[#f4f7fd] p-4 dark:bg-[#20212c] md:p-6">
      <div className="flex min-h-[calc(100vh-80px)] min-w-max gap-6">
        {board.columns.map((column, index) => (
          <section key={column} className="w-[280px] shrink-0">
            <h2 className="flex items-center gap-3 text-xs font-bold tracking-[0.15em] text-[#828fa3]">
              <span
                className="h-4 w-4 rounded-full"
                style={{
                  backgroundColor:
                    columnColors[index % columnColors.length],
                }}
              />
              {column.toUpperCase()} (0)
            </h2>

            <div className="mt-6 min-h-24 rounded-md" />
          </section>
        ))}
      </div>
    </section>
  );
}