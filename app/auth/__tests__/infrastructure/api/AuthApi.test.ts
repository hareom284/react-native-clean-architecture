import { AuthApi } from '@/auth/infrastructure/api/AuthApi';
import { IHttpClient } from '@/core/domain/specifications/IHttpClient';
import { LoginRequestDto } from '@/auth/infrastructure/dto/LoginRequestDto';
import { RegisterRequestDto } from '@/auth/infrastructure/dto/RegisterRequestDto';
import { AuthResponseDto } from '@/auth/infrastructure/dto/AuthResponseDto';
import { UserResponseDto } from '@/auth/infrastructure/dto/UserResponseDto';

// Mock HttpClient
class MockHttpClient implements IHttpClient {
  get = jest.fn();
  post = jest.fn();
  put = jest.fn();
  patch = jest.fn();
  delete = jest.fn();
}

describe('AuthApi', () => {
  let authApi: AuthApi;
  let mockHttpClient: MockHttpClient;

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
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
  };

  beforeEach(() => {
    mockHttpClient = new MockHttpClient();
    authApi = new AuthApi(mockHttpClient);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call POST /auth/login with credentials', async () => {
      const loginRequest: LoginRequestDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      mockHttpClient.post.mockResolvedValue(mockAuthResponse);

      const result = await authApi.login(loginRequest);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', loginRequest);
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should return user and tokens on successful login', async () => {
      const loginRequest: LoginRequestDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      mockHttpClient.post.mockResolvedValue(mockAuthResponse);

      const result = await authApi.login(loginRequest);

      expect(result.user).toEqual(mockUserDto);
      expect(result.token).toBe('mock-jwt-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
    });

    it('should propagate errors from HTTP client', async () => {
      const loginRequest: LoginRequestDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const error = new Error('Invalid credentials');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(authApi.login(loginRequest)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should call POST /auth/register with user data', async () => {
      const registerRequest: RegisterRequestDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockHttpClient.post.mockResolvedValue(mockAuthResponse);

      const result = await authApi.register(registerRequest);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/register', registerRequest);
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should return user and tokens on successful registration', async () => {
      const registerRequest: RegisterRequestDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockHttpClient.post.mockResolvedValue(mockAuthResponse);

      const result = await authApi.register(registerRequest);

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should propagate errors from HTTP client', async () => {
      const registerRequest: RegisterRequestDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const error = new Error('Email already exists');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(authApi.register(registerRequest)).rejects.toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    it('should call POST /auth/logout', async () => {
      mockHttpClient.post.mockResolvedValue(undefined);

      await authApi.logout();

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/logout', {});
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
    });

    it('should handle logout success', async () => {
      mockHttpClient.post.mockResolvedValue(undefined);

      await expect(authApi.logout()).resolves.toBeUndefined();
    });

    it('should propagate errors from HTTP client', async () => {
      const error = new Error('Logout failed');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(authApi.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should call GET /auth/me', async () => {
      mockHttpClient.get.mockResolvedValue(mockUserDto);

      const result = await authApi.getCurrentUser();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/auth/me');
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserDto);
    });

    it('should return user data', async () => {
      mockHttpClient.get.mockResolvedValue(mockUserDto);

      const result = await authApi.getCurrentUser();

      expect(result.id).toBe('123');
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });

    it('should propagate errors from HTTP client', async () => {
      const error = new Error('Unauthorized');
      mockHttpClient.get.mockRejectedValue(error);

      await expect(authApi.getCurrentUser()).rejects.toThrow('Unauthorized');
    });
  });

  describe('validateToken', () => {
    it('should call POST /auth/validate-token with token', async () => {
      const token = 'test-token-123';
      mockHttpClient.post.mockResolvedValue({ valid: true });

      const result = await authApi.validateToken(token);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/validate-token', { token });
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ valid: true });
    });

    it('should return valid: true for valid token', async () => {
      mockHttpClient.post.mockResolvedValue({ valid: true });

      const result = await authApi.validateToken('valid-token');

      expect(result.valid).toBe(true);
    });

    it('should return valid: false for invalid token', async () => {
      mockHttpClient.post.mockResolvedValue({ valid: false });

      const result = await authApi.validateToken('invalid-token');

      expect(result.valid).toBe(false);
    });

    it('should propagate errors from HTTP client', async () => {
      const error = new Error('Validation service unavailable');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(authApi.validateToken('token')).rejects.toThrow('Validation service unavailable');
    });
  });

  describe('refreshToken', () => {
    it('should call POST /auth/refresh with refresh token', async () => {
      const refreshToken = 'refresh-token-123';
      mockHttpClient.post.mockResolvedValue(mockAuthResponse);

      const result = await authApi.refreshToken(refreshToken);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken });
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should return new tokens on successful refresh', async () => {
      const newAuthResponse: AuthResponseDto = {
        user: mockUserDto,
        token: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockHttpClient.post.mockResolvedValue(newAuthResponse);

      const result = await authApi.refreshToken('old-refresh-token');

      expect(result.token).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('should propagate errors from HTTP client', async () => {
      const error = new Error('Refresh token expired');
      mockHttpClient.post.mockRejectedValue(error);

      await expect(authApi.refreshToken('expired-token')).rejects.toThrow('Refresh token expired');
    });
  });

  describe('API path construction', () => {
    it('should use correct base path for all endpoints', async () => {
      mockHttpClient.post.mockResolvedValue(mockAuthResponse);
      mockHttpClient.get.mockResolvedValue(mockUserDto);

      await authApi.login({ email: 'test@example.com', password: 'pass' });
      await authApi.register({ email: 'test@example.com', password: 'pass', firstName: 'John', lastName: 'Doe' });
      await authApi.logout();
      await authApi.getCurrentUser();
      await authApi.validateToken('token');
      await authApi.refreshToken('token');

      expect(mockHttpClient.post).toHaveBeenCalledWith(expect.stringContaining('/auth/'), expect.anything());
      expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('/auth/'));
    });
  });
});
