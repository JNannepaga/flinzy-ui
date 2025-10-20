export type Status = "ToDo" | "InProgress" | "Done";

export interface TaskItemDto {
  id: string;
  name: string;
  description?: string;
  deadline?: string;
  isCompleted: boolean;
  status: Status;
  createdAt: string;
}