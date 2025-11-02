import { ValidationError } from '@/core/domain/errors/ValidationError';

export class AuthToken {
  private readonly value: string;

  constructor(token: string) {
    if (!token || token.trim() === '') {
      throw new ValidationError('Token cannot be empty', 'token');
    }

    this.value = token.trim();
  }

  toString(): string {
    return this.value;
  }

  equals(other: AuthToken): boolean {
    return this.value === other.value;
  }
}
