import { getModuleContainer, module } from 'inversiland';
import { TodoRepositoryToken } from '@/todo/application/ports/TodoRepository';
import { TodoRepositoryImpl } from '@/todo/infrastructure/repositories/TodoRepositoryImpl';
import { TodoApi } from '@/todo/infrastructure/api/TodoApi';
import { CreateTodoCommand } from '@/todo/application/usecases/commands/CreateTodoCommand';
import { UpdateTodoCommand } from '@/todo/application/usecases/commands/UpdateTodoCommand';
import { DeleteTodoCommand } from '@/todo/application/usecases/commands/DeleteTodoCommand';
import { ToggleTodoCommand } from '@/todo/application/usecases/commands/ToggleTodoCommand';
import { GetAllTodosQuery } from '@/todo/application/usecases/queries/GetAllTodosQuery';
import { GetTodoByIdQuery } from '@/todo/application/usecases/queries/GetTodoByIdQuery';
import { GetCompletedTodosQuery } from '@/todo/application/usecases/queries/GetCompletedTodosQuery';
import { GetPendingTodosQuery } from '@/todo/application/usecases/queries/GetPendingTodosQuery';
import { RootTodoUseCase } from '@/todo/application/usecases/RootTodoUseCase';

@module({
  providers: [
    // API
    TodoApi,

    // Repository (Port Implementation)
    {
      provide: TodoRepositoryToken,
      useClass: TodoRepositoryImpl,
    },

    // Commands
    CreateTodoCommand,
    UpdateTodoCommand,
    DeleteTodoCommand,
    ToggleTodoCommand,

    // Queries
    GetAllTodosQuery,
    GetTodoByIdQuery,
    GetCompletedTodosQuery,
    GetPendingTodosQuery,

    // Root UseCase
    RootTodoUseCase,
  ],
})
export class TodoModule {}

export const todoModuleContainer = getModuleContainer(TodoModule);
