import { ValidationError } from '@/core/domain/errors/ValidationError';

export class FullName {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string
  ) {
    if (!firstName || firstName.trim() === '') {
      throw new ValidationError('First name cannot be empty', 'firstName');
    }

    if (!lastName || lastName.trim() === '') {
      throw new ValidationError('Last name cannot be empty', 'lastName');
    }

    if (firstName.length > 50) {
      throw new ValidationError('First name cannot exceed 50 characters', 'firstName');
    }

    if (lastName.length > 50) {
      throw new ValidationError('Last name cannot exceed 50 characters', 'lastName');
    }
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  equals(other: FullName): boolean {
    return this.firstName === other.firstName && this.lastName === other.lastName;
  }
}
