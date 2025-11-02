import { ValidationError } from '@/core/domain/errors/ValidationError';

export class TodoDescription {
  private readonly value: string;
  private static readonly MAX_LENGTH = 500;

  constructor(description: string) {
    const trimmed = description.trim();

    if (trimmed.length > TodoDescription.MAX_LENGTH) {
      throw new ValidationError(
        `Description cannot exceed ${TodoDescription.MAX_LENGTH} characters`,
        'description'
      );
    }

    this.value = trimmed;
  }

  toString(): string {
    return this.value;
  }

  equals(other: TodoDescription): boolean {
    return this.value === other.value;
  }
}
