"use client";

import Image from "next/image";
import { useEffect, useState, type SyntheticEvent } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import crossIcon from "@/app/assets/icon-cross.svg";

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

type EditTaskModalProps = {
  isOpen: boolean;
  task: Task | null;
  columns: string[];
  onClose: () => void;
  onSave: (task: Task) => void;
};

function getComparableSubtasks(subtasks: Subtask[]) {
  return subtasks
    .map((subtask) => ({
      ...subtask,
      title: subtask.title.trim(),
    }))
    .filter((subtask) => subtask.title);
}

export default function EditTaskModal({
  isOpen,
  task,
  columns,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [status, setStatus] = useState("");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (!isOpen || !task) return;

    setTitle(task.title);
    setDescription(task.description);
    setSubtasks(task.subtasks);
    setStatus(task.status);
    setTitleError("");
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const hasChanges =
    JSON.stringify({
      title: title.trim(),
      description: description.trim(),
      status,
      subtasks: getComparableSubtasks(subtasks),
    }) !==
    JSON.stringify({
      title: task.title.trim(),
      description: task.description.trim(),
      status: task.status,
      subtasks: getComparableSubtasks(task.subtasks),
    });

  const isSaveDisabled = !hasChanges || !title.trim();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!task) return;

    const cleanedTitle = title.trim();

    if (!cleanedTitle) {
      setTitleError("Task title cannot be empty.");
      return;
    }

    if (!hasChanges) return;

    onSave({
      ...task,
      title: cleanedTitle,
      description: description.trim(),
      status,
      subtasks: getComparableSubtasks(subtasks),
    });

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] overscroll-contain overflow-y-auto rounded-md bg-white p-5 dark:bg-[#2b2c37] sm:max-h-[90dvh] sm:p-6 md:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#000112] dark:text-white">
            Edit Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel editing task"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#828fa3] transition-all hover:scale-110 hover:bg-[#635fc7]/10 hover:text-[#635fc7] active:scale-95"
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
            aria-invalid={Boolean(titleError)}
            className={`mt-2 h-10 w-full rounded border bg-white px-4 text-sm text-[#000112] outline-none focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white ${
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
            className="mt-2 min-h-24 w-full resize-none rounded border border-[#828fa3]/25 bg-white px-4 py-3 text-sm text-[#000112] outline-none placeholder:text-[#828fa3]/55 focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white sm:min-h-28"
          />
        </label>

        <p className="mt-6 text-xs font-bold text-[#828fa3]">Subtasks</p>

        <div className="mt-2 space-y-3">
          {subtasks.map((subtask, index) => (
            <div key={subtask.id} className="flex items-center gap-3">
              <input
                type="text"
                value={subtask.title}
                onChange={(event) =>
                  setSubtasks((currentSubtasks) =>
                    currentSubtasks.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, title: event.target.value }
                        : item,
                    ),
                  )
                }
                className="h-10 min-w-0 flex-1 rounded border border-[#828fa3]/25 bg-white px-4 text-sm text-[#000112] outline-none focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white"
              />

              <button
                type="button"
                aria-label={`Remove ${subtask.title || "subtask"}`}
                onClick={() =>
                  setSubtasks((currentSubtasks) =>
                    currentSubtasks.filter((item) => item.id !== subtask.id),
                  )
                }
                className="flex h-10 w-6 shrink-0 items-center justify-center"
              >
                <Image src={crossIcon} width={15} height={15} alt="" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setSubtasks((currentSubtasks) => [
              ...currentSubtasks,
              {
                id: crypto.randomUUID(),
                title: "",
                isCompleted: false,
              },
            ])
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
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-6 flex flex-col-reverse items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-full max-w-[280px] rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7] transition-colors hover:bg-[#635fc7]/20 sm:max-w-none sm:flex-1"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaveDisabled}
            className="h-10 w-full max-w-[280px] rounded-full bg-[#635fc7] text-xs font-bold text-white transition-colors hover:bg-[#a8a4ff] disabled:cursor-not-allowed disabled:bg-[#635fc7]/40 disabled:text-white/70 sm:max-w-none sm:flex-1"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}