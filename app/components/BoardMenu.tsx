type BoardMenuProps = {
  isOpen: boolean;
  onEditBoard: () => void;
  onDeleteBoard: () => void;
};

export default function BoardMenu({
  isOpen,
  onEditBoard,
  onDeleteBoard,
}: BoardMenuProps) {
  return (
    <div
      id="board-menu"
      role="menu"
      aria-hidden={!isOpen}
      className={`absolute right-0 top-full z-50 mt-4 w-48 origin-top-right rounded-md bg-white p-4 shadow-lg transition-[opacity,transform] duration-150 ease-out dark:bg-[#2b2c37] ${
        isOpen
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none -translate-y-1 scale-95 opacity-0"
      }`}
    >
      <button
      type="button"
      role="menuitem"
      onClick={onEditBoard}
      className="block w-full rounded px-1 text-left text-sm font-medium text-[#828fa3] hover:text-[#635fc7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2b2c37]"
    >
      Edit Board
    </button>

    <button
      type="button"
      role="menuitem"
      onClick={onDeleteBoard}
      className="mt-4 block w-full rounded px-1 text-left text-sm font-medium text-[#ea5555] hover:text-[#ff9898] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea5555] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2b2c37]"
    >
      Delete Board
    </button>
    </div>
  );
}