"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function DynamicBoardPage() {
  const { slug } = useParams<{ slug: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const boardHref = `/${slug}`;

  useEffect(() => {
    function loadBoard() {
      const savedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);

      if (savedBoards) {
        const boards: Board[] = JSON.parse(savedBoards);
        const currentBoard = boards.find((item) => item.href === boardHref);

        setBoard(currentBoard ?? null);
      }

      setIsLoading(false);
    }

    loadBoard();

    window.addEventListener("boards-updated", loadBoard);

    return () => {
      window.removeEventListener("boards-updated", loadBoard);
    };
  }, [boardHref]);

  function handleSaveBoard(updatedBoard: UpdatedBoard) {
    const savedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);

    if (!savedBoards) return;

    const boards: Board[] = JSON.parse(savedBoards);

    const updatedBoards = boards.map((item) =>
      item.href === boardHref
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

    setBoard(
      updatedBoards.find((item) => item.href === boardHref) ?? null,
    );

    window.dispatchEvent(new Event("boards-updated"));
  }

  if (isLoading) {
    return null;
  }

  if (!board) {
    return (
      <section className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#f4f7fd] px-4 text-center dark:bg-[#20212c]">
        <h1 className="text-xl font-bold text-[#000112] dark:text-white">
          Board not found
        </h1>

        <p className="mt-3 text-sm font-medium text-[#828fa3]">
          This board may have been deleted or its link is invalid.
        </p>

        <Link
          href="/"
          className="mt-6 rounded-full bg-[#635fc7] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#a8a4ff]"
        >
          Go to Home Board
        </Link>
      </section>
    );
  }

  if (board.columns.length === 0) {
    return (
      <EmptyBoardState
        board={board}
        onAddColumn={() => {}}
        onSave={handleSaveBoard}
      />
    );
  }

  return (
    <section className="min-h-full overflow-x-auto bg-[#f4f7fd] dark:bg-[#20212c]">
      <div className="flex min-h-full min-w-max gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
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

            <div className="mt-6 min-h-[calc(100vh-180px)]" />
          </section>
        ))}
      </div>
    </section>
  );
}