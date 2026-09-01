"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import EmptyBoardState from "@/app/components/EmptyBoardState";

type Board = {
  name: string;
  href: string;
  columns: string[];
};

export default function DynamicBoardPage() {
  const { slug } = useParams<{ slug: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedBoards = window.localStorage.getItem("boards");

    if (savedBoards) {
      const boards: Board[] = JSON.parse(savedBoards);

      const currentBoard = boards.find(
        (item) => item.href === `/${slug}`,
      );

      setBoard(currentBoard ?? null);
    }

    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return null;
  }

  if (!board || board.columns.length === 0) {
    return (
      <EmptyBoardState
        onAddColumn={() => {
          console.log("Open Add New Column form later");
        }}
      />
    );
  }

  return (
    <section className="min-h-full bg-[#f4f7fd] p-6 dark:bg-[#20212c]">
      <h2 className="text-xl font-bold text-[#000112] dark:text-white">
        {board.name}
      </h2>
    </section>
  );
}