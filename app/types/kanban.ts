export type Column = {
  id: string;
  name: string;
};

export type Subtask = {
  id: string;
  title: string;
  isCompleted: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: Subtask[];
};

export type Board = {
  name: string;
  href: string;
  columns: Column[];
  tasks: Task[];
};

export type UpdatedBoard = {
  name: string;
  columns: Column[];
};