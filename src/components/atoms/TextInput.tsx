import { TextField } from "@mui/material";
import React from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, required }) => (
  <TextField
    label={label}
    fullWidth
    required={required}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default TextInput;