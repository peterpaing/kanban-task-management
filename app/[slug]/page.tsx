"use client";

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

const columnColors = ["#49C4E5", "#8471F2", "#67E2AE", "#E4EBFA"];

export default function DynamicBoardPage() {
  const { slug } = useParams<{ slug: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const boardHref = `/${slug}`;

  useEffect(() => {
    function loadBoard() {
      const savedBoards = window.localStorage.getItem("boards");

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
    const savedBoards = window.localStorage.getItem("boards");

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

    window.localStorage.setItem("boards", JSON.stringify(updatedBoards));
    setBoard(
      updatedBoards.find((item) => item.href === boardHref) ?? null,
    );
    window.dispatchEvent(new Event("boards-updated"));
  }

  if (isLoading) {
    return null;
  }

  if (!board || board.columns.length === 0) {
    return (
      <EmptyBoardState
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