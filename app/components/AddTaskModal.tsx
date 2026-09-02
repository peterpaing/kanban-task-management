"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import useModalAccessibility from "@/app/hooks/useModalAccessibility";
import { createId } from "@/app/lib/boardsStorage";
import type { Column, Task } from "@/app/types/kanban";

type AddTaskModalProps = {
  columns: Column[];
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Task) => void;
};

const DEFAULT_SUBTASKS = ["", ""];

export default function AddTaskModal({
  columns,
  isOpen,
  onClose,
  onCreateTask,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>(DEFAULT_SUBTASKS);
  const [status, setStatus] = useState("");
  const [titleError, setTitleError] = useState("");
  const modalRef = useModalAccessibility<HTMLFormElement>(isOpen, onClose);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isOpen) return;

    setTitle("");
    setDescription("");
    setSubtasks(DEFAULT_SUBTASKS);
    setStatus(columns[0]?.id ?? "");
    setTitleError("");
  }, [columns, isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedTitle = title.trim();

    if (!cleanedTitle) {
      setTitleError("Task title cannot be empty.");
      return;
    }

    onCreateTask({
      id: createId(),
      title: cleanedTitle,
      description: description.trim(),
      status,
      subtasks: subtasks
        .map((subtask) => subtask.trim())
        .filter(Boolean)
        .map((subtask) => ({
          id: createId(),
          title: subtask,
          isCompleted: false,
        })),
    });

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <form
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] overscroll-contain overflow-y-auto rounded-md bg-white p-5 outline-none dark:bg-[#2b2c37] sm:max-h-[90dvh] sm:p-6 md:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="add-task-title"
            className="text-lg font-bold text-[#000112] dark:text-white"
          >
            Add New Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close add task modal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#828fa3] transition-all hover:scale-110 hover:bg-[#635fc7]/10 hover:text-[#635fc7] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7]"
          >
            <FiX size={20} aria-hidden="true" />
          </button>
        </div>

        <label className="mt-6 block text-xs font-bold text-[#828fa3]">
          Title
          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setTitleError("");
            }}
            placeholder="e.g. Take coffee break"
            aria-invalid={Boolean(titleError)}
            className={`mt-2 h-10 w-full rounded border bg-white px-4 text-sm text-[#000112] outline-none placeholder:text-[#828fa3]/55 focus:border-[#635fc7] focus-visible:ring-2 focus-visible:ring-[#635fc7]/40 dark:bg-[#2b2c37] dark:text-white ${
              titleError ? "border-[#ea5555]" : "border-[#828fa3]/25"
            }`}
          />
        </label>

        {titleError && (
          <p className="mt-2 text-xs font-bold text-[#ea5555]">
            {titleError}
          </p>
        )}

        <label className="mt-6 block text-xs font-bold text-[#828fa3]">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. It’s always good to take a break."
            className="mt-2 min-h-24 w-full resize-none rounded border border-[#828fa3]/25 bg-white px-4 py-3 text-sm text-[#000112] outline-none placeholder:text-[#828fa3]/55 focus:border-[#635fc7] focus-visible:ring-2 focus-visible:ring-[#635fc7]/40 dark:bg-[#2b2c37] dark:text-white sm:min-h-28"
          />
        </label>

        <p className="mt-6 text-xs font-bold text-[#828fa3]">Subtasks</p>

        <div className="mt-2 space-y-3">
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={subtask}
                onChange={(event) =>
                  setSubtasks((currentSubtasks) =>
                    currentSubtasks.map((item, itemIndex) =>
                      itemIndex === index ? event.target.value : item,
                    ),
                  )
                }
                placeholder="e.g. Make coffee"
                className="h-10 min-w-0 flex-1 rounded border border-[#828fa3]/25 bg-white px-4 text-sm text-[#000112] outline-none placeholder:text-[#828fa3]/55 focus:border-[#635fc7] focus-visible:ring-2 focus-visible:ring-[#635fc7]/40 dark:bg-[#2b2c37] dark:text-white"
              />

              <button
                type="button"
                aria-label={`Remove ${subtask || "subtask"}`}
                onClick={() =>
                  setSubtasks((currentSubtasks) =>
                    currentSubtasks.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  )
                }
                className="flex h-10 w-8 shrink-0 items-center justify-center rounded text-[#828fa3] transition-colors hover:text-[#ea5555] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7]"
              >
                <FiX size={22} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setSubtasks((currentSubtasks) => [...currentSubtasks, ""])
          }
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7] transition-colors hover:bg-[#635fc7]/20"
        >
          <FiPlus size={16} aria-hidden="true" />
          Add New Subtask
        </button>

        <label className="mt-6 block text-xs font-bold text-[#828fa3]">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-2 h-10 w-full rounded border border-[#828fa3]/25 bg-white px-4 text-sm text-[#000112] outline-none focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white"
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="mt-6 h-10 w-full rounded-full bg-[#635fc7] text-xs font-bold text-white transition-colors hover:bg-[#a8a4ff]"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}