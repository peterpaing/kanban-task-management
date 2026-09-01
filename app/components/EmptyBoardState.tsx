"use client";

import { FiPlus } from "react-icons/fi";

type EmptyBoardStateProps = {
  onAddColumn: () => void;
};

export default function EmptyBoardState({
  onAddColumn,
}: EmptyBoardStateProps) {
  return (
    <section className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#f4f7fd] px-4 dark:bg-[#20212c]">
      <p className="text-center text-sm font-bold text-[#828fa3]">
        This board is empty. Create a new column to get started.
      </p>

      <button
        type="button"
        onClick={onAddColumn}
        className="mt-6 flex h-10 items-center gap-2 rounded-full bg-[#635fc7] px-5 text-xs font-bold text-white transition-colors hover:bg-[#a8a4ff]"
      >
        <FiPlus size={14} aria-hidden="true" />
        Add New Column
      </button>
    </section>
  );
}