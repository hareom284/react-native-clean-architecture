import { FullName } from '@/auth/domain/valueObjects/FullName';
import { ValidationError } from '@/core/domain/errors/ValidationError';

describe('FullName', () => {
  describe('constructor', () => {
    it('should create a valid full name', () => {
      const fullName = new FullName('John', 'Doe');
      expect(fullName.firstName).toBe('John');
      expect(fullName.lastName).toBe('Doe');
    });

    it('should throw ValidationError when firstName is empty', () => {
      expect(() => new FullName('', 'Doe')).toThrow(ValidationError);
      expect(() => new FullName('', 'Doe')).toThrow('First name cannot be empty');
    });

    it('should throw ValidationError when lastName is empty', () => {
      expect(() => new FullName('John', '')).toThrow(ValidationError);
      expect(() => new FullName('John', '')).toThrow('Last name cannot be empty');
    });

    it('should throw ValidationError when firstName is only whitespace', () => {
      expect(() => new FullName('   ', 'Doe')).toThrow(ValidationError);
    });

    it('should throw ValidationError when lastName is only whitespace', () => {
      expect(() => new FullName('John', '   ')).toThrow(ValidationError);
    });

    it('should throw ValidationError when firstName exceeds 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => new FullName(longName, 'Doe')).toThrow(ValidationError);
      expect(() => new FullName(longName, 'Doe')).toThrow('First name cannot exceed 50 characters');
    });

    it('should throw ValidationError when lastName exceeds 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => new FullName('John', longName)).toThrow(ValidationError);
      expect(() => new FullName('John', longName)).toThrow('Last name cannot exceed 50 characters');
    });

    it('should accept maximum length names (50 characters)', () => {
      const maxName = 'a'.repeat(50);
      const fullName = new FullName(maxName, maxName);
      expect(fullName.firstName).toBe(maxName);
      expect(fullName.lastName).toBe(maxName);
    });
  });

  describe('getFullName', () => {
    it('should return formatted full name', () => {
      const fullName = new FullName('John', 'Doe');
      expect(fullName.getFullName()).toBe('John Doe');
    });

    it('should preserve case in full name', () => {
      const fullName = new FullName('JOHN', 'doe');
      expect(fullName.getFullName()).toBe('JOHN doe');
    });
  });

  describe('equals', () => {
    it('should return true for identical names', () => {
      const name1 = new FullName('John', 'Doe');
      const name2 = new FullName('John', 'Doe');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different first names', () => {
      const name1 = new FullName('John', 'Doe');
      const name2 = new FullName('Jane', 'Doe');
      expect(name1.equals(name2)).toBe(false);
    });

    it('should return false for different last names', () => {
      const name1 = new FullName('John', 'Doe');
      const name2 = new FullName('John', 'Smith');
      expect(name1.equals(name2)).toBe(false);
    });

    it('should be case sensitive', () => {
      const name1 = new FullName('John', 'Doe');
      const name2 = new FullName('john', 'doe');
      expect(name1.equals(name2)).toBe(false);
    });
  });
});
