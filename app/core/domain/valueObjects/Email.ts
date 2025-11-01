import { ValidationError } from '../errors/ValidationError';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!email || email.trim() === '') {
      throw new ValidationError('Email cannot be empty', 'email');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format', 'email');
    }

    this.value = email.trim().toLowerCase();
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
