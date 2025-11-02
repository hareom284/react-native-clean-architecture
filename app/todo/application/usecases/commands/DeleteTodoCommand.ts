import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '@/todo/application/ports/TodoRepository';

@injectable()
export class DeleteTodoCommand {
  constructor(
    @inject(TodoRepositoryToken) private todoRepository: TodoRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
