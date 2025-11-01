import { ValidationError } from '@/core/domain/errors/ValidationError';

export class ValidationService {
  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format', 'email');
    }
  }

  static validateRequired(value: string, fieldName: string): void {
    if (!value || value.trim() === '') {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
  }

  static validateMaxLength(value: string, maxLength: number, fieldName: string): void {
    if (value.length > maxLength) {
      throw new ValidationError(
        `${fieldName} cannot exceed ${maxLength} characters`,
        fieldName
      );
    }
  }

  static validateMinLength(value: string, minLength: number, fieldName: string): void {
    if (value.length < minLength) {
      throw new ValidationError(
        `${fieldName} must be at least ${minLength} characters`,
        fieldName
      );
    }
  }

  static validatePositiveNumber(value: number, fieldName: string): void {
    if (value < 0) {
      throw new ValidationError(`${fieldName} must be positive`, fieldName);
    }
  }
}
