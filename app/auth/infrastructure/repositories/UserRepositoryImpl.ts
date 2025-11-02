import { inject, injectable } from 'inversiland';
import { UserRepository } from '@/auth/application/ports/UserRepository';
import { User } from '@/auth/domain/entities/User';
import { AuthApi } from '@/auth/infrastructure/api/AuthApi';
import { UserMapper } from '@/auth/infrastructure/mappers/UserMapper';
import { IStorage, IStorageToken } from '@/core/domain/specifications/IStorage';
import { TokenValidationService } from '@/auth/domain/services/TokenValidationService';
import { UnauthorizedError } from '@/core/domain/errors/UnauthorizedError';

const TOKEN_STORAGE_KEY = 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'auth_refresh_token';

@injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    private authApi: AuthApi,
    @inject(IStorageToken) private storage: IStorage,
  ) {}

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<User> {
    const response = await this.authApi.login({ email, password });

    // Store tokens
    await this.saveToken(response.token);
    if (response.refreshToken) {
      await this.storage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.refreshToken);
    }

    return UserMapper.toDomain(response.user);
  }

  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const response = await this.authApi.register({
      email,
      password,
      firstName,
      lastName,
    });

    // Store tokens
    await this.saveToken(response.token);
    if (response.refreshToken) {
      await this.storage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.refreshToken);
    }

    return UserMapper.toDomain(response.user);
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await this.authApi.logout();
    } catch (error) {
      // Continue with local cleanup even if API call fails
      console.warn('Logout API call failed, continuing with local cleanup', error);
    } finally {
      await this.clearToken();
      await this.storage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getToken();
      if (!token) {
        return null;
      }

      // Check if token is expired
      if (TokenValidationService.isTokenExpired(token)) {
        // Try to refresh the token
        const refreshToken = await this.storage.getItem(REFRESH_TOKEN_STORAGE_KEY);
        if (refreshToken) {
          try {
            const response = await this.authApi.refreshToken(refreshToken);
            await this.saveToken(response.token);
            if (response.refreshToken) {
              await this.storage.setItem(REFRESH_TOKEN_STORAGE_KEY, response.refreshToken);
            }
            return UserMapper.toDomain(response.user);
          } catch (error) {
            // Refresh failed, clear tokens
            await this.clearToken();
            await this.storage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
            return null;
          }
        }
        return null;
      }

      const userDto = await this.authApi.getCurrentUser();
      return UserMapper.toDomain(userDto);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        await this.clearToken();
        return null;
      }
      throw error;
    }
  }

  /**
   * Save authentication token
   */
  async saveToken(token: string): Promise<void> {
    await this.storage.setItem(TOKEN_STORAGE_KEY, token);
  }

  /**
   * Get stored authentication token
   */
  async getToken(): Promise<string | null> {
    return this.storage.getItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Clear stored authentication token
   */
  async clearToken(): Promise<void> {
    await this.storage.removeItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Validate a token
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      // First check token format and expiration locally
      if (!TokenValidationService.validateTokenFormat(token)) {
        return false;
      }

      if (TokenValidationService.isTokenExpired(token)) {
        return false;
      }

      // Then validate with the server
      const response = await this.authApi.validateToken(token);
      return response.valid;
    } catch (error) {
      return false;
    }
  }
}
