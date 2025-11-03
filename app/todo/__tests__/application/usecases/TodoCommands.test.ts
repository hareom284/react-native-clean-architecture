import { CreateTodoCommand } from '@/todo/application/usecases/commands/CreateTodoCommand';
import { UpdateTodoCommand } from '@/todo/application/usecases/commands/UpdateTodoCommand';
import { DeleteTodoCommand } from '@/todo/application/usecases/commands/DeleteTodoCommand';
import { ToggleTodoCommand } from '@/todo/application/usecases/commands/ToggleTodoCommand';
import { TodoRepository } from '@/todo/application/ports/TodoRepository';
import { Todo } from '@/todo/domain/entities/Todo';
import { ValidationError } from '@/core/domain/errors/ValidationError';

// Mock TodoRepository
class MockTodoRepository implements TodoRepository {
  getAll = jest.fn();
  getById = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  toggle = jest.fn();
  getCompleted = jest.fn();
  getPending = jest.fn();
}

describe('Todo Commands', () => {
  let mockRepository: MockTodoRepository;
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
    mockRepository = new MockTodoRepository();
    jest.clearAllMocks();
  });

  describe('CreateTodoCommand', () => {
    let createCommand: CreateTodoCommand;

    beforeEach(() => {
      createCommand = new CreateTodoCommand(mockRepository);
    });

    it('should create todo with valid payload', async () => {
      mockRepository.create.mockResolvedValue(mockTodo);

      const result = await createCommand.execute({
        title: 'New todo',
        description: 'New description',
        userId: 'user1',
      });

      expect(mockRepository.create).toHaveBeenCalledWith({
        title: 'New todo',
        description: 'New description',
        userId: 'user1',
        isCompleted: false,
        dueDate: undefined,
      });
      expect(result).toEqual(mockTodo);
    });

    it('should create todo with due date', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      mockRepository.create.mockResolvedValue(mockTodo);

      await createCommand.execute({
        title: 'New todo',
        description: 'New description',
        userId: 'user1',
        dueDate: futureDate,
      });

      expect(mockRepository.create).toHaveBeenCalledWith({
        title: 'New todo',
        description: 'New description',
        userId: 'user1',
        isCompleted: false,
        dueDate: futureDate,
      });
    });

    it('should throw ValidationError for invalid title', async () => {
      await expect(
        createCommand.execute({
          title: 'AB', // Too short
          description: 'Valid',
          userId: 'user1',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for past due date', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      await expect(
        createCommand.execute({
          title: 'Valid title',
          description: 'Valid',
          userId: 'user1',
          dueDate: pastDate,
        })
      ).rejects.toThrow(ValidationError);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.create.mockRejectedValue(error);

      await expect(
        createCommand.execute({
          title: 'Valid title',
          description: 'Valid',
          userId: 'user1',
        })
      ).rejects.toThrow('Database error');
    });
  });

  describe('UpdateTodoCommand', () => {
    let updateCommand: UpdateTodoCommand;

    beforeEach(() => {
      updateCommand = new UpdateTodoCommand(mockRepository);
    });

    it('should update todo with valid payload', async () => {
      mockRepository.getById.mockResolvedValue(mockTodo);
      mockRepository.update.mockResolvedValue({ ...mockTodo, title: 'Updated' });

      const result = await updateCommand.execute({
        id: '123',
        title: 'Updated title',
      });

      expect(mockRepository.getById).toHaveBeenCalledWith('123');
      expect(mockRepository.update).toHaveBeenCalled();
      expect(result.title).toBe('Updated');
    });

    it('should merge partial updates with existing todo', async () => {
      mockRepository.getById.mockResolvedValue(mockTodo);
      mockRepository.update.mockImplementation(todo => Promise.resolve(todo));

      const result = await updateCommand.execute({
        id: '123',
        description: 'New description',
      });

      expect(result.title).toBe(mockTodo.title); // Unchanged
      expect(result.description).toBe('New description'); // Updated
    });

    it('should update isCompleted status', async () => {
      mockRepository.getById.mockResolvedValue(mockTodo);
      mockRepository.update.mockImplementation(todo => Promise.resolve(todo));

      const result = await updateCommand.execute({
        id: '123',
        isCompleted: true,
      });

      expect(result.isCompleted).toBe(true);
    });

    it('should throw ValidationError for invalid title', async () => {
      await expect(
        updateCommand.execute({
          id: '123',
          title: 'AB',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.getById).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Not found');
      mockRepository.getById.mockRejectedValue(error);

      await expect(
        updateCommand.execute({
          id: '999',
          title: 'Updated',
        })
      ).rejects.toThrow('Not found');
    });
  });

  describe('DeleteTodoCommand', () => {
    let deleteCommand: DeleteTodoCommand;

    beforeEach(() => {
      deleteCommand = new DeleteTodoCommand(mockRepository);
    });

    it('should delete todo by id', async () => {
      mockRepository.delete.mockResolvedValue(undefined);

      await deleteCommand.execute('123');

      expect(mockRepository.delete).toHaveBeenCalledWith('123');
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Delete failed');
      mockRepository.delete.mockRejectedValue(error);

      await expect(deleteCommand.execute('123')).rejects.toThrow('Delete failed');
    });
  });

  describe('ToggleTodoCommand', () => {
    let toggleCommand: ToggleTodoCommand;

    beforeEach(() => {
      toggleCommand = new ToggleTodoCommand(mockRepository);
    });

    it('should toggle todo completion status', async () => {
      const toggledTodo = { ...mockTodo, isCompleted: true };
      mockRepository.toggle.mockResolvedValue(toggledTodo);

      const result = await toggleCommand.execute('123');

      expect(mockRepository.toggle).toHaveBeenCalledWith('123');
      expect(result.isCompleted).toBe(true);
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Toggle failed');
      mockRepository.toggle.mockRejectedValue(error);

      await expect(toggleCommand.execute('123')).rejects.toThrow('Toggle failed');
    });
  });
});
