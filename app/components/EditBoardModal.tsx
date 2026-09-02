"use client";

import Image from "next/image";
import { useEffect, useState, type SyntheticEvent } from "react";
import { FiPlus } from "react-icons/fi";

import crossIcon from "@/app/assets/icon-cross.svg";
import useModalAccessibility from "@/app/hooks/useModalAccessibility";
import { createColumn } from "@/app/lib/boardsStorage";
import type {
  Board,
  Column,
  UpdatedBoard,
} from "@/app/types/kanban";

type EditBoardModalProps = {
  board?: Board | null;
  taskCount: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBoard: UpdatedBoard) => void;
};

function defaultColumns() {
  return [createColumn("Todo"), createColumn("Doing")];
}

export default function EditBoardModal({
  board,
  taskCount,
  isOpen,
  onClose,
  onSave,
}: EditBoardModalProps) {
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState<Column[]>([]);
  const [nameError, setNameError] = useState("");
  const [columnsError, setColumnsError] = useState("");

  const modalRef = useModalAccessibility<HTMLFormElement>(isOpen, onClose);
/* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isOpen) return;

    setBoardName(board?.name ?? "Platform Launch");
    setColumns(
      board && board.columns.length > 0 ? board.columns : defaultColumns(),
    );
    setNameError("");
    setColumnsError("");
  }, [board, isOpen]);
/* eslint-enable react-hooks/set-state-in-effect */
  if (!isOpen) return null;

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = boardName.trim();
    const cleanedColumns = columns
      .map((column) => ({
        ...column,
        name: column.name.trim(),
      }))
      .filter((column) => column.name);

    if (!name) {
      setNameError("Board name cannot be empty.");
      return;
    }

    if (cleanedColumns.length === 0 && taskCount > 0) {
      setColumnsError(
        "This board has tasks. Delete or move its tasks before removing the final column.",
      );
      return;
    }

    onSave({
      name,
      columns: cleanedColumns,
    });

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <form
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-board-title"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] overscroll-contain overflow-y-auto rounded-md bg-white p-5 outline-none dark:bg-[#2b2c37] sm:max-h-[90dvh] sm:p-6 md:p-8"
      >
        <h2
          id="edit-board-title"
          className="text-lg font-bold text-[#000112] dark:text-white"
        >
          Edit Board
        </h2>

        <label className="mt-6 block text-xs font-bold text-[#828fa3]">
          Name

          <input
            type="text"
            value={boardName}
            onChange={(event) => {
              setBoardName(event.target.value);
              setNameError("");
            }}
            className="mt-2 h-10 w-full rounded border border-[#828fa3]/25 bg-white px-4 text-sm font-medium text-[#000112] outline-none focus:border-[#635fc7] focus-visible:ring-2 focus-visible:ring-[#635fc7]/40 dark:bg-[#2b2c37] dark:text-white"
          />
        </label>

        {nameError && (
          <p className="mt-2 text-xs font-bold text-[#ea5555]">
            {nameError}
          </p>
        )}

        <p className="mt-6 text-xs font-bold text-[#828fa3]">Columns</p>

        <div className="mt-2 space-y-3">
          {columns.map((column) => (
            <div key={column.id} className="flex items-center gap-3">
              <input
                type="text"
                value={column.name}
                onChange={(event) => {
                  setColumns((currentColumns) =>
                    currentColumns.map((item) =>
                      item.id === column.id
                        ? { ...item, name: event.target.value }
                        : item,
                    ),
                  );
                  setColumnsError("");
                }}
                className="h-10 min-w-0 flex-1 rounded border border-[#828fa3]/25 bg-white px-4 text-sm font-medium text-[#000112] outline-none focus:border-[#635fc7] focus-visible:ring-2 focus-visible:ring-[#635fc7]/40 dark:bg-[#2b2c37] dark:text-white"
              />

              <button
                type="button"
                aria-label={`Remove ${column.name || "column"}`}
                onClick={() => {
                  setColumns((currentColumns) =>
                    currentColumns.filter((item) => item.id !== column.id),
                  );
                  setColumnsError("");
                }}
                className="flex h-10 w-6 shrink-0 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea5555]"
              >
                <Image src={crossIcon} width={15} height={15} alt="" />
              </button>
            </div>
          ))}
        </div>

        {columnsError && (
          <p className="mt-3 text-xs font-bold leading-5 text-[#ea5555]">
            {columnsError}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            setColumns((currentColumns) => [
              ...currentColumns,
              createColumn(""),
            ]);
            setColumnsError("");
          }}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7] transition-colors hover:bg-[#635fc7]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2b2c37]"
        >
          <FiPlus size={16} aria-hidden="true" />
          Add New Column
        </button>

        <button
          type="submit"
          className="mt-6 h-10 w-full rounded-full bg-[#635fc7] text-xs font-bold text-white transition-colors hover:bg-[#a8a4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2b2c37]"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}