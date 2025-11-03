import { RootTodoUseCase } from '@/todo/application/usecases/RootTodoUseCase';
import { CreateTodoCommand } from '@/todo/application/usecases/commands/CreateTodoCommand';
import { UpdateTodoCommand } from '@/todo/application/usecases/commands/UpdateTodoCommand';
import { DeleteTodoCommand } from '@/todo/application/usecases/commands/DeleteTodoCommand';
import { ToggleTodoCommand } from '@/todo/application/usecases/commands/ToggleTodoCommand';
import { GetAllTodosQuery } from '@/todo/application/usecases/queries/GetAllTodosQuery';
import { GetTodoByIdQuery } from '@/todo/application/usecases/queries/GetTodoByIdQuery';
import { GetCompletedTodosQuery } from '@/todo/application/usecases/queries/GetCompletedTodosQuery';
import { GetPendingTodosQuery } from '@/todo/application/usecases/queries/GetPendingTodosQuery';
import { Todo } from '@/todo/domain/entities/Todo';

// Mock commands and queries
const mockCreateCmd = { execute: jest.fn() } as unknown as CreateTodoCommand;
const mockUpdateCmd = { execute: jest.fn() } as unknown as UpdateTodoCommand;
const mockDeleteCmd = { execute: jest.fn() } as unknown as DeleteTodoCommand;
const mockToggleCmd = { execute: jest.fn() } as unknown as ToggleTodoCommand;
const mockGetAllQuery = { execute: jest.fn() } as unknown as GetAllTodosQuery;
const mockGetByIdQuery = { execute: jest.fn() } as unknown as GetTodoByIdQuery;
const mockGetCompletedQuery = { execute: jest.fn() } as unknown as GetCompletedTodosQuery;
const mockGetPendingQuery = { execute: jest.fn() } as unknown as GetPendingTodosQuery;

describe('RootTodoUseCase', () => {
  let rootUseCase: RootTodoUseCase;
  const mockTodo: Todo = {
    id: '123',
    title: 'Test todo',
    description: 'Test description',
    isCompleted: false,
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    rootUseCase = new RootTodoUseCase(
      mockCreateCmd,
      mockUpdateCmd,
      mockDeleteCmd,
      mockToggleCmd,
      mockGetAllQuery,
      mockGetByIdQuery,
      mockGetCompletedQuery,
      mockGetPendingQuery
    );
    jest.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should delegate to CreateTodoCommand', async () => {
      (mockCreateCmd.execute as jest.Mock).mockResolvedValue(mockTodo);

      const payload = {
        title: 'New todo',
        description: 'Description',
        userId: 'user1',
      };
      const result = await rootUseCase.createTodo(payload);

      expect(mockCreateCmd.execute).toHaveBeenCalledWith(payload);
      expect(mockCreateCmd.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTodo);
    });

    it('should propagate errors from CreateTodoCommand', async () => {
      const error = new Error('Create failed');
      (mockCreateCmd.execute as jest.Mock).mockRejectedValue(error);

      await expect(
        rootUseCase.createTodo({
          title: 'New todo',
          description: 'Description',
          userId: 'user1',
        })
      ).rejects.toThrow('Create failed');
    });
  });

  describe('updateTodo', () => {
    it('should delegate to UpdateTodoCommand', async () => {
      (mockUpdateCmd.execute as jest.Mock).mockResolvedValue(mockTodo);

      const payload = { id: '123', title: 'Updated' };
      const result = await rootUseCase.updateTodo(payload);

      expect(mockUpdateCmd.execute).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockTodo);
    });

    it('should propagate errors from UpdateTodoCommand', async () => {
      const error = new Error('Update failed');
      (mockUpdateCmd.execute as jest.Mock).mockRejectedValue(error);

      await expect(
        rootUseCase.updateTodo({ id: '123', title: 'Updated' })
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteTodo', () => {
    it('should delegate to DeleteTodoCommand', async () => {
      (mockDeleteCmd.execute as jest.Mock).mockResolvedValue(undefined);

      await rootUseCase.deleteTodo('123');

      expect(mockDeleteCmd.execute).toHaveBeenCalledWith('123');
      expect(mockDeleteCmd.execute).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from DeleteTodoCommand', async () => {
      const error = new Error('Delete failed');
      (mockDeleteCmd.execute as jest.Mock).mockRejectedValue(error);

      await expect(rootUseCase.deleteTodo('123')).rejects.toThrow('Delete failed');
    });
  });

  describe('toggleTodo', () => {
    it('should delegate to ToggleTodoCommand', async () => {
      const toggledTodo = { ...mockTodo, isCompleted: true };
      (mockToggleCmd.execute as jest.Mock).mockResolvedValue(toggledTodo);

      const result = await rootUseCase.toggleTodo('123');

      expect(mockToggleCmd.execute).toHaveBeenCalledWith('123');
      expect(result.isCompleted).toBe(true);
    });

    it('should propagate errors from ToggleTodoCommand', async () => {
      const error = new Error('Toggle failed');
      (mockToggleCmd.execute as jest.Mock).mockRejectedValue(error);

      await expect(rootUseCase.toggleTodo('123')).rejects.toThrow('Toggle failed');
    });
  });

  describe('getAllTodos', () => {
    it('should delegate to GetAllTodosQuery', async () => {
      const todos = [mockTodo];
      (mockGetAllQuery.execute as jest.Mock).mockResolvedValue(todos);

      const result = await rootUseCase.getAllTodos();

      expect(mockGetAllQuery.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(todos);
    });

    it('should propagate errors from GetAllTodosQuery', async () => {
      const error = new Error('Fetch failed');
      (mockGetAllQuery.execute as jest.Mock).mockRejectedValue(error);

      await expect(rootUseCase.getAllTodos()).rejects.toThrow('Fetch failed');
    });
  });

  describe('getTodoById', () => {
    it('should delegate to GetTodoByIdQuery', async () => {
      (mockGetByIdQuery.execute as jest.Mock).mockResolvedValue(mockTodo);

      const result = await rootUseCase.getTodoById('123');

      expect(mockGetByIdQuery.execute).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockTodo);
    });

    it('should propagate errors from GetTodoByIdQuery', async () => {
      const error = new Error('Not found');
      (mockGetByIdQuery.execute as jest.Mock).mockRejectedValue(error);

      await expect(rootUseCase.getTodoById('999')).rejects.toThrow('Not found');
    });
  });

  describe('getCompletedTodos', () => {
    it('should delegate to GetCompletedTodosQuery', async () => {
      const completedTodos = [{ ...mockTodo, isCompleted: true }];
      (mockGetCompletedQuery.execute as jest.Mock).mockResolvedValue(completedTodos);

      const result = await rootUseCase.getCompletedTodos();

      expect(mockGetCompletedQuery.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(completedTodos);
    });

    it('should propagate errors from GetCompletedTodosQuery', async () => {
      const error = new Error('Fetch failed');
      (mockGetCompletedQuery.execute as jest.Mock).mockRejectedValue(error);

      await expect(rootUseCase.getCompletedTodos()).rejects.toThrow('Fetch failed');
    });
  });

  describe('getPendingTodos', () => {
    it('should delegate to GetPendingTodosQuery', async () => {
      const pendingTodos = [mockTodo];
      (mockGetPendingQuery.execute as jest.Mock).mockResolvedValue(pendingTodos);

      const result = await rootUseCase.getPendingTodos();

      expect(mockGetPendingQuery.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(pendingTodos);
    });

    it('should propagate errors from GetPendingTodosQuery', async () => {
      const error = new Error('Fetch failed');
      (mockGetPendingQuery.execute as jest.Mock).mockRejectedValue(error);

      await expect(rootUseCase.getPendingTodos()).rejects.toThrow('Fetch failed');
    });
  });
});
