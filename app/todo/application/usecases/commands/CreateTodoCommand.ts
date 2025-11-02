import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '@/todo/application/ports/TodoRepository';
import { Todo } from '@/todo/domain/entities/Todo';
import { TodoValidationService } from '@/todo/application/services/TodoValidationService';

export interface CreateTodoPayload {
  title: string;
  description: string;
  userId: string;
  dueDate?: Date;
}

@injectable()
export class CreateTodoCommand {
  constructor(
    @inject(TodoRepositoryToken) private todoRepository: TodoRepository
  ) {}

  async execute(payload: CreateTodoPayload): Promise<Todo> {
    // Validate payload
    TodoValidationService.validateCreatePayload(
      payload.title,
      payload.description,
      payload.dueDate
    );

    // Create todo
    const todo = await this.todoRepository.create({
      title: payload.title,
      description: payload.description,
      userId: payload.userId,
      isCompleted: false,
      dueDate: payload.dueDate,
    });

    return todo;
  }
}
