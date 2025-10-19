export interface TaskItemDto {
  id: string;
  name: string;
  description?: string;
  deadline?: string;
  isCompleted: boolean;
  status: number;
  createdAt: string;
}
