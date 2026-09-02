import type { Board, Column, Subtask, Task } from "@/app/types/kanban";

export const BOARDS_STORAGE_KEY = "kanban-boards-v2";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createColumn(name: string): Column {
  return {
    id: createId(),
    name,
  };
}

function normalizeSubtask(value: unknown): Subtask | null {
  if (!isRecord(value) || typeof value.title !== "string") return null;

  return {
    id: typeof value.id === "string" ? value.id : createId(),
    title: value.title,
    isCompleted: value.isCompleted === true,
  };
}

function normalizeTask(value: unknown, columns: Column[]): Task | null {
  if (!isRecord(value) || typeof value.title !== "string") return null;

  const savedStatus = typeof value.status === "string" ? value.status : "";

  const matchingColumn = columns.find(
    (column) => column.id === savedStatus || column.name === savedStatus,
  );

  const subtasks = Array.isArray(value.subtasks)
    ? value.subtasks
        .map(normalizeSubtask)
        .filter((subtask): subtask is Subtask => subtask !== null)
    : [];

  return {
    id: typeof value.id === "string" ? value.id : createId(),
    title: value.title,
    description: typeof value.description === "string" ? value.description : "",
    status: matchingColumn?.id ?? columns[0]?.id ?? "",
    subtasks,
  };
}

function normalizeBoard(value: unknown): Board | null {
  if (
    !isRecord(value) ||
    typeof value.name !== "string" ||
    typeof value.href !== "string"
  ) {
    return null;
  }

  const columns = Array.isArray(value.columns)
    ? value.columns
        .map((column) => {
          if (typeof column === "string") {
            return createColumn(column);
          }

          if (
            isRecord(column) &&
            typeof column.name === "string" &&
            column.name.trim()
          ) {
            return {
              id: typeof column.id === "string" ? column.id : createId(),
              name: column.name,
            };
          }

          return null;
        })
        .filter((column): column is Column => column !== null)
    : [];

  const tasks = Array.isArray(value.tasks)
    ? value.tasks
        .map((task) => normalizeTask(task, columns))
        .filter((task): task is Task => task !== null)
    : [];

  return {
    name: value.name,
    href: value.href,
    columns,
    tasks,
  };
}

export function loadBoards(fallbackBoards: Board[]): Board[] {
  try {
    const savedBoards = window.localStorage.getItem(BOARDS_STORAGE_KEY);

    if (!savedBoards) return fallbackBoards;

    const parsedBoards: unknown = JSON.parse(savedBoards);

    if (!Array.isArray(parsedBoards)) return fallbackBoards;

    const boards = parsedBoards
      .map(normalizeBoard)
      .filter((board): board is Board => board !== null);

    return boards.length > 0 ? boards : fallbackBoards;
  } catch {
    return fallbackBoards;
  }
}

export function saveBoards(boards: Board[]) {
  try {
    window.localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(boards));
  } catch {
    // The app still works during this session if browser storage is unavailable.
  }
}