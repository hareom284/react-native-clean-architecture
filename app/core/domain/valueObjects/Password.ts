import { ValidationError } from '../errors/ValidationError';

export class Password {
  private readonly value: string;

  constructor(password: string) {
    if (!password || password.trim() === '') {
      throw new ValidationError('Password cannot be empty', 'password');
    }

    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters', 'password');
    }

    this.value = password;
  }

  toString(): string {
    return this.value;
  }
}
