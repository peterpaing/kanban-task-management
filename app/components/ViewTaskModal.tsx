"use client";

import { useEffect, useRef, useState } from "react";
import { FiEdit3, FiMoreVertical, FiTrash2, FiX } from "react-icons/fi";

import DeleteTaskModal from "@/app/components/DeleteTaskModal";
import EditTaskModal from "@/app/components/EditTaskModal";
import useModalAccessibility from "@/app/hooks/useModalAccessibility";

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
  onUpdateTask: (task: Task) => void;
};

export default function ViewTaskModal({
  isOpen,
  task,
  columns,
  onClose,
  onToggleSubtask,
  onChangeStatus,
  onDeleteTask,
  onUpdateTask,
}: ViewTaskModalProps) {
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const taskMenuRef = useRef<HTMLDivElement>(null);

  const modalRef = useModalAccessibility<HTMLElement>(
    isOpen && !isDeleteModalOpen && !isEditModalOpen,
    onClose,
  );

  useEffect(() => {
    if (!isTaskMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const clickedElement = event.target as Node;

      if (
        taskMenuRef.current &&
        !taskMenuRef.current.contains(clickedElement)
      ) {
        setIsTaskMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTaskMenuOpen]);

  if (!isOpen || !task) return null;

  const completedSubtasks = task.subtasks.filter(
    (subtask) => subtask.isCompleted,
  ).length;

  function handleOpenEditModal() {
    setIsTaskMenuOpen(false);
    setIsEditModalOpen(true);
  }

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

  function handleSaveTask(updatedTask: Task) {
    onUpdateTask(updatedTask);
    setIsEditModalOpen(false);
    onClose();
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 md:p-6"
        onClick={onClose}
      >
        <section
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-task-title"
          onClick={(event) => event.stopPropagation()}
          className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] overscroll-contain overflow-y-auto rounded-md bg-white p-5 outline-none dark:bg-[#2b2c37] sm:max-h-[90dvh] sm:p-6 md:p-8"
        >
          <div className="flex items-start justify-between gap-3">
            <h2
              id="view-task-title"
              className="min-w-0 break-words text-lg font-bold text-[#000112] dark:text-white"
            >
              {task.title}
            </h2>

            <div className="flex shrink-0 items-center gap-1">
              <div ref={taskMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  aria-label="Open task menu"
                  aria-expanded={isTaskMenuOpen}
                  onClick={() => setIsTaskMenuOpen((isOpen) => !isOpen)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[#828fa3] transition-all duration-150 ease-out hover:scale-110 hover:bg-[#635fc7]/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2b2c37] ${
                    isTaskMenuOpen ? "scale-110 bg-[#635fc7]/10" : ""
                  }`}
                >
                  <FiMoreVertical size={18} aria-hidden="true" />
                </button>

                <div
                  aria-hidden={!isTaskMenuOpen}
                  className={`absolute right-0 top-full z-10 mt-2 w-40 origin-top-right rounded-md bg-white p-3 shadow-lg transition-all duration-150 ease-out dark:bg-[#2b2c37] ${
                    isTaskMenuOpen
                      ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                      : "pointer-events-none -translate-y-1 scale-95 opacity-0"
                  }`}
                >
                  <button
                    type="button"
                    tabIndex={isTaskMenuOpen ? 0 : -1}
                    onClick={handleOpenEditModal}
                    className="flex w-full items-center gap-2 text-left text-sm font-medium text-[#828fa3] transition-colors hover:text-[#635fc7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7]"
                  >
                    <FiEdit3 size={15} aria-hidden="true" />
                    Edit Task
                  </button>

                  <button
                    type="button"
                    tabIndex={isTaskMenuOpen ? 0 : -1}
                    onClick={handleOpenDeleteModal}
                    className="mt-4 flex w-full items-center gap-2 text-left text-sm font-medium text-[#ea5555] transition-colors hover:text-[#ff9898] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea5555]"
                  >
                    <FiTrash2 size={15} aria-hidden="true" />
                    Delete Task
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close task"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#828fa3] transition-all hover:scale-110 hover:bg-[#635fc7]/10 hover:text-[#635fc7] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2b2c37]"
              >
                <FiX size={20} aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="mt-6 break-words text-sm font-medium leading-6 text-[#828fa3]">
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
                  className="h-4 w-4 shrink-0 accent-[#635fc7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2"
                />

                <span
                  className={`min-w-0 break-words text-xs font-bold ${
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
              className="mt-2 h-10 w-full rounded border border-[#828fa3]/25 bg-white px-4 text-sm font-medium text-[#000112] outline-none focus:border-[#635fc7] focus-visible:ring-2 focus-visible:ring-[#635fc7]/40 dark:bg-[#2b2c37] dark:text-white"
            >
              {columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 h-10 w-full rounded-full bg-[#635fc7] text-xs font-bold text-white transition-colors hover:bg-[#a8a4ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2b2c37]"
          >
            Done
          </button>
        </section>
      </div>

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        taskTitle={task.title}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteTask}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        task={task}
        columns={columns}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTask}
      />
    </>
  );
}