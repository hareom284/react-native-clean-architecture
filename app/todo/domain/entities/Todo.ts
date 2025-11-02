import { BaseEntity } from '@/core/domain/entities/BaseEntity';

export interface Todo extends BaseEntity {
  title: string;
  description: string;
  isCompleted: boolean;
  userId: string;
  dueDate?: Date;
}
