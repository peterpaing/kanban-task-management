"use client";

import { useEffect, useState } from "react";

import EmptyBoardState from "@/app/components/EmptyBoardState";
import TaskCard from "@/app/components/TaskCard";
import ViewTaskModal from "@/app/components/ViewTaskModal";

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

type UpdatedBoard = {
  name: string;
  columns: string[];
};

const BOARDS_STORAGE_KEY = "kanban-boards-v2";

const columnColors = ["#49C4E5", "#8471F2", "#67E2AE", "#E4EBFA"];

export default function HomePage() {
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const boardHref = "/";

  useEffect(() => {
    function loadBoard() {
      const savedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);

      if (savedBoards) {
        const boards: Board[] = JSON.parse(savedBoards);
        const homeBoard = boards.find((item) => item.href === "/");

        setBoard(homeBoard ?? null);
      }

      setIsLoading(false);
    }

    loadBoard();

    window.addEventListener("boards-updated", loadBoard);

    return () => {
      window.removeEventListener("boards-updated", loadBoard);
    };
  }, []);

  function handleSaveBoard(updatedBoard: UpdatedBoard) {
    const savedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);

    if (!savedBoards) return;

    const boards: Board[] = JSON.parse(savedBoards);

    const updatedBoards = boards.map((item) =>
      item.href === boardHref
        ? {
            ...item,
            name: updatedBoard.name,
            columns: updatedBoard.columns,
          }
        : item,
    );

    window.localStorage.setItem(
      BOARDS_STORAGE_KEY,
      JSON.stringify(updatedBoards),
    );

    setBoard(updatedBoards.find((item) => item.href === boardHref) ?? null);
    window.dispatchEvent(new Event("boards-updated"));
  }

  function updateBoardTasks(updatedTasks: Task[]) {
    const savedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);

    if (!savedBoards) return;

    const boards: Board[] = JSON.parse(savedBoards);

    const updatedBoards = boards.map((item) =>
      item.href === boardHref
        ? {
            ...item,
            tasks: updatedTasks,
          }
        : item,
    );

    const updatedBoard =
      updatedBoards.find((item) => item.href === boardHref) ?? null;

    window.localStorage.setItem(
      BOARDS_STORAGE_KEY,
      JSON.stringify(updatedBoards),
    );

    setBoard(updatedBoard);
    window.dispatchEvent(new Event("boards-updated"));
  }

  function handleToggleSubtask(taskId: string, subtaskId: string) {
    const updatedTasks = (board?.tasks ?? []).map((task) =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map((subtask) =>
              subtask.id === subtaskId
                ? {
                    ...subtask,
                    isCompleted: !subtask.isCompleted,
                  }
                : subtask,
            ),
          }
        : task,
    );

    updateBoardTasks(updatedTasks);
  }

  function handleChangeTaskStatus(taskId: string, status: string) {
    const updatedTasks = (board?.tasks ?? []).map((task) =>
      task.id === taskId ? { ...task, status } : task,
    );

    updateBoardTasks(updatedTasks);
  }

  function handleDeleteTask(taskId: string) {
    const updatedTasks = (board?.tasks ?? []).filter(
      (task) => task.id !== taskId,
    );

    updateBoardTasks(updatedTasks);
    setSelectedTaskId(null);
  }

  const selectedTask =
    board?.tasks?.find((task) => task.id === selectedTaskId) ?? null;

  if (isLoading) return null;

  if (!board || board.columns.length === 0) {
    return (
      <EmptyBoardState
        board={board}
        onAddColumn={() => {}}
        onSave={handleSaveBoard}
      />
    );
  }

  function handleUpdateTask(updatedTask: Task) {
  const updatedTasks = (board?.tasks ?? []).map((task) =>
    task.id === updatedTask.id ? updatedTask : task,
  );

  updateBoardTasks(updatedTasks);
  setSelectedTaskId(null);
}

  return (
    <>
      <section className="min-h-full overflow-x-auto bg-[#f4f7fd] p-4 dark:bg-[#20212c] md:p-6">
        <div className="flex min-h-[calc(100vh-80px)] min-w-max gap-6">
          {board.columns.map((column, index) => {
            const columnTasks = (board.tasks ?? []).filter(
              (task) => task.status === column,
            );

            return (
              <section key={column} className="w-[280px] shrink-0">
                <h2 className="flex items-center gap-3 text-xs font-bold tracking-[0.15em] text-[#828fa3]">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{
                      backgroundColor:
                        columnColors[index % columnColors.length],
                    }}
                  />

                  {column.toUpperCase()} ({columnTasks.length})
                </h2>

                <div className="mt-6 space-y-5">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      title={task.title}
                      subtasks={task.subtasks}
                      onClick={() => setSelectedTaskId(task.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <ViewTaskModal
        isOpen={selectedTask !== null}
        task={selectedTask}
        columns={board.columns}
        onClose={() => setSelectedTaskId(null)}
        onToggleSubtask={handleToggleSubtask}
        onChangeStatus={handleChangeTaskStatus}
        onDeleteTask={handleDeleteTask}
        onUpdateTask={handleUpdateTask}
      />
    </>
  );
}