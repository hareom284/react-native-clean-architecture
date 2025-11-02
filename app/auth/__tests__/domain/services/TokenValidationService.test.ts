import { TokenValidationService } from '@/auth/domain/services/TokenValidationService';
import { UnauthorizedError } from '@/core/domain/errors/UnauthorizedError';

describe('TokenValidationService', () => {
  // Helper to create a mock JWT token
  const createMockToken = (payload: any, exp?: number): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadData = { ...payload, exp: exp || Math.floor(Date.now() / 1000) + 3600 };
    const payloadStr = btoa(JSON.stringify(payloadData));
    const signature = btoa('mock-signature');
    return `${header}.${payloadStr}.${signature}`;
  };

  describe('validateTokenFormat', () => {
    it('should return true for valid JWT token format', () => {
      const token = createMockToken({ userId: '123' });
      const isValid = TokenValidationService.validateTokenFormat(token);
      expect(isValid).toBe(true);
    });

    it('should return false for token without 3 parts', () => {
      const invalidToken = 'invalid.token';
      const isValid = TokenValidationService.validateTokenFormat(invalidToken);
      expect(isValid).toBe(false);
    });

    it('should return false for empty token', () => {
      const isValid = TokenValidationService.validateTokenFormat('');
      expect(isValid).toBe(false);
    });

    it('should return false for token with only 2 parts', () => {
      const invalidToken = 'header.payload';
      const isValid = TokenValidationService.validateTokenFormat(invalidToken);
      expect(isValid).toBe(false);
    });

    it('should return false for token with 4 parts', () => {
      const invalidToken = 'part1.part2.part3.part4';
      const isValid = TokenValidationService.validateTokenFormat(invalidToken);
      expect(isValid).toBe(false);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for non-expired token', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const token = createMockToken({ userId: '123' }, futureExp);
      const isExpired = TokenValidationService.isTokenExpired(token);
      expect(isExpired).toBe(false);
    });

    it('should return true for expired token', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const token = createMockToken({ userId: '123' }, pastExp);
      const isExpired = TokenValidationService.isTokenExpired(token);
      expect(isExpired).toBe(true);
    });

    it('should return false for token without expiration claim', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ userId: '123' })); // No exp field
      const signature = btoa('mock-signature');
      const token = `${header}.${payload}.${signature}`;

      const isExpired = TokenValidationService.isTokenExpired(token);
      expect(isExpired).toBe(false);
    });

    it('should return true for invalid token format', () => {
      const isExpired = TokenValidationService.isTokenExpired('invalid-token');
      expect(isExpired).toBe(true);
    });
  });

  describe('extractUserId', () => {
    it('should extract userId from token payload', () => {
      const token = createMockToken({ userId: 'user-123' });
      const userId = TokenValidationService.extractUserId(token);
      expect(userId).toBe('user-123');
    });

    it('should extract sub as userId when userId is not present', () => {
      const token = createMockToken({ sub: 'user-456' });
      const userId = TokenValidationService.extractUserId(token);
      expect(userId).toBe('user-456');
    });

    it('should prefer userId over sub when both are present', () => {
      const token = createMockToken({ userId: 'user-123', sub: 'user-456' });
      const userId = TokenValidationService.extractUserId(token);
      expect(userId).toBe('user-123');
    });

    it('should throw UnauthorizedError when userId and sub are missing', () => {
      const token = createMockToken({ email: 'test@example.com' });
      expect(() => TokenValidationService.extractUserId(token)).toThrow(UnauthorizedError);
      expect(() => TokenValidationService.extractUserId(token)).toThrow('Token does not contain user ID');
    });

    it('should throw UnauthorizedError for invalid token format', () => {
      expect(() => TokenValidationService.extractUserId('invalid-token')).toThrow(UnauthorizedError);
    });
  });

  describe('edge cases', () => {
    it('should handle token with special characters in payload', () => {
      const token = createMockToken({
        userId: '123',
        email: 'test+special@example.com',
        name: 'John "Doe"'
      });
      const userId = TokenValidationService.extractUserId(token);
      expect(userId).toBe('123');
    });

    it('should handle token with numeric userId', () => {
      const token = createMockToken({ userId: 12345 });
      const userId = TokenValidationService.extractUserId(token);
      expect(userId).toBe(12345);
    });

    it('should handle token at exact expiration time', () => {
      const nowExp = Math.floor(Date.now() / 1000);
      const token = createMockToken({ userId: '123' }, nowExp);
      // Should be expired since it's at the exact expiration time
      const isExpired = TokenValidationService.isTokenExpired(token);
      expect(isExpired).toBe(true);
    });
  });
});
