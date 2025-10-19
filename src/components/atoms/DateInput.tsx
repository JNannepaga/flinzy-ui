import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import type { PickerValue } from "@mui/x-date-pickers/internals";

interface DateInputProps {
  label: string;
  value: PickerValue | null;
  onChange: (date: PickerValue | null) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker label={label} value={value} onChange={onChange} />
  </LocalizationProvider>
);

export default DateInput;