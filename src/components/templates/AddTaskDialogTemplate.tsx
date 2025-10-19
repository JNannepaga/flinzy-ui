import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import TaskForm from "../organisms/TaskForm";

interface AddTaskDialogTemplateProps {
  open: boolean;
  onClose: () => void;
  formProps: any;
}

const AddTaskDialogTemplate: React.FC<AddTaskDialogTemplateProps> = ({
  open,
  onClose,
  formProps,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Add New Task</DialogTitle>
    <DialogContent>
      <TaskForm {...formProps} />
    </DialogContent>
  </Dialog>
);

export default AddTaskDialogTemplate;
