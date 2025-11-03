import { injectable, inject } from 'inversiland';
import { TodoRepository } from '@/todo/application/ports/TodoRepository';
import { Todo } from '@/todo/domain/entities/Todo';
import { TodoApi } from '@/todo/infrastructure/api/TodoApi';
import { TodoMapper } from '@/todo/infrastructure/mappers/TodoMapper';
import { NotFoundError } from '@/core/domain/errors/NotFoundError';

/**
 * TodoRepository Implementation
 * Implements the TodoRepository port (interface)
 */
@injectable()
export class TodoRepositoryImpl implements TodoRepository {
  constructor(
    @inject(TodoApi) private api: TodoApi
  ) {}

  async getAll(): Promise<Todo[]> {
    try {
      const dtos = await this.api.getAll();
      return TodoMapper.toDomainList(dtos);
    } catch (error: any) {
      console.error('Get all todos error:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Todo> {
    try {
      const dto = await this.api.getById(id);
      return TodoMapper.toDomain(dto);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError('Todo', id);
      }
      throw error;
    }
  }

  async create(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    try {
      const dto = await this.api.create({
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate?.toISOString(),
      });
      return TodoMapper.toDomain(dto);
    } catch (error: any) {
      console.error('Create todo error:', error);
      throw error;
    }
  }

  async update(todo: Todo): Promise<Todo> {
    try {
      const dto = await this.api.update(todo.id, {
        title: todo.title,
        description: todo.description,
        isCompleted: todo.isCompleted,
        dueDate: todo.dueDate?.toISOString(),
      });
      return TodoMapper.toDomain(dto);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError('Todo', todo.id);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.api.delete(id);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError('Todo', id);
      }
      throw error;
    }
  }

  async toggle(id: string): Promise<Todo> {
    try {
      const dto = await this.api.toggle(id);
      return TodoMapper.toDomain(dto);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundError('Todo', id);
      }
      throw error;
    }
  }

  async getCompleted(): Promise<Todo[]> {
    try {
      const dtos = await this.api.getCompleted();
      return TodoMapper.toDomainList(dtos);
    } catch (error: any) {
      console.error('Get completed todos error:', error);
      throw error;
    }
  }

  async getPending(): Promise<Todo[]> {
    try {
      const dtos = await this.api.getPending();
      return TodoMapper.toDomainList(dtos);
    } catch (error: any) {
      console.error('Get pending todos error:', error);
      throw error;
    }
  }
}
