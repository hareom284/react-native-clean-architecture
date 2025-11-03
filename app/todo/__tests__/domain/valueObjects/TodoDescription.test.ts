import { TodoDescription } from '@/todo/domain/valueObjects/TodoDescription';
import { ValidationError } from '@/core/domain/errors/ValidationError';

describe('TodoDescription', () => {
  describe('constructor', () => {
    it('should create a valid todo description', () => {
      const description = new TodoDescription('Need to buy milk and eggs');
      expect(description.toString()).toBe('Need to buy milk and eggs');
    });

    it('should trim whitespace', () => {
      const description = new TodoDescription('  Description text  ');
      expect(description.toString()).toBe('Description text');
    });

    it('should allow empty description', () => {
      const description = new TodoDescription('');
      expect(description.toString()).toBe('');
    });

    it('should allow whitespace-only description (becomes empty after trim)', () => {
      const description = new TodoDescription('   ');
      expect(description.toString()).toBe('');
    });

    it('should throw ValidationError for description exceeding 500 characters', () => {
      const longDesc = 'a'.repeat(501);
      expect(() => new TodoDescription(longDesc)).toThrow(ValidationError);
      expect(() => new TodoDescription(longDesc)).toThrow('Description cannot exceed 500 characters');
    });

    it('should accept description with exactly 500 characters', () => {
      const maxDesc = 'a'.repeat(500);
      const description = new TodoDescription(maxDesc);
      expect(description.toString()).toBe(maxDesc);
    });

    it('should include field name in validation error', () => {
      try {
        new TodoDescription('a'.repeat(501));
        fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).field).toBe('description');
      }
    });

    it('should handle multiline descriptions', () => {
      const multiline = 'First line\nSecond line\nThird line';
      const description = new TodoDescription(multiline);
      expect(description.toString()).toBe(multiline);
    });
  });

  describe('equals', () => {
    it('should return true for identical descriptions', () => {
      const desc1 = new TodoDescription('Buy milk and eggs');
      const desc2 = new TodoDescription('Buy milk and eggs');
      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should return false for different descriptions', () => {
      const desc1 = new TodoDescription('Buy milk');
      const desc2 = new TodoDescription('Buy eggs');
      expect(desc1.equals(desc2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const desc1 = new TodoDescription('Buy Milk');
      const desc2 = new TodoDescription('buy milk');
      expect(desc1.equals(desc2)).toBe(false);
    });

    it('should handle trimmed whitespace in comparison', () => {
      const desc1 = new TodoDescription('  Buy milk  ');
      const desc2 = new TodoDescription('Buy milk');
      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should return true for empty descriptions', () => {
      const desc1 = new TodoDescription('');
      const desc2 = new TodoDescription('');
      expect(desc1.equals(desc2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the description value', () => {
      const description = new TodoDescription('Detailed task description');
      expect(description.toString()).toBe('Detailed task description');
    });

    it('should return trimmed value', () => {
      const description = new TodoDescription('  Spaced description  ');
      expect(description.toString()).toBe('Spaced description');
    });

    it('should return empty string for empty description', () => {
      const description = new TodoDescription('');
      expect(description.toString()).toBe('');
    });
  });
});
