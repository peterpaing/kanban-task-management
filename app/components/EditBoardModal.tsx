"use client";

import Image from "next/image";
import { useState, type SyntheticEvent } from "react";
import { FiPlus } from "react-icons/fi";

import crossIcon from "@/app/assets/icon-cross.svg";

type UpdatedBoard = {
  name: string;
  columns: string[];
};

type EditBoardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBoard: UpdatedBoard) => void;
};

export default function EditBoardModal({
  isOpen,
  onClose,
  onSave,
}: EditBoardModalProps) {
  const [boardName, setBoardName] = useState("Platform Launch");
  const [columns, setColumns] = useState(["Todo", "Doing"]);

  if (!isOpen) return null;

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = boardName.trim();
    const cleanedColumns = columns
      .map((column) => column.trim())
      .filter(Boolean);

    if (!name) return;

    onSave({
      name,
      columns: cleanedColumns,
    });

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-md bg-white p-6 dark:bg-[#2b2c37] md:p-8"
      >
        <h2 className="text-lg font-bold text-[#000112] dark:text-white">
          Edit Board
        </h2>

        <label className="mt-6 block text-xs font-bold text-[#828fa3]">
          Name
          <input
            type="text"
            value={boardName}
            onChange={(event) => setBoardName(event.target.value)}
            className="mt-2 h-10 w-full rounded border border-[#828fa3]/25 bg-white px-4 text-sm font-medium text-[#000112] outline-none focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white"
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
                className="h-10 flex-1 rounded border border-[#828fa3]/25 bg-white px-4 text-sm font-medium text-[#000112] outline-none focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white"
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
                <Image src={crossIcon} width={15} height={15} alt="" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setColumns((currentColumns) => [...currentColumns, ""])
          }
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7] transition-colors hover:bg-[#635fc7]/20"
        >
          <FiPlus size={16} aria-hidden="true" />
          Add New Column
        </button>

        <button
          type="submit"
          className="mt-6 h-10 w-full rounded-full bg-[#635fc7] text-xs font-bold text-white transition-colors hover:bg-[#a8a4ff]"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}