import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AddTaskDialogTemplate from "../templates/AddTaskDialogTemplate";
import AddButton from "../atoms/AddButton";
import TasksPage from "../templates/TasksPage";
import type { TaskItemDto } from "../../types/TaskItemDto";

const BoardPage: React.FC = () => {
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskItemDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ name: "", description: "", deadline: null });

  
  const fetchTasks = useCallback(async () => {
    
    try {
      setLoading(true);
      const response = await axios.get<TaskItemDto[]>("https://localhost:7250/api/tasks/GetAllTasks");
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
    
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    
    setLoading(true);

    try {
      await axios.post("https://localhost:7250/api/tasks", formData);
      fetchTasks();
      setDialogOpen(false);
    } catch (err) {
      console.error("Error creating task", err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AddTaskDialogTemplate
        open={dialogOpen}
        onClose={()=>{setDialogOpen(false)}}
        formProps={{
          ...formData,
          onChange: handleChange,
          onSubmit: handleSubmit,
          onCancel: ()=>{setDialogOpen(false)},
          loading,
        }}
      />
      <TasksPage tasks={tasks} loading={loading} onAddTask={() => setDialogOpen(true)} refresh={fetchTasks} onSortEnd={(sortedTasks)=>{setTasks(sortedTasks)}}/>
    </>
  );
};

export default BoardPage;
