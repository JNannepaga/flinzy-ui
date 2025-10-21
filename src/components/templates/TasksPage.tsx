import React, { useRef } from "react";
import TaskList from "../molecules/TaskList";
//import TaskList from "../Flinz/TaskList";
import { Container, Typography, CircularProgress, Box, Grid, Paper } from "@mui/material";
import type { TaskItemDto, Status } from "../../types/TaskItemDto";
import AddButton from "../atoms/AddButton";

interface TasksPageProps {
  tasks: TaskItemDto[];
  onAddTask: () => void;
  loading: boolean;
  error?: string;
  refresh: () => void;
  onSortEnd: (sortedTasks: TaskItemDto[]) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ tasks, loading, error, onAddTask, onSortEnd }) => {

  const containerRefs = {
    todo: useRef<HTMLDivElement | null>(null),
    inProgress: useRef<HTMLDivElement | null>(null),
    done: useRef<HTMLDivElement | null>(null),
  };
  const todoTasks = tasks.filter((task) => task.status === "ToDo");
  const inProgressTasks = tasks.filter((task) => task.status === "InProgress");
  const doneTasks = tasks.filter((task) => task.status === "Done");

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
        <Grid container spacing={3} minHeight={(todoTasks.length + 2) * 220}>
          <Grid size={{xs:12, md:4}}>
            <Box component={"div"} ref={containerRefs.todo} width={"100%"} height={"100%"}>
                <Paper sx={{ p: 2, height: '100%', bgcolor: '#0F4A6F' }}>
                  <Typography variant="h6" gutterBottom>To Do</Typography>
                  <div>
                    <AddButton onClick={onAddTask} />
                  </div>
                  <TaskList tasks={todoTasks} onDragEnd={(sortedTasks)=>{onSortEnd(sortedTasks)}}/>
                </Paper>
            </Box>
          </Grid>
          
          <Grid size={{xs:12, md:4}}>
            <Box component={"div"} ref={containerRefs.inProgress} width={"100%"} height={"100%"}>
              <Paper sx={{ p: 2, height: '100%', bgcolor: '#EB9830' }}>
                <Typography variant="h6" gutterBottom>In Progress</Typography>
                <TaskList tasks={inProgressTasks} onDragEnd={(sortedTasks)=>{onSortEnd(sortedTasks)}} />
              </Paper>
            </Box>
          </Grid>

          <Grid size={{xs:12, md:4}}>
            <Paper sx={{ p: 2, height: '100%', bgcolor: '#16796F' }}>
              <Typography variant="h6" gutterBottom>Done</Typography>
              <TaskList tasks={doneTasks} onDragEnd={(sortedTasks)=>{onSortEnd(sortedTasks)}} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default TasksPage;