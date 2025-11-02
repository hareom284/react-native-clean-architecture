import { RootAuthUseCase } from '@/auth/application/usecases/RootAuthUseCase';
import { LoginCommand } from '@/auth/application/usecases/commands/LoginCommand';
import { RegisterCommand } from '@/auth/application/usecases/commands/RegisterCommand';
import { LogoutCommand } from '@/auth/application/usecases/commands/LogoutCommand';
import { GetCurrentUserQuery } from '@/auth/application/usecases/queries/GetCurrentUserQuery';
import { ValidateTokenQuery } from '@/auth/application/usecases/queries/ValidateTokenQuery';
import { GetStoredTokenQuery } from '@/auth/application/usecases/queries/GetStoredTokenQuery';
import { User } from '@/auth/domain/entities/User';

// Mock dependencies
const mockLoginCmd = {
  execute: jest.fn(),
} as unknown as LoginCommand;

const mockRegisterCmd = {
  execute: jest.fn(),
} as unknown as RegisterCommand;

const mockLogoutCmd = {
  execute: jest.fn(),
} as unknown as LogoutCommand;

const mockGetCurrentUserQuery = {
  execute: jest.fn(),
} as unknown as GetCurrentUserQuery;

const mockValidateTokenQuery = {
  execute: jest.fn(),
} as unknown as ValidateTokenQuery;

const mockGetStoredTokenQuery = {
  execute: jest.fn(),
} as unknown as GetStoredTokenQuery;

describe('RootAuthUseCase', () => {
  let rootAuthUseCase: RootAuthUseCase;
  const mockUser: User = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    rootAuthUseCase = new RootAuthUseCase(
      mockLoginCmd,
      mockRegisterCmd,
      mockLogoutCmd,
      mockGetCurrentUserQuery,
      mockValidateTokenQuery,
      mockGetStoredTokenQuery
    );
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should delegate to LoginCommand', async () => {
      (mockLoginCmd.execute as jest.Mock).mockResolvedValue(mockUser);

      const payload = { email: 'test@example.com', password: 'Password123!' };
      const result = await rootAuthUseCase.login(payload);

      expect(mockLoginCmd.execute).toHaveBeenCalledWith(payload);
      expect(mockLoginCmd.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    it('should propagate errors from LoginCommand', async () => {
      const error = new Error('Login failed');
      (mockLoginCmd.execute as jest.Mock).mockRejectedValue(error);

      const payload = { email: 'test@example.com', password: 'Password123!' };

      await expect(rootAuthUseCase.login(payload)).rejects.toThrow('Login failed');
      expect(mockLoginCmd.execute).toHaveBeenCalledWith(payload);
    });
  });

  describe('register', () => {
    it('should delegate to RegisterCommand', async () => {
      (mockRegisterCmd.execute as jest.Mock).mockResolvedValue(mockUser);

      const payload = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = await rootAuthUseCase.register(payload);

      expect(mockRegisterCmd.execute).toHaveBeenCalledWith(payload);
      expect(mockRegisterCmd.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    it('should propagate errors from RegisterCommand', async () => {
      const error = new Error('Registration failed');
      (mockRegisterCmd.execute as jest.Mock).mockRejectedValue(error);

      const payload = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      await expect(rootAuthUseCase.register(payload)).rejects.toThrow('Registration failed');
      expect(mockRegisterCmd.execute).toHaveBeenCalledWith(payload);
    });
  });

  describe('logout', () => {
    it('should delegate to LogoutCommand', async () => {
      (mockLogoutCmd.execute as jest.Mock).mockResolvedValue(undefined);

      await rootAuthUseCase.logout();

      expect(mockLogoutCmd.execute).toHaveBeenCalledTimes(1);
      expect(mockLogoutCmd.execute).toHaveBeenCalledWith();
    });

    it('should propagate errors from LogoutCommand', async () => {
      const error = new Error('Logout failed');
      (mockLogoutCmd.execute as jest.Mock).mockRejectedValue(error);

      await expect(rootAuthUseCase.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should delegate to GetCurrentUserQuery and return user', async () => {
      (mockGetCurrentUserQuery.execute as jest.Mock).mockResolvedValue(mockUser);

      const result = await rootAuthUseCase.getCurrentUser();

      expect(mockGetCurrentUserQuery.execute).toHaveBeenCalledTimes(1);
      expect(mockGetCurrentUserQuery.execute).toHaveBeenCalledWith();
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user is logged in', async () => {
      (mockGetCurrentUserQuery.execute as jest.Mock).mockResolvedValue(null);

      const result = await rootAuthUseCase.getCurrentUser();

      expect(result).toBeNull();
      expect(mockGetCurrentUserQuery.execute).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from GetCurrentUserQuery', async () => {
      const error = new Error('Failed to get current user');
      (mockGetCurrentUserQuery.execute as jest.Mock).mockRejectedValue(error);

      await expect(rootAuthUseCase.getCurrentUser()).rejects.toThrow('Failed to get current user');
    });
  });

  describe('validateToken', () => {
    it('should delegate to ValidateTokenQuery and return true for valid token', async () => {
      (mockValidateTokenQuery.execute as jest.Mock).mockResolvedValue(true);

      const token = 'valid-token-123';
      const result = await rootAuthUseCase.validateToken(token);

      expect(mockValidateTokenQuery.execute).toHaveBeenCalledWith(token);
      expect(mockValidateTokenQuery.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      (mockValidateTokenQuery.execute as jest.Mock).mockResolvedValue(false);

      const token = 'invalid-token';
      const result = await rootAuthUseCase.validateToken(token);

      expect(result).toBe(false);
      expect(mockValidateTokenQuery.execute).toHaveBeenCalledWith(token);
    });

    it('should propagate errors from ValidateTokenQuery', async () => {
      const error = new Error('Validation failed');
      (mockValidateTokenQuery.execute as jest.Mock).mockRejectedValue(error);

      await expect(rootAuthUseCase.validateToken('token')).rejects.toThrow('Validation failed');
    });
  });

  describe('getStoredToken', () => {
    it('should delegate to GetStoredTokenQuery and return token', async () => {
      (mockGetStoredTokenQuery.execute as jest.Mock).mockResolvedValue('stored-token-123');

      const result = await rootAuthUseCase.getStoredToken();

      expect(mockGetStoredTokenQuery.execute).toHaveBeenCalledTimes(1);
      expect(mockGetStoredTokenQuery.execute).toHaveBeenCalledWith();
      expect(result).toBe('stored-token-123');
    });

    it('should return null when no token is stored', async () => {
      (mockGetStoredTokenQuery.execute as jest.Mock).mockResolvedValue(null);

      const result = await rootAuthUseCase.getStoredToken();

      expect(result).toBeNull();
      expect(mockGetStoredTokenQuery.execute).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from GetStoredTokenQuery', async () => {
      const error = new Error('Failed to get stored token');
      (mockGetStoredTokenQuery.execute as jest.Mock).mockRejectedValue(error);

      await expect(rootAuthUseCase.getStoredToken()).rejects.toThrow('Failed to get stored token');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete login flow', async () => {
      const loginPayload = { email: 'test@example.com', password: 'Password123!' };
      (mockLoginCmd.execute as jest.Mock).mockResolvedValue(mockUser);
      (mockGetCurrentUserQuery.execute as jest.Mock).mockResolvedValue(mockUser);

      // Login
      const loginResult = await rootAuthUseCase.login(loginPayload);
      expect(loginResult).toEqual(mockUser);

      // Get current user
      const currentUser = await rootAuthUseCase.getCurrentUser();
      expect(currentUser).toEqual(mockUser);
    });

    it('should handle complete logout flow', async () => {
      (mockLogoutCmd.execute as jest.Mock).mockResolvedValue(undefined);
      (mockGetCurrentUserQuery.execute as jest.Mock).mockResolvedValue(null);

      // Logout
      await rootAuthUseCase.logout();
      expect(mockLogoutCmd.execute).toHaveBeenCalledTimes(1);

      // Verify user is logged out
      const currentUser = await rootAuthUseCase.getCurrentUser();
      expect(currentUser).toBeNull();
    });

    it('should handle token validation flow', async () => {
      const token = 'stored-token-123';
      (mockGetStoredTokenQuery.execute as jest.Mock).mockResolvedValue(token);
      (mockValidateTokenQuery.execute as jest.Mock).mockResolvedValue(true);

      // Get stored token
      const storedToken = await rootAuthUseCase.getStoredToken();
      expect(storedToken).toBe(token);

      // Validate token
      const isValid = await rootAuthUseCase.validateToken(storedToken!);
      expect(isValid).toBe(true);
    });
  });
});
