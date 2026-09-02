"use client";

import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

import EmptyBoardState from "@/app/components/EmptyBoardState";
import TaskCard from "@/app/components/TaskCard";
import ViewTaskModal from "@/app/components/ViewTaskModal";
import { loadBoards, saveBoards } from "@/app/lib/boardsStorage";
import type { Board, Task, UpdatedBoard } from "@/app/types/kanban";

const columnColors = ["#49C4E5", "#8471F2", "#67E2AE", "#E4EBFA"];

export default function HomePage() {
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    function loadBoard() {
      const boards = loadBoards([]);
      setBoard(boards.find((item) => item.href === "/") ?? null);
      setIsLoading(false);
    }

    loadBoard();
    window.addEventListener("boards-updated", loadBoard);

    return () => window.removeEventListener("boards-updated", loadBoard);
  }, []);

  function saveUpdatedBoard(updatedBoard: Board) {
    const boards = loadBoards([]);
    const updatedBoards = boards.map((item) =>
      item.href === "/" ? updatedBoard : item,
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
    saveUpdatedBoard({ ...board, tasks });
  }

  const selectedTask =
    board?.tasks.find((task) => task.id === selectedTaskId) ?? null;

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

  return (
    <>
      <section className="min-h-0 flex-1 overflow-x-auto overscroll-x-contain bg-[#f4f7fd] p-4 dark:bg-[#20212c] sm:p-6">
        <div className="flex min-h-[calc(100dvh-80px)] min-w-max snap-x snap-mandatory gap-4 pb-6 sm:gap-6">
          {board.columns.map((column, index) => {
            const columnTasks = board.tasks.filter(
              (task) => task.status === column.id,
            );

            return (
              <section
                key={column.id}
                className="w-[calc(100vw-3rem)] max-w-[280px] shrink-0 snap-start sm:w-[280px]"
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
          onClick={() => window.dispatchEvent(new Event("open-edit-board"))}
          className="flex min-h-[calc(100dvh-140px)] w-[calc(100vw-3rem)] max-w-[280px] shrink-0 snap-start items-center justify-center gap-2 rounded-md bg-[#e9effa] px-4 text-sm font-bold text-[#828fa3] transition-colors hover:bg-[#dce5f5] hover:text-[#635fc7] dark:bg-[#2b2c37] dark:hover:bg-[#3e3f4e] sm:w-[280px]"
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