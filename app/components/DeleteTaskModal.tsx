"use client";

import { FiAlertTriangle } from "react-icons/fi";

type DeleteTaskModalProps = {
  isOpen: boolean;
  taskTitle: string;
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteTaskModal({
  isOpen,
  taskTitle,
  onClose,
  onDelete,
}: DeleteTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-task-title"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[340px] overflow-y-auto rounded-md bg-white p-5 dark:bg-[#2b2c37] sm:max-h-[90dvh] sm:max-w-[400px] sm:p-7"
      >
        <div className="flex items-center gap-3">
          <FiAlertTriangle
            size={23}
            className="shrink-0 text-[#ea5555]"
            aria-hidden="true"
          />

          <h2
            id="delete-task-title"
            className="min-w-0 text-lg font-bold text-[#ea5555]"
          >
            Delete this task?
          </h2>
        </div>

        <p className="mt-6 break-words text-sm font-medium leading-6 text-[#828fa3]">
          Are you sure you want to delete the “{taskTitle}” task and its
          subtasks? This action cannot be reversed.
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