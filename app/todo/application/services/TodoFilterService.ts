import { Todo } from '@/todo/domain/entities/Todo';

/**
 * Application Service for Todo Filtering and Sorting
 * Handles business logic for filtering todo lists
 */
export class TodoFilterService {
  /**
   * Filter todos by completion status
   */
  static filterByStatus(todos: Todo[], isCompleted: boolean): Todo[] {
    return todos.filter(todo => todo.isCompleted === isCompleted);
  }

  /**
   * Filter todos by due date
   */
  static filterByDueDate(todos: Todo[], date: Date): Todo[] {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      return todo.dueDate.toDateString() === date.toDateString();
    });
  }

  /**
   * Filter overdue todos
   */
  static filterOverdue(todos: Todo[]): Todo[] {
    const now = new Date();
    return todos.filter(todo => {
      if (!todo.dueDate || todo.isCompleted) return false;
      return todo.dueDate < now;
    });
  }

  /**
   * Sort todos by creation date
   */
  static sortByCreatedDate(todos: Todo[], ascending = false): Todo[] {
    return [...todos].sort((a, b) => {
      const comparison = a.createdAt.getTime() - b.createdAt.getTime();
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Sort todos by due date
   */
  static sortByDueDate(todos: Todo[], ascending = true): Todo[] {
    return [...todos].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      const comparison = a.dueDate.getTime() - b.dueDate.getTime();
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Get todos due today
   */
  static getDueToday(todos: Todo[]): Todo[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return todos.filter(todo => {
      if (!todo.dueDate || todo.isCompleted) return false;
      return todo.dueDate >= today && todo.dueDate < tomorrow;
    });
  }
}
