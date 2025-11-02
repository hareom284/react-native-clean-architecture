import { AuthToken } from '@/auth/domain/valueObjects/AuthToken';
import { ValidationError } from '@/core/domain/errors/ValidationError';

describe('AuthToken', () => {
  describe('constructor', () => {
    it('should create a valid auth token', () => {
      const token = new AuthToken('valid-token-123');
      expect(token.toString()).toBe('valid-token-123');
    });

    it('should trim whitespace from token', () => {
      const token = new AuthToken('  valid-token-123  ');
      expect(token.toString()).toBe('valid-token-123');
    });

    it('should throw ValidationError when token is empty', () => {
      expect(() => new AuthToken('')).toThrow(ValidationError);
      expect(() => new AuthToken('')).toThrow('Token cannot be empty');
    });

    it('should throw ValidationError when token is only whitespace', () => {
      expect(() => new AuthToken('   ')).toThrow(ValidationError);
    });

    it('should throw ValidationError when token is null/undefined', () => {
      expect(() => new AuthToken(null as any)).toThrow(ValidationError);
      expect(() => new AuthToken(undefined as any)).toThrow(ValidationError);
    });
  });

  describe('equals', () => {
    it('should return true for identical tokens', () => {
      const token1 = new AuthToken('same-token');
      const token2 = new AuthToken('same-token');
      expect(token1.equals(token2)).toBe(true);
    });

    it('should return false for different tokens', () => {
      const token1 = new AuthToken('token-1');
      const token2 = new AuthToken('token-2');
      expect(token1.equals(token2)).toBe(false);
    });

    it('should handle whitespace trimming in equals', () => {
      const token1 = new AuthToken('  token  ');
      const token2 = new AuthToken('token');
      expect(token1.equals(token2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the token value as string', () => {
      const token = new AuthToken('my-token');
      expect(token.toString()).toBe('my-token');
      expect(typeof token.toString()).toBe('string');
    });
  });
});
