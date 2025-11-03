import { TodoFilterService } from '@/todo/application/services/TodoFilterService';
import { Todo } from '@/todo/domain/entities/Todo';

describe('TodoFilterService', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'Completed task',
      description: 'Done',
      isCompleted: true,
      userId: 'user1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Pending task',
      description: 'Not done',
      isCompleted: false,
      userId: 'user1',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      dueDate: new Date('2024-12-31'),
    },
    {
      id: '3',
      title: 'Overdue task',
      description: 'Late',
      isCompleted: false,
      userId: 'user1',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      dueDate: new Date('2023-12-31'),
    },
    {
      id: '4',
      title: 'Task due today',
      description: 'Today',
      isCompleted: false,
      userId: 'user1',
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04'),
      dueDate: new Date(),
    },
  ];

  describe('filterByStatus', () => {
    it('should filter completed todos', () => {
      const completed = TodoFilterService.filterByStatus(mockTodos, true);
      expect(completed).toHaveLength(1);
      expect(completed[0].title).toBe('Completed task');
    });

    it('should filter pending todos', () => {
      const pending = TodoFilterService.filterByStatus(mockTodos, false);
      expect(pending).toHaveLength(3);
      expect(pending.every(t => !t.isCompleted)).toBe(true);
    });

    it('should return empty array when no matches', () => {
      const emptyTodos: Todo[] = [];
      const result = TodoFilterService.filterByStatus(emptyTodos, true);
      expect(result).toHaveLength(0);
    });
  });

  describe('filterByDueDate', () => {
    it('should filter todos by specific due date', () => {
      const targetDate = new Date('2024-12-31');
      const filtered = TodoFilterService.filterByDueDate(mockTodos, targetDate);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });

    it('should return empty array when no todos match date', () => {
      const targetDate = new Date('2025-01-01');
      const filtered = TodoFilterService.filterByDueDate(mockTodos, targetDate);
      expect(filtered).toHaveLength(0);
    });

    it('should exclude todos without due date', () => {
      const targetDate = new Date('2024-01-01');
      const filtered = TodoFilterService.filterByDueDate(mockTodos, targetDate);
      expect(filtered.every(t => t.dueDate !== undefined)).toBe(true);
    });
  });

  describe('filterOverdue', () => {
    it('should filter overdue todos', () => {
      const overdue = TodoFilterService.filterOverdue(mockTodos);
      expect(overdue.length).toBeGreaterThan(0);
      expect(overdue.every(t => t.dueDate && t.dueDate < new Date())).toBe(true);
    });

    it('should exclude completed todos from overdue', () => {
      const overdue = TodoFilterService.filterOverdue(mockTodos);
      expect(overdue.every(t => !t.isCompleted)).toBe(true);
    });

    it('should exclude todos without due date', () => {
      const overdue = TodoFilterService.filterOverdue(mockTodos);
      expect(overdue.every(t => t.dueDate !== undefined)).toBe(true);
    });

    it('should return empty array when no overdue todos', () => {
      const futureTodos: Todo[] = [{
        id: '1',
        title: 'Future task',
        description: 'Later',
        isCompleted: false,
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date('2099-12-31'),
      }];
      const overdue = TodoFilterService.filterOverdue(futureTodos);
      expect(overdue).toHaveLength(0);
    });
  });

  describe('sortByCreatedDate', () => {
    it('should sort by created date ascending', () => {
      const sorted = TodoFilterService.sortByCreatedDate(mockTodos, true);
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
      expect(sorted[3].id).toBe('4');
    });

    it('should sort by created date descending (default)', () => {
      const sorted = TodoFilterService.sortByCreatedDate(mockTodos, false);
      expect(sorted[0].id).toBe('4');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('2');
      expect(sorted[3].id).toBe('1');
    });

    it('should not mutate original array', () => {
      const original = [...mockTodos];
      TodoFilterService.sortByCreatedDate(mockTodos, true);
      expect(mockTodos).toEqual(original);
    });
  });

  describe('sortByDueDate', () => {
    it('should sort by due date ascending (default)', () => {
      const sorted = TodoFilterService.sortByDueDate(mockTodos, true);
      // Todos with dueDate should come before those without
      const withDueDate = sorted.filter(t => t.dueDate);
      expect(withDueDate.length).toBe(3);
    });

    it('should sort by due date descending', () => {
      const sorted = TodoFilterService.sortByDueDate(mockTodos, false);
      const withDueDate = sorted.filter(t => t.dueDate);
      expect(withDueDate.length).toBe(3);
    });

    it('should place todos without due date at the end', () => {
      const sorted = TodoFilterService.sortByDueDate(mockTodos, true);
      const lastTodo = sorted[sorted.length - 1];
      expect(lastTodo.dueDate).toBeUndefined();
    });

    it('should not mutate original array', () => {
      const original = [...mockTodos];
      TodoFilterService.sortByDueDate(mockTodos, true);
      expect(mockTodos).toEqual(original);
    });
  });

  describe('getDueToday', () => {
    it('should filter todos due today', () => {
      const today = TodoFilterService.getDueToday(mockTodos);
      expect(today.every(t => {
        if (!t.dueDate) return false;
        const todoDate = new Date(t.dueDate);
        todoDate.setHours(0, 0, 0, 0);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        return todoDate.getTime() === todayDate.getTime();
      })).toBe(true);
    });

    it('should exclude completed todos', () => {
      const today = TodoFilterService.getDueToday(mockTodos);
      expect(today.every(t => !t.isCompleted)).toBe(true);
    });

    it('should exclude todos without due date', () => {
      const today = TodoFilterService.getDueToday(mockTodos);
      expect(today.every(t => t.dueDate !== undefined)).toBe(true);
    });
  });
});
