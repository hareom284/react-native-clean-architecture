import { ValidationError } from '@/core/domain/errors/ValidationError';
import { Email } from '@/core/domain/valueObjects/Email';
import { Password } from '@/core/domain/valueObjects/Password';
import { FullName } from '@/auth/domain/valueObjects/FullName';

/**
 * Application Service for Authentication Validation
 * Handles complex validation logic that involves multiple entities
 */
export class AuthValidationService {
  /**
   * Validate login payload
   */
  static validateLoginPayload(email: string, password: string): void {
    // Validate using value objects
    new Email(email);
    new Password(password);
  }

  /**
   * Validate registration payload
   */
  static validateRegisterPayload(
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string
  ): void {
    // Validate email
    new Email(email);

    // Validate password
    new Password(password);

    // Validate password confirmation
    if (password !== confirmPassword) {
      throw new ValidationError('Passwords do not match', 'confirmPassword');
    }

    // Validate full name
    new FullName(firstName, lastName);
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 12) {
      score += 2;
    } else if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password should be at least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include at least one uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include at least one lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include at least one number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include at least one special character');
    }

    return {
      isStrong: score >= 4,
      score,
      feedback,
    };
  }
}
