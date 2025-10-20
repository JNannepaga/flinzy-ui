import React from "react";
import { Card, CardContent, Typography, Chip } from "@mui/material";
import type { TaskItemDto } from "../../types/TaskItemDto";

interface TaskCardProps {
  task: TaskItemDto;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => (
  <Card variant="outlined" sx={{ mb: 2, height: 200, maxHeight: 200 }}>
    <CardContent>
      <Typography variant="h6">{task.name}</Typography>
      <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={{ __html: task.description || "" }} />
      <Typography variant="caption" color="text.secondary">
        Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
      </Typography>
      {task.isCompleted && <Chip label="Completed" color="success" size="small" sx={{ ml: 1 }} />}
    </CardContent>
  </Card>
);

export default TaskCard;