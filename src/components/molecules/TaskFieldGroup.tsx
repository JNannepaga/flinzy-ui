import React from "react";
import { Box } from "@mui/material";
import TextInput from "../atoms/TextInput";
import DateInput from "../atoms/DateInput";
import RichTextEditor from "../atoms/RichTextEditor";
import type { PickerValue } from "@mui/x-date-pickers/internals";

interface TaskFieldGroupProps {
  name: string;
  onNameChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  deadline: PickerValue | null;
  onDeadlineChange: (v: PickerValue | null) => void;
}

const TaskFieldGroup: React.FC<TaskFieldGroupProps> = ({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  deadline,
  onDeadlineChange,
}) => (
  <Box display="flex" flexDirection="column" gap={3} mt={1}>
    <TextInput label="Task Name" value={name} onChange={onNameChange} required />
    <div>
      <label style={{ fontWeight: 500, marginBottom: 8, display: "block" }}>Description</label>
      <RichTextEditor value={description} onChange={onDescriptionChange} />
    </div>
    <DateInput label="Deadline" value={deadline} onChange={onDeadlineChange} />
  </Box>
);

export default TaskFieldGroup;