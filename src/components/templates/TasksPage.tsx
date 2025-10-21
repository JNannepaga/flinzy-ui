import React, { useEffect, useRef, useState } from "react";
import TaskList from "../molecules/TaskList";
import { Container, Typography, CircularProgress, Box, Grid, Paper } from "@mui/material";
import type { TaskItemDto, Status } from "../../types/TaskItemDto";
import AddButton from "../atoms/AddButton";

interface TasksPageProps {
  tasks: TaskItemDto[];
  loading: boolean;
  error?: string;
  refresh: () => void;
  onAddTask: () => void;
  onSortEnd: (sortedTasks: TaskItemDto[]) => void;
}

export type TaskContainerRefs = {
  ToDo: React.RefObject<HTMLDivElement | null>;
  InProgress: React.RefObject<HTMLDivElement | null>;
  Done: React.RefObject<HTMLDivElement | null>;
};

export type DraggedTaskInfo = {
  task: TaskItemDto;
  fromStatus: Status;
};

const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  loading,
  error,
  onAddTask,
  onSortEnd,
}) => {
  // Container refs
  const containerRefs: TaskContainerRefs = { 
    ToDo: useRef<HTMLDivElement | null>(null), 
    InProgress: useRef<HTMLDivElement | null>(null), 
    Done: useRef<HTMLDivElement | null>(null)
  };

  // Local state split by status
  const [todoTasks, setTodoTasks] = useState<TaskItemDto[]>(
    tasks.filter((t) => t.status === "ToDo")
  );
  const [inProgressTasks, setInProgressTasks] = useState<TaskItemDto[]>(
    tasks.filter((t) => t.status === "InProgress")
  );
  const [doneTasks, setDoneTasks] = useState<TaskItemDto[]>(
    tasks.filter((t) => t.status === "Done")
  );

  const [draggedTaskInfo, setDraggedTaskInfo] = useState<DraggedTaskInfo | null>(null);

  useEffect(() => {
    setTodoTasks(tasks.filter((t) => t.status === "ToDo"));
    setInProgressTasks(tasks.filter((t) => t.status === "InProgress"));
    setDoneTasks(tasks.filter((t) => t.status === "Done"));
  }, [tasks]);

  const handleReorder = (status: Status, updatedTasks: TaskItemDto[]) => {
    if (status === 'ToDo') setTodoTasks(updatedTasks);
    if (status === "InProgress") setInProgressTasks(updatedTasks);
    if (status === "Done") setDoneTasks(updatedTasks);
  };

const handleMoveToAnotherContainer = (
  from: Status,
  to: Status,
  task: TaskItemDto
) => {
  // Skip if the task is dropped in the same column
  if (from === to) return;

  setDraggedTaskInfo({ task, fromStatus: from });
  // Helper to safely remove task from a list
  const removeTask = (list: TaskItemDto[]) =>
    list.filter((t) => t.id !== task.id);

  // Helper to safely add to list (avoid duplicates)
  const addTask = (list: TaskItemDto[]) => {
    if (list.some((t) => t.id === task.id)) return list; // already present
    return [...list, { ...task, status: to }];
  };

  // Update both columns atomically
  setTodoTasks((prev) => {
    if (from === "ToDo") return removeTask(prev);
    if (to === "ToDo") return addTask(prev);
    return prev;
  });

  setInProgressTasks((prev) => {
    if (from === "InProgress") return removeTask(prev);
    if (to === "InProgress") return addTask(prev);
    return prev;
  });

  setDoneTasks((prev) => {
    if (from === "Done") return removeTask(prev);
    if (to === "Done") return addTask(prev);
    return prev;
  });
};

  return (
    <>
      <Typography variant="h4" textAlign="center" my={5} gutterBottom>
        Task Board
      </Typography>
      
      <AddButton onClick={onAddTask} />

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <Grid container spacing={3} minHeight={(tasks.length + 2) * 220}>
          {/* To Do Column */}
          <Grid size={{xs:12, md:4}}>
            <Box ref={containerRefs.ToDo} width="100%" height="100%">
              <Paper sx={{ p: 2, height: "100%", bgcolor: "#0F4A6F" }}>
                <Typography variant="h6" gutterBottom>
                  To Do
                </Typography>
                <TaskList
                  tasks={todoTasks}
                  status="ToDo"
                  containerRefs={containerRefs}
                  onDragEnd={handleReorder}
                  newElementDragged = {draggedTaskInfo?.task.status === "ToDo" ? draggedTaskInfo : null }
                  onMoveToAnotherContainer={handleMoveToAnotherContainer}
                />
              </Paper>
            </Box>
          </Grid>

          {/* In Progress Column */}
          <Grid size={{xs:12, md:4}}>
            <Box ref={containerRefs.InProgress} width="100%" height="100%">
              <Paper sx={{ p: 2, height: "100%", bgcolor: "#EB9830" }}>
                <Typography variant="h6" gutterBottom>
                  In Progress
                </Typography>
                <TaskList
                  tasks={inProgressTasks}
                  status="InProgress"
                  containerRefs={containerRefs}
                  onDragEnd={handleReorder}
                  newElementDragged = {draggedTaskInfo?.task.status === "InProgress" ? draggedTaskInfo : null }
                  onMoveToAnotherContainer={handleMoveToAnotherContainer}
                />
              </Paper>
            </Box>
          </Grid>

          {/* Done Column */}
          <Grid size={{xs:12, md:4}}>
            <Box ref={containerRefs.Done} width="100%" height="100%">
              <Paper sx={{ p: 2, height: "100%", bgcolor: "#16796F" }}>
                <Typography variant="h6" gutterBottom>
                  Done
                </Typography>
                <TaskList
                  tasks={doneTasks}
                  status="Done"
                  containerRefs={containerRefs}
                  onDragEnd={handleReorder}
                  newElementDragged = {draggedTaskInfo?.task.status === "Done" ? draggedTaskInfo : null }
                  onMoveToAnotherContainer={handleMoveToAnotherContainer}
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default TasksPage;