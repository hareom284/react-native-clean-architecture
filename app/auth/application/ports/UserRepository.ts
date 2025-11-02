import { User } from '@/auth/domain/entities/User';

export const UserRepositoryToken = Symbol('UserRepository');

/**
 * Port (Interface) for User Repository
 * This defines the contract for authentication operations
 * Implementation will be in Infrastructure layer
 */
export interface UserRepository {
  /**
   * Login user with email and password
   */
  login(email: string, password: string): Promise<User>;

  /**
   * Register new user
   */
  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<User>;

  /**
   * Logout current user
   */
  logout(): Promise<void>;

  /**
   * Get currently authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Save authentication token
   */
  saveToken(token: string): Promise<void>;

  /**
   * Get stored authentication token
   */
  getToken(): Promise<string | null>;

  /**
   * Clear authentication token
   */
  clearToken(): Promise<void>;

  /**
   * Validate if token is still valid
   */
  validateToken(token: string): Promise<boolean>;
}
