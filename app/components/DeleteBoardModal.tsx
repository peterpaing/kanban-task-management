"use client";

type DeleteBoardModalProps = {
  isOpen: boolean;
  boardName: string;
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteBoardModal({
  isOpen,
  boardName,
  onClose,
  onDelete,
}: DeleteBoardModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-board-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[480px] rounded-md bg-white p-6 dark:bg-[#2b2c37] md:p-8"
      >
        <h2
          id="delete-board-title"
          className="text-lg font-bold text-[#ea5555]"
        >
          Delete this board?
        </h2>

        <p className="mt-6 text-sm font-medium leading-6 text-[#828fa3]">
          Are you sure you want to delete the “{boardName}” board? This action
          will remove all columns and tasks and cannot be reversed.
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onDelete}
            className="h-10 flex-1 rounded-full bg-[#ea5555] text-xs font-bold text-white transition-colors hover:bg-[#ff9898]"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7] transition-colors hover:bg-[#635fc7]/20"
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}