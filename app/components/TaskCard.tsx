type Subtask = {
  id: string;
  title: string;
  isCompleted: boolean;
};

type TaskCardProps = {
  title: string;
  subtasks: Subtask[];
  onClick: () => void;
};

export default function TaskCard({
  title,
  subtasks,
  onClick,
}: TaskCardProps) {
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.isCompleted,
  ).length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-md bg-white p-4 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] dark:bg-[#2b2c37]"
    >
      <h3 className="text-sm font-bold text-[#000112] dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs font-bold text-[#828fa3]">
        {completedSubtasks} of {subtasks.length} subtasks
      </p>
    </button>
  );
}