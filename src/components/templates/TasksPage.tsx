import React from "react";
import TaskList from "../molecules/TaskList";
import { Container, Typography, CircularProgress, Box, Grid, Paper } from "@mui/material";
import type { TaskItemDto } from "../../types/TaskItemDto";
import AddButton from "../atoms/AddButton";

interface TasksPageProps {
  tasks: TaskItemDto[];
  onAddTask: () => void;
  loading: boolean;
  error?: string;
  refresh: () => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ tasks, loading, error, onAddTask }) => {
  const todoTasks = tasks.filter((task) => task.status === 0);
  const inProgressTasks = tasks.filter((task) => task.status === 1);
  const doneTasks = tasks.filter((task) => task.status === 2);

  return (
    <>
      <Typography variant="h4" textAlign={"center"} my={5} gutterBottom>
        Task Board
      </Typography>
      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress/>
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <Grid container spacing={3} minHeight={700}>
          <Grid size={{xs:12, md:4}}>
            <Paper sx={{ p: 2, height: '100%', bgcolor: 'skyblue' }}>
              <Typography variant="h6" gutterBottom>To Do</Typography>
              <div>
                <AddButton onClick={onAddTask} />
              </div>
              <TaskList tasks={todoTasks} />
            </Paper>
          </Grid>

          <Grid size={{xs:12, md:4}}>
            <Paper sx={{ p: 2, height: '100%', bgcolor: '#FFC067' }}>
              <Typography variant="h6" gutterBottom>In Progress</Typography>
              <TaskList tasks={inProgressTasks} />
            </Paper>
          </Grid>

          <Grid size={{xs:12, md:4}}>
            <Paper sx={{ p: 2, height: '100%', bgcolor: '#b8d8be' }}>
              <Typography variant="h6" gutterBottom>Done</Typography>
              <TaskList tasks={doneTasks} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default TasksPage;