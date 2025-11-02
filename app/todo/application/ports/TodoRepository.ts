import { Todo } from '@/todo/domain/entities/Todo';

export const TodoRepositoryToken = Symbol('TodoRepository');

/**
 * Port (Interface) for Todo Repository
 * This defines the contract for todo operations
 * Implementation will be in Infrastructure layer
 */
export interface TodoRepository {
  /**
   * Get all todos for current user
   */
  getAll(): Promise<Todo[]>;

  /**
   * Get single todo by ID
   */
  getById(id: string): Promise<Todo>;

  /**
   * Create new todo
   */
  create(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo>;

  /**
   * Update existing todo
   */
  update(todo: Todo): Promise<Todo>;

  /**
   * Delete todo by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Toggle todo completion status
   */
  toggle(id: string): Promise<Todo>;

  /**
   * Get completed todos
   */
  getCompleted(): Promise<Todo[]>;

  /**
   * Get pending (not completed) todos
   */
  getPending(): Promise<Todo[]>;
}
