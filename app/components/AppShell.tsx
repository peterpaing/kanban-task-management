"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import AddTaskModal from "@/app/components/AddTaskModal";
import DeleteBoardModal from "@/app/components/DeleteBoardModal";
import EditBoardModal from "@/app/components/EditBoardModal";
import Header from "@/app/components/Header";
import MobileBoardMenu from "@/app/components/MobileBoardMenu";
import Sidebar from "@/app/components/Sidebar";
import { loadBoards, saveBoards } from "@/app/lib/boardsStorage";
import type { Board, Task, UpdatedBoard } from "@/app/types/kanban";

const initialBoards: Board[] = [
  { name: "Platform Launch", href: "/", columns: [], tasks: [] },
  { name: "Marketing Plan", href: "/marketing-plan", columns: [], tasks: [] },
  { name: "Roadmap", href: "/roadmap", columns: [], tasks: [] },
];

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [isBoardsReady, setIsBoardsReady] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const currentBoard =
    boards.find((board) => board.href === pathname) ?? null;

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setBoards(loadBoards(initialBoards));
    setIsBoardsReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    function syncBoardsFromStorage() {
      const savedBoards = loadBoards(initialBoards);

      setBoards((currentBoards) =>
        JSON.stringify(currentBoards) === JSON.stringify(savedBoards)
          ? currentBoards
          : savedBoards,
      );
    }

    window.addEventListener("boards-updated", syncBoardsFromStorage);

    return () => {
      window.removeEventListener("boards-updated", syncBoardsFromStorage);
    };
  }, []);

  useEffect(() => {
    if (!isBoardsReady) return;

    saveBoards(boards);
    window.dispatchEvent(new Event("boards-updated"));
  }, [boards, isBoardsReady]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");

    setIsDark(savedTheme === "dark");
    setIsThemeReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isThemeReady) return;

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, isThemeReady]);

  useEffect(() => {
    function handleOpenEditBoard() {
      if (currentBoard) {
        setIsEditBoardOpen(true);
      }
    }

    window.addEventListener("open-edit-board", handleOpenEditBoard);

    return () => {
      window.removeEventListener("open-edit-board", handleOpenEditBoard);
    };
  }, [currentBoard]);

  function handleSaveBoard(updatedBoard: UpdatedBoard) {
    setBoards((currentBoards) =>
      currentBoards.map((board) => {
        if (board.href !== pathname) return board;

        const validColumnIds = new Set(
          updatedBoard.columns.map((column) => column.id),
        );
        const fallbackColumnId = updatedBoard.columns[0]?.id;

        return {
          ...board,
          name: updatedBoard.name,
          columns: updatedBoard.columns,
          tasks: board.tasks.map((task) =>
            validColumnIds.has(task.status) || !fallbackColumnId
              ? task
              : { ...task, status: fallbackColumnId },
          ),
        };
      }),
    );
  }

  function handleCreateTask(task: Task) {
    if (!currentBoard) return;

    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.href === pathname
          ? { ...board, tasks: [...board.tasks, task] }
          : board,
      ),
    );
  }

  function handleDeleteBoard() {
    if (!currentBoard || boards.length <= 1) return;

    const remainingBoards = boards.filter(
      (board) => board.href !== currentBoard.href,
    );

    const nextBoards =
      currentBoard.href === "/"
        ? [
            { ...remainingBoards[0], href: "/" },
            ...remainingBoards.slice(1),
          ]
        : remainingBoards;

    setBoards(nextBoards);
    setIsDeleteBoardOpen(false);
    router.replace("/");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        boards={boards}
        setBoards={setBoards}
        isDark={isDark}
        setIsDark={setIsDark}
        isCreateBoardOpen={isCreateBoardOpen}
        setIsCreateBoardOpen={setIsCreateBoardOpen}
        isSidebarHidden={isSidebarHidden}
        setIsSidebarHidden={setIsSidebarHidden}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          boardName={currentBoard?.name ?? "Board Not Found"}
          hasColumns={Boolean(currentBoard?.columns.length)}
          showDesktopLogo={isSidebarHidden}
          isMobileMenuOpen={isMobileMenuOpen}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onAddTask={() => setIsAddTaskOpen(true)}
          onEditBoard={() => setIsEditBoardOpen(true)}
          onDeleteBoard={() => {
            if (currentBoard) setIsDeleteBoardOpen(true);
          }}
        />

        <main className="flex-1">{children}</main>
      </div>

      <MobileBoardMenu
        boards={boards}
        isOpen={isMobileMenuOpen}
        isDark={isDark}
        onClose={() => setIsMobileMenuOpen(false)}
        onCreateBoard={() => setIsCreateBoardOpen(true)}
        onToggleTheme={() => setIsDark((currentTheme) => !currentTheme)}
      />

      <AddTaskModal
        columns={currentBoard?.columns ?? []}
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onCreateTask={handleCreateTask}
      />

      <EditBoardModal
        board={currentBoard}
        taskCount={currentBoard?.tasks.length ?? 0}
        isOpen={isEditBoardOpen}
        onClose={() => setIsEditBoardOpen(false)}
        onSave={handleSaveBoard}
      />

      <DeleteBoardModal
        isOpen={isDeleteBoardOpen}
        boardName={currentBoard?.name ?? ""}
        canDelete={boards.length > 1}
        onClose={() => setIsDeleteBoardOpen(false)}
        onDelete={handleDeleteBoard}
      />
    </div>
  );
}