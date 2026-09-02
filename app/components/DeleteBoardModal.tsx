"use client";

import { FiAlertTriangle } from "react-icons/fi";

type DeleteBoardModalProps = {
  isOpen: boolean;
  boardName: string;
  canDelete: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteBoardModal({
  isOpen,
  boardName,
  canDelete,
  onClose,
  onDelete,
}: DeleteBoardModalProps) {
  if (!isOpen) return null;

  if (!canDelete) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 md:p-6"
        onClick={onClose}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="keep-board-title"
          onClick={(event) => event.stopPropagation()}
          className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] overflow-y-auto rounded-md bg-white p-5 dark:bg-[#2b2c37] sm:max-h-[90dvh] sm:p-6 md:p-8"
        >
          <h2
            id="keep-board-title"
            className="flex items-center gap-3 text-lg font-bold text-[#ea5555]"
          >
            <FiAlertTriangle
              size={24}
              className="shrink-0"
              aria-hidden="true"
            />
            You must have at least one board.
          </h2>

          <p className="mt-6 break-words text-sm font-medium leading-6 text-[#828fa3]">
            Create another board before deleting “{boardName}”.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 h-10 w-full max-w-[280px] rounded-full bg-[#ea5555] text-xs font-bold text-white transition-colors hover:bg-[#ff9898] sm:max-w-none"
          >
            Close
          </button>
        </section>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-board-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] overflow-y-auto rounded-md bg-white p-5 dark:bg-[#2b2c37] sm:max-h-[90dvh] sm:p-6 md:p-8"
      >
        <h2
          id="delete-board-title"
          className="text-lg font-bold text-[#ea5555]"
        >
          Delete this board?
        </h2>

        <p className="mt-6 break-words text-sm font-medium leading-6 text-[#828fa3]">
          Are you sure you want to delete the “{boardName}” board? This action
          will remove all columns and tasks and cannot be reversed.
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onDelete}
            className="h-10 w-full max-w-[280px] rounded-full bg-[#ea5555] text-xs font-bold text-white transition-colors hover:bg-[#ff9898] sm:max-w-none sm:flex-1"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-full max-w-[280px] rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7] transition-colors hover:bg-[#635fc7]/20 sm:max-w-none sm:flex-1"
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}