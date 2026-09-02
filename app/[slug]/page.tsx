"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiPlus } from "react-icons/fi";

import EmptyBoardState from "@/app/components/EmptyBoardState";
import TaskCard from "@/app/components/TaskCard";
import ViewTaskModal from "@/app/components/ViewTaskModal";
import { loadBoards, saveBoards } from "@/app/lib/boardsStorage";
import type { Board, Task, UpdatedBoard } from "@/app/types/kanban";

const columnColors = ["#49C4E5", "#8471F2", "#67E2AE", "#E4EBFA"];

export default function DynamicBoardPage() {
  const { slug } = useParams<{ slug: string }>();
  const boardHref = `/${slug}`;

  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    function loadBoard() {
      const boards = loadBoards([]);
      setBoard(boards.find((item) => item.href === boardHref) ?? null);
      setIsLoading(false);
    }

    loadBoard();
    window.addEventListener("boards-updated", loadBoard);

    return () => window.removeEventListener("boards-updated", loadBoard);
  }, [boardHref]);

  function saveUpdatedBoard(updatedBoard: Board) {
    const boards = loadBoards([]);

    const updatedBoards = boards.map((item) =>
      item.href === boardHref ? updatedBoard : item,
    );

    saveBoards(updatedBoards);
    setBoard(updatedBoard);
    window.dispatchEvent(new Event("boards-updated"));
  }

  function handleSaveBoard(updatedBoard: UpdatedBoard) {
    if (!board) return;

    const validColumnIds = new Set(
      updatedBoard.columns.map((column) => column.id),
    );
    const fallbackColumnId = updatedBoard.columns[0]?.id;

    saveUpdatedBoard({
      ...board,
      ...updatedBoard,
      tasks: board.tasks.map((task) =>
        validColumnIds.has(task.status) || !fallbackColumnId
          ? task
          : { ...task, status: fallbackColumnId },
      ),
    });
  }

  function updateBoardTasks(tasks: Task[]) {
    if (!board) return;

    saveUpdatedBoard({
      ...board,
      tasks,
    });
  }

  const selectedTask =
    board?.tasks.find((task) => task.id === selectedTaskId) ?? null;

  if (isLoading) return null;

  if (!board) {
    return (
      <section className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#f4f7fd] px-4 text-center dark:bg-[#20212c]">
        <h1 className="text-xl font-bold text-[#000112] dark:text-white">
          Board not found
        </h1>

        <p className="mt-3 text-sm font-medium text-[#828fa3]">
          This board may have been deleted or its link is invalid.
        </p>

        <Link
          href="/"
          className="mt-6 rounded-full bg-[#635fc7] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#a8a4ff]"
        >
          Go to Home Board
        </Link>
      </section>
    );
  }

  if (board.columns.length === 0) {
    return (
      <EmptyBoardState
        board={board}
        onAddColumn={() => {}}
        onSave={handleSaveBoard}
      />
    );
  }

  return (
    <>
      <section className="min-h-0 flex-1 overflow-x-auto overscroll-x-contain bg-[#f4f7fd] dark:bg-[#20212c]">
        <div className="flex min-h-[calc(100dvh-80px)] min-w-max snap-x snap-mandatory gap-4 p-4 pb-6 sm:gap-6 sm:p-6 lg:gap-8 lg:p-8">
          {board.columns.map((column, index) => {
            const columnTasks = board.tasks.filter(
              (task) => task.status === column.id,
            );

            return (
              <section
                key={column.id}
                className="w-[280px] shrink-0 snap-start"
              >
                <h2 className="flex items-center gap-3 text-xs font-bold tracking-[0.15em] text-[#828fa3]">
                  <span
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        columnColors[index % columnColors.length],
                    }}
                  />

                  {column.name.toUpperCase()} ({columnTasks.length})
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

          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event("open-edit-board"))
            }
            className="flex min-h-[calc(100dvh-140px)] w-[280px] shrink-0 snap-start items-center justify-center gap-2 rounded-md bg-[#e9effa] px-4 text-sm font-bold text-[#828fa3] transition-colors hover:bg-[#dce5f5] hover:text-[#635fc7] dark:bg-[#2b2c37] dark:hover:bg-[#3e3f4e]"
          >
            <FiPlus size={16} aria-hidden="true" />
            <span>New Column</span>
          </button>
        </div>
      </section>

      <ViewTaskModal
        isOpen={selectedTask !== null}
        task={selectedTask}
        columns={board.columns}
        onClose={() => setSelectedTaskId(null)}
        onToggleSubtask={(taskId, subtaskId) =>
          updateBoardTasks(
            board.tasks.map((task) =>
              task.id !== taskId
                ? task
                : {
                    ...task,
                    subtasks: task.subtasks.map((subtask) =>
                      subtask.id === subtaskId
                        ? {
                            ...subtask,
                            isCompleted: !subtask.isCompleted,
                          }
                        : subtask,
                    ),
                  },
            ),
          )
        }
        onChangeStatus={(taskId, status) =>
          updateBoardTasks(
            board.tasks.map((task) =>
              task.id === taskId ? { ...task, status } : task,
            ),
          )
        }
        onDeleteTask={(taskId) => {
          updateBoardTasks(board.tasks.filter((task) => task.id !== taskId));
          setSelectedTaskId(null);
        }}
        onUpdateTask={(updatedTask) => {
          updateBoardTasks(
            board.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task,
            ),
          );
          setSelectedTaskId(null);
        }}
      />
    </>
  );
}