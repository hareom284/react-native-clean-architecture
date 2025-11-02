import { UserRepositoryImpl } from '@/auth/infrastructure/repositories/UserRepositoryImpl';
import { AuthApi } from '@/auth/infrastructure/api/AuthApi';
import { IStorage } from '@/core/domain/specifications/IStorage';
import { User } from '@/auth/domain/entities/User';
import { UserResponseDto } from '@/auth/infrastructure/dto/UserResponseDto';
import { AuthResponseDto } from '@/auth/infrastructure/dto/AuthResponseDto';
import { UnauthorizedError } from '@/core/domain/errors/UnauthorizedError';

// Mock AuthApi
class MockAuthApi {
  login = jest.fn();
  register = jest.fn();
  logout = jest.fn();
  getCurrentUser = jest.fn();
  validateToken = jest.fn();
  refreshToken = jest.fn();
}

// Mock Storage
class MockStorage implements IStorage {
  private storage = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  // Helper for testing
  getAllKeys(): string[] {
    return Array.from(this.storage.keys());
  }
}

describe('UserRepositoryImpl', () => {
  let repository: UserRepositoryImpl;
  let mockAuthApi: MockAuthApi;
  let mockStorage: MockStorage;

  const mockUserDto: UserResponseDto = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  };

  const mockAuthResponse: AuthResponseDto = {
    user: mockUserDto,
    token: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  beforeEach(() => {
    mockAuthApi = new MockAuthApi();
    mockStorage = new MockStorage();
    repository = new UserRepositoryImpl(
      mockAuthApi as unknown as AuthApi,
      mockStorage
    );
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login and store tokens', async () => {
      mockAuthApi.login.mockResolvedValue(mockAuthResponse);

      const result = await repository.login('test@example.com', 'Password123!');

      expect(mockAuthApi.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(result.id).toBe('123');
      expect(result.email).toBe('test@example.com');

      // Verify tokens are stored
      const storedToken = await mockStorage.getItem('auth_token');
      const storedRefreshToken = await mockStorage.getItem('auth_refresh_token');
      expect(storedToken).toBe('mock-access-token');
      expect(storedRefreshToken).toBe('mock-refresh-token');
    });

    it('should store only access token if no refresh token provided', async () => {
      const responseWithoutRefresh = { ...mockAuthResponse, refreshToken: undefined };
      mockAuthApi.login.mockResolvedValue(responseWithoutRefresh);

      await repository.login('test@example.com', 'Password123!');

      const storedToken = await mockStorage.getItem('auth_token');
      const storedRefreshToken = await mockStorage.getItem('auth_refresh_token');
      expect(storedToken).toBe('mock-access-token');
      expect(storedRefreshToken).toBeNull();
    });

    it('should map DTO to domain entity correctly', async () => {
      mockAuthApi.login.mockResolvedValue(mockAuthResponse);

      const result = await repository.login('test@example.com', 'Password123!');

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.toISOString()).toBe(mockUserDto.createdAt);
    });

    it('should propagate API errors', async () => {
      const error = new Error('Invalid credentials');
      mockAuthApi.login.mockRejectedValue(error);

      await expect(
        repository.login('test@example.com', 'wrong-password')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register and store tokens', async () => {
      mockAuthApi.register.mockResolvedValue(mockAuthResponse);

      const result = await repository.register(
        'newuser@example.com',
        'Password123!',
        'Jane',
        'Smith'
      );

      expect(mockAuthApi.register).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Smith',
      });
      expect(result.email).toBe('test@example.com');

      // Verify tokens are stored
      const storedToken = await mockStorage.getItem('auth_token');
      expect(storedToken).toBe('mock-access-token');
    });

    it('should propagate API errors', async () => {
      const error = new Error('Email already exists');
      mockAuthApi.register.mockRejectedValue(error);

      await expect(
        repository.register('existing@example.com', 'Password123!', 'John', 'Doe')
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    it('should logout and clear tokens', async () => {
      // Set up stored tokens
      await mockStorage.setItem('auth_token', 'token');
      await mockStorage.setItem('auth_refresh_token', 'refresh');

      mockAuthApi.logout.mockResolvedValue(undefined);

      await repository.logout();

      expect(mockAuthApi.logout).toHaveBeenCalledTimes(1);

      // Verify tokens are cleared
      const storedToken = await mockStorage.getItem('auth_token');
      const storedRefreshToken = await mockStorage.getItem('auth_refresh_token');
      expect(storedToken).toBeNull();
      expect(storedRefreshToken).toBeNull();
    });

    it('should clear tokens even if API call fails', async () => {
      await mockStorage.setItem('auth_token', 'token');
      await mockStorage.setItem('auth_refresh_token', 'refresh');

      mockAuthApi.logout.mockRejectedValue(new Error('Network error'));

      await repository.logout();

      // Tokens should still be cleared locally
      const storedToken = await mockStorage.getItem('auth_token');
      const storedRefreshToken = await mockStorage.getItem('auth_refresh_token');
      expect(storedToken).toBeNull();
      expect(storedRefreshToken).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no token is stored', async () => {
      const result = await repository.getCurrentUser();
      expect(result).toBeNull();
    });

    it('should return user when valid token exists', async () => {
      const validToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) + 3600 });
      await mockStorage.setItem('auth_token', validToken);
      mockAuthApi.getCurrentUser.mockResolvedValue(mockUserDto);

      const result = await repository.getCurrentUser();

      expect(mockAuthApi.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');
    });

    it('should refresh token when access token is expired', async () => {
      // Create an expired token (JWT-like structure)
      const expiredToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) - 3600 });
      await mockStorage.setItem('auth_token', expiredToken);
      await mockStorage.setItem('auth_refresh_token', 'refresh-token');

      mockAuthApi.refreshToken.mockResolvedValue(mockAuthResponse);

      const result = await repository.getCurrentUser();

      expect(mockAuthApi.refreshToken).toHaveBeenCalledWith('refresh-token');
      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');

      // Verify new token is stored
      const newToken = await mockStorage.getItem('auth_token');
      expect(newToken).toBe('mock-access-token');
    });

    it('should return null and clear tokens if refresh fails', async () => {
      const expiredToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) - 3600 });
      await mockStorage.setItem('auth_token', expiredToken);
      await mockStorage.setItem('auth_refresh_token', 'invalid-refresh');

      mockAuthApi.refreshToken.mockRejectedValue(new Error('Refresh failed'));

      const result = await repository.getCurrentUser();

      expect(result).toBeNull();

      // Tokens should be cleared
      const storedToken = await mockStorage.getItem('auth_token');
      const storedRefreshToken = await mockStorage.getItem('auth_refresh_token');
      expect(storedToken).toBeNull();
      expect(storedRefreshToken).toBeNull();
    });

    it('should return null when unauthorized error occurs', async () => {
      const validToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) + 3600 });
      await mockStorage.setItem('auth_token', validToken);
      mockAuthApi.getCurrentUser.mockRejectedValue(new UnauthorizedError('Unauthorized'));

      const result = await repository.getCurrentUser();

      expect(result).toBeNull();

      // Token should be cleared
      const storedToken = await mockStorage.getItem('auth_token');
      expect(storedToken).toBeNull();
    });

    it('should propagate non-unauthorized errors', async () => {
      const validToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) + 3600 });
      await mockStorage.setItem('auth_token', validToken);
      mockAuthApi.getCurrentUser.mockRejectedValue(new Error('Network error'));

      await expect(repository.getCurrentUser()).rejects.toThrow('Network error');
    });
  });

  describe('saveToken', () => {
    it('should save token to storage', async () => {
      await repository.saveToken('new-token');

      const storedToken = await mockStorage.getItem('auth_token');
      expect(storedToken).toBe('new-token');
    });
  });

  describe('getToken', () => {
    it('should retrieve token from storage', async () => {
      await mockStorage.setItem('auth_token', 'stored-token');

      const token = await repository.getToken();
      expect(token).toBe('stored-token');
    });

    it('should return null when no token exists', async () => {
      const token = await repository.getToken();
      expect(token).toBeNull();
    });
  });

  describe('clearToken', () => {
    it('should remove token from storage', async () => {
      await mockStorage.setItem('auth_token', 'token-to-remove');

      await repository.clearToken();

      const storedToken = await mockStorage.getItem('auth_token');
      expect(storedToken).toBeNull();
    });
  });

  describe('validateToken', () => {
    it('should return false for invalid token format', async () => {
      const result = await repository.validateToken('invalid-format');
      expect(result).toBe(false);
      expect(mockAuthApi.validateToken).not.toHaveBeenCalled();
    });

    it('should return false for expired token', async () => {
      const expiredToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) - 3600 });
      const result = await repository.validateToken(expiredToken);

      expect(result).toBe(false);
      expect(mockAuthApi.validateToken).not.toHaveBeenCalled();
    });

    it('should validate with server for valid non-expired token', async () => {
      const validToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) + 3600 });
      mockAuthApi.validateToken.mockResolvedValue({ valid: true });

      const result = await repository.validateToken(validToken);

      expect(mockAuthApi.validateToken).toHaveBeenCalledWith(validToken);
      expect(result).toBe(true);
    });

    it('should return false if server validation fails', async () => {
      const validToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) + 3600 });
      mockAuthApi.validateToken.mockResolvedValue({ valid: false });

      const result = await repository.validateToken(validToken);

      expect(result).toBe(false);
    });

    it('should return false if server validation throws error', async () => {
      const validToken = createMockJWT({ exp: Math.floor(Date.now() / 1000) + 3600 });
      mockAuthApi.validateToken.mockRejectedValue(new Error('Network error'));

      const result = await repository.validateToken(validToken);

      expect(result).toBe(false);
    });
  });
});

// Helper to create mock JWT tokens for testing
function createMockJWT(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadStr = btoa(JSON.stringify(payload));
  const signature = btoa('mock-signature');
  return `${header}.${payloadStr}.${signature}`;
}

// Helper function for base64 encoding in Node.js environment
function btoa(str: string): string {
  return Buffer.from(str).toString('base64');
}
