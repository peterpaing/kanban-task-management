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
  if (!isOpen) return null;

  return (
    <div
      role="menu"
      className="absolute right-0 top-full z-50 mt-4 w-48 rounded-md bg-white p-4 shadow-lg dark:bg-[#2b2c37]"
    >
      <button
        type="button"
        role="menuitem"
        onClick={onEditBoard}
        className="block w-full text-left text-sm font-medium text-[#828fa3] hover:text-[#635fc7]"
      >
        Edit Board
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={onDeleteBoard}
        className="mt-4 block w-full text-left text-sm font-medium text-[#ea5555] hover:text-[#ff9898]"
      >
        Delete Board
      </button>
    </div>
  );
}