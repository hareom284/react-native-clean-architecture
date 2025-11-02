import { AuthValidationService } from '@/auth/application/services/AuthValidationService';
import { ValidationError } from '@/core/domain/errors/ValidationError';

describe('AuthValidationService', () => {
  describe('validateLoginPayload', () => {
    it('should validate correct login payload', () => {
      expect(() =>
        AuthValidationService.validateLoginPayload('test@example.com', 'Password123!')
      ).not.toThrow();
    });

    it('should throw ValidationError for invalid email', () => {
      expect(() =>
        AuthValidationService.validateLoginPayload('invalid-email', 'Password123!')
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty email', () => {
      expect(() =>
        AuthValidationService.validateLoginPayload('', 'Password123!')
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for short password', () => {
      expect(() =>
        AuthValidationService.validateLoginPayload('test@example.com', 'short')
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty password', () => {
      expect(() =>
        AuthValidationService.validateLoginPayload('test@example.com', '')
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError with field information', () => {
      try {
        AuthValidationService.validateLoginPayload('invalid', 'password123');
        fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).field).toBe('email');
      }
    });
  });

  describe('validateRegisterPayload', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe'
    };

    it('should validate correct registration payload', () => {
      expect(() =>
        AuthValidationService.validateRegisterPayload(
          validData.email,
          validData.password,
          validData.confirmPassword,
          validData.firstName,
          validData.lastName
        )
      ).not.toThrow();
    });

    it('should throw ValidationError for invalid email', () => {
      expect(() =>
        AuthValidationService.validateRegisterPayload(
          'invalid-email',
          validData.password,
          validData.confirmPassword,
          validData.firstName,
          validData.lastName
        )
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError when passwords do not match', () => {
      expect(() =>
        AuthValidationService.validateRegisterPayload(
          validData.email,
          'Password123!',
          'DifferentPassword123!',
          validData.firstName,
          validData.lastName
        )
      ).toThrow(ValidationError);

      expect(() =>
        AuthValidationService.validateRegisterPayload(
          validData.email,
          'Password123!',
          'DifferentPassword123!',
          validData.firstName,
          validData.lastName
        )
      ).toThrow('Passwords do not match');
    });

    it('should throw ValidationError for empty first name', () => {
      expect(() =>
        AuthValidationService.validateRegisterPayload(
          validData.email,
          validData.password,
          validData.confirmPassword,
          '',
          validData.lastName
        )
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty last name', () => {
      expect(() =>
        AuthValidationService.validateRegisterPayload(
          validData.email,
          validData.password,
          validData.confirmPassword,
          validData.firstName,
          ''
        )
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for first name exceeding 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() =>
        AuthValidationService.validateRegisterPayload(
          validData.email,
          validData.password,
          validData.confirmPassword,
          longName,
          validData.lastName
        )
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for last name exceeding 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() =>
        AuthValidationService.validateRegisterPayload(
          validData.email,
          validData.password,
          validData.confirmPassword,
          validData.firstName,
          longName
        )
      ).toThrow(ValidationError);
    });

    it('should accept names with exactly 50 characters', () => {
      const maxName = 'a'.repeat(50);
      expect(() =>
        AuthValidationService.validateRegisterPayload(
          validData.email,
          validData.password,
          validData.confirmPassword,
          maxName,
          maxName
        )
      ).not.toThrow();
    });
  });

  describe('validatePasswordStrength', () => {
    it('should return strong for password with all criteria', () => {
      const result = AuthValidationService.validatePasswordStrength('Password123!');
      expect(result.isStrong).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(result.feedback).toHaveLength(0);
    });

    it('should give higher score for longer passwords', () => {
      const shortResult = AuthValidationService.validatePasswordStrength('Pass123!');
      const longResult = AuthValidationService.validatePasswordStrength('Password123!@#');
      expect(longResult.score).toBeGreaterThan(shortResult.score);
    });

    it('should provide feedback for password without uppercase', () => {
      const result = AuthValidationService.validatePasswordStrength('password123!');
      expect(result.isStrong).toBe(true); // Has 4 criteria: length, lowercase, number, special
      expect(result.feedback).toContain('Include at least one uppercase letter');
    });

    it('should provide feedback for password without lowercase', () => {
      const result = AuthValidationService.validatePasswordStrength('PASSWORD123!');
      expect(result.isStrong).toBe(true); // Has 4 criteria: length, uppercase, number, special
      expect(result.feedback).toContain('Include at least one lowercase letter');
    });

    it('should provide feedback for password without numbers', () => {
      const result = AuthValidationService.validatePasswordStrength('Password!');
      expect(result.isStrong).toBe(true); // Has 4 criteria: length(1) + uppercase(1) + lowercase(1) + special(1) = 4
      expect(result.feedback).toContain('Include at least one number');
    });

    it('should provide feedback for password without special characters', () => {
      const result = AuthValidationService.validatePasswordStrength('Password123');
      expect(result.isStrong).toBe(true); // Has 4 criteria: length, uppercase, lowercase, number
      expect(result.feedback).toContain('Include at least one special character');
    });

    it('should provide feedback for short password', () => {
      const result = AuthValidationService.validatePasswordStrength('Pass1!');
      expect(result.isStrong).toBe(true); // Has 4 criteria: uppercase(1) + lowercase(1) + number(1) + special(1) = 4
      expect(result.feedback).toContain('Password should be at least 8 characters');
    });

    it('should provide multiple feedback items for weak password', () => {
      const result = AuthValidationService.validatePasswordStrength('pass');
      expect(result.isStrong).toBe(false);
      expect(result.feedback.length).toBeGreaterThan(1);
      expect(result.score).toBeLessThan(4);
    });

    it('should accept various special characters', () => {
      const specialChars = '!@#$%^&*(),.?":{}|<>';
      for (const char of specialChars) {
        const result = AuthValidationService.validatePasswordStrength(`Password123${char}`);
        expect(result.feedback).not.toContain('Include at least one special character');
      }
    });

    it('should give maximum score for very strong password', () => {
      const result = AuthValidationService.validatePasswordStrength('SuperSecurePassword123!@#');
      expect(result.score).toBe(6);
      expect(result.isStrong).toBe(true);
      expect(result.feedback).toHaveLength(0);
    });
  });
});
