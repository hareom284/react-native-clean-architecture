import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '@/todo/application/ports/TodoRepository';
import { Todo } from '@/todo/domain/entities/Todo';
import { TodoValidationService } from '@/todo/application/services/TodoValidationService';

export interface UpdateTodoPayload {
  id: string;
  title?: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: Date;
}

@injectable()
export class UpdateTodoCommand {
  constructor(
    @inject(TodoRepositoryToken) private todoRepository: TodoRepository
  ) {}

  async execute(payload: UpdateTodoPayload): Promise<Todo> {
    // Validate payload
    TodoValidationService.validateUpdatePayload(
      payload.title,
      payload.description,
      payload.dueDate
    );

    // Get existing todo
    const existingTodo = await this.todoRepository.getById(payload.id);

    // Update todo
    const updatedTodo: Todo = {
      ...existingTodo,
      title: payload.title ?? existingTodo.title,
      description: payload.description ?? existingTodo.description,
      isCompleted: payload.isCompleted ?? existingTodo.isCompleted,
      dueDate: payload.dueDate ?? existingTodo.dueDate,
      updatedAt: new Date(),
    };

    return this.todoRepository.update(updatedTodo);
  }
}
