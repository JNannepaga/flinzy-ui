import { Button } from "@mui/material";
import React from "react";

interface PrimaryButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text, onClick, disabled }) => (
  <Button variant="contained" color="primary" onClick={onClick} disabled={disabled}>
    {text}
  </Button>
);

export default PrimaryButton;
