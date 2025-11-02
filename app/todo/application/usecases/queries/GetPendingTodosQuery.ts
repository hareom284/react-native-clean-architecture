import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '@/todo/application/ports/TodoRepository';
import { Todo } from '@/todo/domain/entities/Todo';

@injectable()
export class GetPendingTodosQuery {
  constructor(
    @inject(TodoRepositoryToken) private todoRepository: TodoRepository
  ) {}

  async execute(): Promise<Todo[]> {
    return this.todoRepository.getPending();
  }
}
