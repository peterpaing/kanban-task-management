"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import AddTaskModal from "@/app/components/AddTaskModal";
import DeleteBoardModal from "@/app/components/DeleteBoardModal";
import EditBoardModal from "@/app/components/EditBoardModal";
import Header from "@/app/components/Header";
import MobileBoardMenu from "@/app/components/MobileBoardMenu";
import Sidebar from "@/app/components/Sidebar";

type Subtask = {
  id: string;
  title: string;
  isCompleted: boolean;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
};

type Board = {
  name: string;
  href: string;
  columns: string[];
  tasks?: Task[];
};

const BOARDS_STORAGE_KEY = "kanban-boards-v2";

const initialBoards: Board[] = [
  {
    name: "Platform Launch",
    href: "/",
    columns: [],
    tasks: [],
  },
  {
    name: "Marketing Plan",
    href: "/marketing-plan",
    columns: [],
    tasks: [],
  },
  {
    name: "Roadmap",
    href: "/roadmap",
    columns: [],
    tasks: [],
  },
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

  useEffect(() => {
    const savedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);

    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    }

    setIsBoardsReady(true);
  }, []);

  useEffect(() => {
    function syncBoardsFromStorage() {
      const savedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);

      if (!savedBoards) return;

      const savedBoardsData: Board[] = JSON.parse(savedBoards);

      setBoards((currentBoards) =>
        JSON.stringify(currentBoards) === JSON.stringify(savedBoardsData)
          ? currentBoards
          : savedBoardsData,
      );
    }

    window.addEventListener("boards-updated", syncBoardsFromStorage);

    return () => {
      window.removeEventListener("boards-updated", syncBoardsFromStorage);
    };
  }, []);

  useEffect(() => {
    if (!isBoardsReady) return;

    window.localStorage.setItem(
      BOARDS_STORAGE_KEY,
      JSON.stringify(boards),
    );

    window.dispatchEvent(new Event("boards-updated"));
  }, [boards, isBoardsReady]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");

    setIsDark(savedTheme === "dark");
    setIsThemeReady(true);
  }, []);

  useEffect(() => {
    if (!isThemeReady) return;

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, isThemeReady]);

  function handleSaveBoard(updatedBoard: {
    name: string;
    columns: string[];
  }) {
    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.href === pathname
          ? {
              ...board,
              name: updatedBoard.name,
              columns: updatedBoard.columns,
            }
          : board,
      ),
    );
  }

  function handleCreateTask(task: Task) {
    if (!currentBoard) return;

    setBoards((currentBoards) =>
      currentBoards.map((board) =>
        board.href === pathname
          ? {
              ...board,
              tasks: [...(board.tasks ?? []), task],
            }
          : board,
      ),
    );
  }

  function handleDeleteBoard() {
    if (!currentBoard || boards.length <= 1) return;

    const remainingBoards = boards.filter(
      (board) => board.href !== currentBoard.href,
    );

    let nextBoards = remainingBoards;

    if (currentBoard.href === "/") {
      const [nextMainBoard, ...otherBoards] = remainingBoards;

      nextBoards = [
        {
          ...nextMainBoard,
          href: "/",
        },
        ...otherBoards,
      ];
    }

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
            if (currentBoard) {
              setIsDeleteBoardOpen(true);
            }
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