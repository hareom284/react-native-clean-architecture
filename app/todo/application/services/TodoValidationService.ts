import { ValidationError } from '@/core/domain/errors/ValidationError';
import { TodoTitle } from '@/todo/domain/valueObjects/TodoTitle';
import { TodoDescription } from '@/todo/domain/valueObjects/TodoDescription';

/**
 * Application Service for Todo Validation
 */
export class TodoValidationService {
  /**
   * Validate todo creation payload
   */
  static validateCreatePayload(
    title: string,
    description: string,
    dueDate?: Date
  ): void {
    // Validate title
    new TodoTitle(title);

    // Validate description
    new TodoDescription(description);

    // Validate due date
    if (dueDate) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (dueDate < now) {
        throw new ValidationError('Due date cannot be in the past', 'dueDate');
      }
    }
  }

  /**
   * Validate todo update payload
   */
  static validateUpdatePayload(
    title?: string,
    description?: string,
    dueDate?: Date
  ): void {
    if (title !== undefined) {
      new TodoTitle(title);
    }

    if (description !== undefined) {
      new TodoDescription(description);
    }

    if (dueDate) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (dueDate < now) {
        throw new ValidationError('Due date cannot be in the past', 'dueDate');
      }
    }
  }
}
