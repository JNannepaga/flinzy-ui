import React from "react";
import TaskCard from "../atoms/TaskCard";
import type { TaskItemDto } from "../../types/TaskItemDto";

interface TaskListProps {
  tasks: TaskItemDto[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (!tasks || tasks.length === 0) return <p>No tasks available</p>;

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;