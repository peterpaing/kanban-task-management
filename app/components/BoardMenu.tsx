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
        tabIndex={isOpen ? 0 : -1}
        onClick={onEditBoard}
        className="block w-full text-left text-sm font-medium text-[#828fa3] transition-colors hover:text-[#635fc7]"
      >
        Edit Board
      </button>

      <button
        type="button"
        role="menuitem"
        tabIndex={isOpen ? 0 : -1}
        onClick={onDeleteBoard}
        className="mt-4 block w-full text-left text-sm font-medium text-[#ea5555] transition-colors hover:text-[#ff9898]"
      >
        Delete Board
      </button>
    </div>
  );
}