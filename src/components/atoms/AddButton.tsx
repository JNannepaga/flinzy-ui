import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AddButtonProps {
  onClick: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <Button
      color="primary"
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={{
        height: 40,
        my: 2,
        bgcolor: '#386641',
      }}
    >
      Add Task
    </Button>
  );
};

export default AddButton;