export interface TodoResponseDto {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  userId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
