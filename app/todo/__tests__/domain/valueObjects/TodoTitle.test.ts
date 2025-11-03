import { TodoTitle } from '@/todo/domain/valueObjects/TodoTitle';
import { ValidationError } from '@/core/domain/errors/ValidationError';

describe('TodoTitle', () => {
  describe('constructor', () => {
    it('should create a valid todo title', () => {
      const title = new TodoTitle('Buy groceries');
      expect(title.toString()).toBe('Buy groceries');
    });

    it('should trim whitespace', () => {
      const title = new TodoTitle('  Todo item  ');
      expect(title.toString()).toBe('Todo item');
    });

    it('should throw ValidationError for empty title', () => {
      expect(() => new TodoTitle('')).toThrow(ValidationError);
      expect(() => new TodoTitle('')).toThrow('Title cannot be empty');
    });

    it('should throw ValidationError for whitespace-only title', () => {
      expect(() => new TodoTitle('   ')).toThrow(ValidationError);
      expect(() => new TodoTitle('   ')).toThrow('Title cannot be empty');
    });

    it('should throw ValidationError for title shorter than 3 characters', () => {
      expect(() => new TodoTitle('AB')).toThrow(ValidationError);
      expect(() => new TodoTitle('AB')).toThrow('Title must be at least 3 characters');
    });

    it('should accept title with exactly 3 characters', () => {
      const title = new TodoTitle('ABC');
      expect(title.toString()).toBe('ABC');
    });

    it('should throw ValidationError for title exceeding 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      expect(() => new TodoTitle(longTitle)).toThrow(ValidationError);
      expect(() => new TodoTitle(longTitle)).toThrow('Title cannot exceed 100 characters');
    });

    it('should accept title with exactly 100 characters', () => {
      const maxTitle = 'a'.repeat(100);
      const title = new TodoTitle(maxTitle);
      expect(title.toString()).toBe(maxTitle);
    });

    it('should include field name in validation error', () => {
      try {
        new TodoTitle('');
        fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).field).toBe('title');
      }
    });
  });

  describe('equals', () => {
    it('should return true for identical titles', () => {
      const title1 = new TodoTitle('Buy groceries');
      const title2 = new TodoTitle('Buy groceries');
      expect(title1.equals(title2)).toBe(true);
    });

    it('should return false for different titles', () => {
      const title1 = new TodoTitle('Buy groceries');
      const title2 = new TodoTitle('Do laundry');
      expect(title1.equals(title2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const title1 = new TodoTitle('Buy Groceries');
      const title2 = new TodoTitle('buy groceries');
      expect(title1.equals(title2)).toBe(false);
    });

    it('should handle trimmed whitespace in comparison', () => {
      const title1 = new TodoTitle('  Buy groceries  ');
      const title2 = new TodoTitle('Buy groceries');
      expect(title1.equals(title2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the title value', () => {
      const title = new TodoTitle('Complete project');
      expect(title.toString()).toBe('Complete project');
    });

    it('should return trimmed value', () => {
      const title = new TodoTitle('  Spaced title  ');
      expect(title.toString()).toBe('Spaced title');
    });
  });
});
