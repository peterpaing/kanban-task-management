"use client";

import Image from "next/image";
import { useEffect, useState, type SyntheticEvent } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import crossIcon from "@/app/assets/icon-cross.svg";
import useModalAccessibility from "@/app/hooks/useModalAccessibility";
import { createId } from "@/app/lib/boardsStorage";
import type { Column, Subtask, Task } from "@/app/types/kanban";

type EditTaskModalProps = {
  isOpen: boolean;
  task: Task | null;
  columns: Column[];
  onClose: () => void;
  onSave: (task: Task) => void;
};

function cleanedSubtasks(subtasks: Subtask[]) {
  return subtasks
    .map((subtask) => ({ ...subtask, title: subtask.title.trim() }))
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
  const modalRef = useModalAccessibility<HTMLFormElement>(isOpen, onClose);

  useEffect(() => {
    if (!isOpen || !task) return;

    setTitle(task.title);
    setDescription(task.description);
    setSubtasks(task.subtasks);
    setStatus(task.status);
    setTitleError("");
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const currentTask = task;

  const hasChanges =
    JSON.stringify({
      title: title.trim(),
      description: description.trim(),
      status,
      subtasks: cleanedSubtasks(subtasks),
    }) !==
    JSON.stringify({
      title: currentTask.title.trim(),
      description: currentTask.description.trim(),
      status: currentTask.status,
      subtasks: cleanedSubtasks(currentTask.subtasks),
    });

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setTitleError("Task title cannot be empty.");
      return;
    }

    if (!hasChanges) return;

    onSave({
      ...currentTask,
      title: title.trim(),
      description: description.trim(),
      status,
      subtasks: cleanedSubtasks(subtasks),
    });

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <form
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-[480px] overflow-y-auto rounded-md bg-white p-5 outline-none dark:bg-[#2b2c37] sm:max-h-[90dvh] sm:p-6 md:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="edit-task-title"
            className="text-lg font-bold text-[#000112] dark:text-white"
          >
            Edit Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel editing task"
            className="text-[#828fa3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7]"
          >
            <FiX size={20} />
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
            className="mt-2 h-10 w-full rounded border border-[#828fa3]/25 bg-white px-4 text-sm text-[#000112] outline-none focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white"
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
            className="mt-2 min-h-24 w-full resize-none rounded border border-[#828fa3]/25 bg-white px-4 py-3 text-sm text-[#000112] outline-none focus:border-[#635fc7] dark:bg-[#2b2c37] dark:text-white"
          />
        </label>

        <p className="mt-6 text-xs font-bold text-[#828fa3]">Subtasks</p>

        <div className="mt-2 space-y-3">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-3">
              <input
                type="text"
                value={subtask.title}
                onChange={(event) =>
                  setSubtasks((current) =>
                    current.map((item) =>
                      item.id === subtask.id
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
                  setSubtasks((current) =>
                    current.filter((item) => item.id !== subtask.id),
                  )
                }
                className="text-[#828fa3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635fc7]"
              >
                <Image src={crossIcon} width={15} height={15} alt="" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setSubtasks((current) => [
              ...current,
              { id: createId(), title: "", isCompleted: false },
            ])
          }
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7]"
        >
          <FiPlus size={16} />
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

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-full bg-[#635fc7]/10 text-xs font-bold text-[#635fc7]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!hasChanges || !title.trim()}
            className="h-10 flex-1 rounded-full bg-[#635fc7] text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-[#635fc7]/40"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}