import { injectable, inject } from 'inversiland';
import { CreateTodoCommand, CreateTodoPayload } from '@/todo/application/usecases/commands/CreateTodoCommand';
import { UpdateTodoCommand, UpdateTodoPayload } from '@/todo/application/usecases/commands/UpdateTodoCommand';
import { DeleteTodoCommand } from '@/todo/application/usecases/commands/DeleteTodoCommand';
import { ToggleTodoCommand } from '@/todo/application/usecases/commands/ToggleTodoCommand';
import { GetAllTodosQuery } from '@/todo/application/usecases/queries/GetAllTodosQuery';
import { GetTodoByIdQuery } from '@/todo/application/usecases/queries/GetTodoByIdQuery';
import { GetCompletedTodosQuery } from '@/todo/application/usecases/queries/GetCompletedTodosQuery';
import { GetPendingTodosQuery } from '@/todo/application/usecases/queries/GetPendingTodosQuery';
import { Todo } from '@/todo/domain/entities/Todo';

/**
 * Root UseCase that orchestrates all todo operations
 * This is the single entry point for todo-related business logic
 */
@injectable()
export class RootTodoUseCase {
  constructor(
    // Commands
    @inject(CreateTodoCommand) private createTodoCmd: CreateTodoCommand,
    @inject(UpdateTodoCommand) private updateTodoCmd: UpdateTodoCommand,
    @inject(DeleteTodoCommand) private deleteTodoCmd: DeleteTodoCommand,
    @inject(ToggleTodoCommand) private toggleTodoCmd: ToggleTodoCommand,

    // Queries
    @inject(GetAllTodosQuery) private getAllTodosQuery: GetAllTodosQuery,
    @inject(GetTodoByIdQuery) private getTodoByIdQuery: GetTodoByIdQuery,
    @inject(GetCompletedTodosQuery) private getCompletedTodosQuery: GetCompletedTodosQuery,
    @inject(GetPendingTodosQuery) private getPendingTodosQuery: GetPendingTodosQuery,
  ) {}

  // Command operations (writes)
  async createTodo(payload: CreateTodoPayload): Promise<Todo> {
    return this.createTodoCmd.execute(payload);
  }

  async updateTodo(payload: UpdateTodoPayload): Promise<Todo> {
    return this.updateTodoCmd.execute(payload);
  }

  async deleteTodo(id: string): Promise<void> {
    return this.deleteTodoCmd.execute(id);
  }

  async toggleTodo(id: string): Promise<Todo> {
    return this.toggleTodoCmd.execute(id);
  }

  // Query operations (reads)
  async getAllTodos(): Promise<Todo[]> {
    return this.getAllTodosQuery.execute();
  }

  async getTodoById(id: string): Promise<Todo> {
    return this.getTodoByIdQuery.execute(id);
  }

  async getCompletedTodos(): Promise<Todo[]> {
    return this.getCompletedTodosQuery.execute();
  }

  async getPendingTodos(): Promise<Todo[]> {
    return this.getPendingTodosQuery.execute();
  }
}
