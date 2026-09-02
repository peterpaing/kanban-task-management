"use client";

import { useState } from "react";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";

import DeleteTaskModal from "@/app/components/DeleteTaskModal"

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

type ViewTaskModalProps = {
  isOpen: boolean;
  task: Task | null;
  columns: string[];
  onClose: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onChangeStatus: (taskId: string, status: string) => void;
  onDeleteTask: (taskId: string) => void;
};

export default function ViewTaskModal({
  isOpen,
  task,
  columns,
  onClose,
  onToggleSubtask,
  onChangeStatus,
  onDeleteTask,
}: ViewTaskModalProps) {
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!isOpen || !task) return null;

  const completedSubtasks = task.subtasks.filter(
    (subtask) => subtask.isCompleted,
  ).length;

  function handleOpenDeleteModal() {
    setIsTaskMenuOpen(false);
    setIsDeleteModalOpen(true);
  }

  function handleDeleteTask() {
  if (!task) return;

  onDeleteTask(task.id);
  setIsDeleteModalOpen(false);
  onClose();
}

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-6"
        onClick={onClose}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-task-title"
          onClick={(event) => event.stopPropagation()}
          className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-md bg-white p-6 dark:bg-[#2b2c37] md:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <h2
              id="view-task-title"
              className="text-lg font-bold text-[#000112] dark:text-white"
            >
              {task.title}
            </h2>

            <div className="relative shrink-0">
              <button
                type="button"
                aria-label="Open task menu"
                aria-expanded={isTaskMenuOpen}
                onClick={() => setIsTaskMenuOpen((isOpen) => !isOpen)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[#828fa3] transition-all hover:scale-110 hover:bg-[#635fc7]/10 active:scale-95 ${
                  isTaskMenuOpen ? "scale-110 bg-[#635fc7]/10" : ""
                }`}
              >
                <FiMoreVertical size={18} aria-hidden="true" />
              </button>

              {isTaskMenuOpen && (
                <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-md bg-white p-3 shadow-lg dark:bg-[#2b2c37]">
                  <button
                    type="button"
                    onClick={handleOpenDeleteModal}
                    className="flex w-full items-center gap-2 text-left text-sm font-medium text-[#ea5555] transition-colors hover:text-[#ff9898]"
                  >
                    <FiTrash2 size={15} aria-hidden="true" />
                    Delete Task
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mt-6 text-sm font-medium leading-6 text-[#828fa3]">
            {task.description || "No description for this task."}
          </p>

          <p className="mt-6 text-xs font-bold text-[#828fa3]">
            Subtasks ({completedSubtasks} of {task.subtasks.length})
          </p>

          <div className="mt-4 space-y-2">
            {task.subtasks.map((subtask) => (
              <label
                key={subtask.id}
                className="flex cursor-pointer items-center gap-3 rounded bg-[#f4f7fd] p-3 transition-colors hover:bg-[#635fc7]/10 dark:bg-[#20212c]"
              >
                <input
                  type="checkbox"
                  checked={subtask.isCompleted}
                  onChange={() => onToggleSubtask(task.id, subtask.id)}
                  className="h-4 w-4 accent-[#635fc7]"
                />

                <span
                  className={`text-xs font-bold ${
                    subtask.isCompleted
                      ? "text-[#828fa3] line-through"
                      : "text-[#000112] dark:text-white"
                  }`}
                >
                  {subtask.title}
                </span>
              </label>
            ))}
          </div>

          <label className="mt-6 block text-xs font-bold text-[#828fa3]">
            Current Status

            <select
              value={task.status}
              onChange={(event) =>
                onChangeStatus(task.id, event.target.value)
              }
              className="mt-2 h-10 w-full rounded border border-[#828fa3]/25 bg-white px-4 text-sm font-medium text-[#000112] outline-none focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white"
            >
              {columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </label>
        </section>
      </div>

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        taskTitle={task.title}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteTask}
      />
    </>
  );
}