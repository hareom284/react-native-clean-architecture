import { ValidationError } from '@/core/domain/errors/ValidationError';

export class TodoTitle {
  private readonly value: string;
  private static readonly MAX_LENGTH = 100;
  private static readonly MIN_LENGTH = 3;

  constructor(title: string) {
    if (!title || title.trim() === '') {
      throw new ValidationError('Title cannot be empty', 'title');
    }

    const trimmed = title.trim();

    if (trimmed.length < TodoTitle.MIN_LENGTH) {
      throw new ValidationError(
        `Title must be at least ${TodoTitle.MIN_LENGTH} characters`,
        'title'
      );
    }

    if (trimmed.length > TodoTitle.MAX_LENGTH) {
      throw new ValidationError(
        `Title cannot exceed ${TodoTitle.MAX_LENGTH} characters`,
        'title'
      );
    }

    this.value = trimmed;
  }

  toString(): string {
    return this.value;
  }

  equals(other: TodoTitle): boolean {
    return this.value === other.value;
  }
}
