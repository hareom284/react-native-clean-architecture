import { TodoValidationService } from '@/todo/application/services/TodoValidationService';
import { ValidationError } from '@/core/domain/errors/ValidationError';

describe('TodoValidationService', () => {
  describe('validateCreatePayload', () => {
    it('should validate correct payload', () => {
      expect(() =>
        TodoValidationService.validateCreatePayload(
          'Valid title',
          'Valid description'
        )
      ).not.toThrow();
    });

    it('should validate payload with due date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      expect(() =>
        TodoValidationService.validateCreatePayload(
          'Valid title',
          'Valid description',
          futureDate
        )
      ).not.toThrow();
    });

    it('should throw ValidationError for invalid title', () => {
      expect(() =>
        TodoValidationService.validateCreatePayload(
          'AB', // Too short
          'Valid description'
        )
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty title', () => {
      expect(() =>
        TodoValidationService.validateCreatePayload(
          '',
          'Valid description'
        )
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for title exceeding max length', () => {
      const longTitle = 'a'.repeat(101);
      expect(() =>
        TodoValidationService.validateCreatePayload(
          longTitle,
          'Valid description'
        )
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for description exceeding max length', () => {
      const longDesc = 'a'.repeat(501);
      expect(() =>
        TodoValidationService.validateCreatePayload(
          'Valid title',
          longDesc
        )
      ).toThrow(ValidationError);
    });

    it('should allow empty description', () => {
      expect(() =>
        TodoValidationService.validateCreatePayload(
          'Valid title',
          ''
        )
      ).not.toThrow();
    });

    it('should throw ValidationError for past due date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      expect(() =>
        TodoValidationService.validateCreatePayload(
          'Valid title',
          'Valid description',
          pastDate
        )
      ).toThrow(ValidationError);
      expect(() =>
        TodoValidationService.validateCreatePayload(
          'Valid title',
          'Valid description',
          pastDate
        )
      ).toThrow('Due date cannot be in the past');
    });

    it('should accept today as due date', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      expect(() =>
        TodoValidationService.validateCreatePayload(
          'Valid title',
          'Valid description',
          today
        )
      ).not.toThrow();
    });

    it('should include field name in validation error', () => {
      try {
        TodoValidationService.validateCreatePayload('AB', 'Valid');
        fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).field).toBe('title');
      }
    });
  });

  describe('validateUpdatePayload', () => {
    it('should validate empty update payload', () => {
      expect(() =>
        TodoValidationService.validateUpdatePayload()
      ).not.toThrow();
    });

    it('should validate update with only title', () => {
      expect(() =>
        TodoValidationService.validateUpdatePayload('New title')
      ).not.toThrow();
    });

    it('should validate update with only description', () => {
      expect(() =>
        TodoValidationService.validateUpdatePayload(undefined, 'New description')
      ).not.toThrow();
    });

    it('should validate update with only due date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      expect(() =>
        TodoValidationService.validateUpdatePayload(undefined, undefined, futureDate)
      ).not.toThrow();
    });

    it('should validate complete update payload', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      expect(() =>
        TodoValidationService.validateUpdatePayload(
          'Updated title',
          'Updated description',
          futureDate
        )
      ).not.toThrow();
    });

    it('should throw ValidationError for invalid title', () => {
      expect(() =>
        TodoValidationService.validateUpdatePayload('AB')
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid description', () => {
      const longDesc = 'a'.repeat(501);
      expect(() =>
        TodoValidationService.validateUpdatePayload(undefined, longDesc)
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError for past due date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      expect(() =>
        TodoValidationService.validateUpdatePayload(undefined, undefined, pastDate)
      ).toThrow(ValidationError);
      expect(() =>
        TodoValidationService.validateUpdatePayload(undefined, undefined, pastDate)
      ).toThrow('Due date cannot be in the past');
    });

    it('should not validate title when undefined', () => {
      expect(() =>
        TodoValidationService.validateUpdatePayload(undefined, 'Valid')
      ).not.toThrow();
    });

    it('should not validate description when undefined', () => {
      expect(() =>
        TodoValidationService.validateUpdatePayload('Valid title', undefined)
      ).not.toThrow();
    });

    it('should validate empty string as title (will throw)', () => {
      expect(() =>
        TodoValidationService.validateUpdatePayload('', 'Valid')
      ).toThrow(ValidationError);
    });

    it('should validate empty string as description (will pass)', () => {
      expect(() =>
        TodoValidationService.validateUpdatePayload('Valid title', '')
      ).not.toThrow();
    });
  });
});
