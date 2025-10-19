import React from "react";
import TaskFieldGroup from "../molecules/TaskFieldGroup";
import PrimaryButton from "../atoms/PrimaryButton";
import { Box, Button } from "@mui/material";
import type { PickerValue } from "@mui/x-date-pickers/internals";

interface TaskFormProps {
  name: string;
  description: string;
  deadline: PickerValue | null;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  name,
  description,
  deadline,
  onChange,
  onSubmit,
  onCancel,
  loading,
}) => (
  <Box>
    <TaskFieldGroup
      name={name}
      onNameChange={(v) => onChange("name", v)}
      description={description}
      onDescriptionChange={(v) => onChange("description", v)}
      deadline={deadline}
      onDeadlineChange={(v) => onChange("deadline", v)}
    />
    <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
      <Button onClick={onCancel} color="secondary">Cancel</Button>
      <PrimaryButton text={loading ? "Saving..." : "Add Task"} onClick={onSubmit} disabled={loading} />
    </Box>
  </Box>
);

export default TaskForm;