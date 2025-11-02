import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '@/todo/application/ports/TodoRepository';
import { Todo } from '@/todo/domain/entities/Todo';

@injectable()
export class GetTodoByIdQuery {
  constructor(
    @inject(TodoRepositoryToken) private todoRepository: TodoRepository
  ) {}

  async execute(id: string): Promise<Todo> {
    return this.todoRepository.getById(id);
  }
}
