"use client";

import { useEffect, useRef, useState } from "react";
import { FiEdit3, FiMoreVertical, FiTrash2, FiX } from "react-icons/fi";

import DeleteTaskModal from "@/app/components/DeleteTaskModal";
import EditTaskModal from "@/app/components/EditTaskModal";
import useModalAccessibility from "@/app/hooks/useModalAccessibility";
import type { Column, Task } from "@/app/types/kanban";

type ViewTaskModalProps = {
  isOpen: boolean;
  task: Task | null;
  columns: Column[];
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
      if (
        taskMenuRef.current &&
        !taskMenuRef.current.contains(event.target as Node)
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

  const currentTask = task;

  const completedSubtasks = currentTask.subtasks.filter(
    (subtask) => subtask.isCompleted,
  ).length;

  function handleDeleteTask() {
    onDeleteTask(currentTask.id);
    setIsDeleteModalOpen(false);
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
          className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] overflow-y-auto rounded-md bg-white p-5 outline-none dark:bg-[#2b2c37] sm:max-h-[90dvh] sm:p-6 md:p-8"
        >
          <div className="flex items-start justify-between gap-3">
            <h2
              id="view-task-title"
              className="min-w-0 break-words text-lg font-bold text-[#000112] dark:text-white"
            >
              {currentTask.title}
            </h2>

            <div className="flex shrink-0 items-center gap-1">
              <div ref={taskMenuRef} className="relative">
                <button
                  type="button"
                  aria-label="Open task menu"
                  aria-expanded={isTaskMenuOpen}
                  onClick={() => setIsTaskMenuOpen((open) => !open)}
                  className="text-[#828fa3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7]"
                >
                  <FiMoreVertical size={18} />
                </button>

                {isTaskMenuOpen && (
                  <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-md bg-white p-3 shadow-lg dark:bg-[#2b2c37]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTaskMenuOpen(false);
                        setIsEditModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2 text-left text-sm font-medium text-[#828fa3] hover:text-[#635fc7]"
                    >
                      <FiEdit3 size={15} />
                      Edit Task
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsTaskMenuOpen(false);
                        setIsDeleteModalOpen(true);
                      }}
                      className="mt-4 flex w-full items-center gap-2 text-left text-sm font-medium text-[#ea5555]"
                    >
                      <FiTrash2 size={15} />
                      Delete Task
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close task"
                className="text-[#828fa3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7]"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          <p className="mt-6 break-words text-sm font-medium leading-6 text-[#828fa3]">
            {currentTask.description || "No description for this task."}
          </p>

          <p className="mt-6 text-xs font-bold text-[#828fa3]">
            Subtasks ({completedSubtasks} of {currentTask.subtasks.length})
          </p>

          <div className="mt-4 space-y-2">
            {currentTask.subtasks.map((subtask) => (
              <label
                key={subtask.id}
                className="flex cursor-pointer items-center gap-3 rounded bg-[#f4f7fd] p-3 dark:bg-[#20212c]"
              >
                <input
                  type="checkbox"
                  checked={subtask.isCompleted}
                  onChange={() =>
                    onToggleSubtask(currentTask.id, subtask.id)
                  }
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
              value={currentTask.status}
              onChange={(event) =>
                onChangeStatus(currentTask.id, event.target.value)
              }
              className="mt-2 h-10 w-full rounded border border-[#828fa3]/25 bg-white px-4 text-sm font-medium text-[#000112] outline-none focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white"
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 h-10 w-full rounded-full bg-[#635fc7] text-xs font-bold text-white"
          >
            Done
          </button>
        </section>
      </div>

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        taskTitle={currentTask.title}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteTask}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        task={currentTask}
        columns={columns}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updatedTask) => {
          onUpdateTask(updatedTask);
          setIsEditModalOpen(false);
          onClose();
        }}
      />
    </>
  );
}