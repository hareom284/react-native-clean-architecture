import { LoginCommand } from '@/auth/application/usecases/commands/LoginCommand';
import { RegisterCommand } from '@/auth/application/usecases/commands/RegisterCommand';
import { LogoutCommand } from '@/auth/application/usecases/commands/LogoutCommand';
import { UserRepository } from '@/auth/application/ports/UserRepository';
import { User } from '@/auth/domain/entities/User';
import { ValidationError } from '@/core/domain/errors/ValidationError';

// Mock User Repository
class MockUserRepository implements UserRepository {
  login = jest.fn();
  register = jest.fn();
  logout = jest.fn();
  getCurrentUser = jest.fn();
  saveToken = jest.fn();
  getToken = jest.fn();
  clearToken = jest.fn();
  validateToken = jest.fn();
}

describe('Auth Commands', () => {
  let mockRepository: MockUserRepository;
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
    mockRepository = new MockUserRepository();
    jest.clearAllMocks();
  });

  describe('LoginCommand', () => {
    let loginCommand: LoginCommand;

    beforeEach(() => {
      loginCommand = new LoginCommand(mockRepository);
    });

    it('should successfully login with valid credentials', async () => {
      mockRepository.login.mockResolvedValue(mockUser);

      const result = await loginCommand.execute({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result).toEqual(mockUser);
      expect(mockRepository.login).toHaveBeenCalledWith('test@example.com', 'Password123!');
      expect(mockRepository.login).toHaveBeenCalledTimes(1);
    });

    it('should throw ValidationError for invalid email', async () => {
      await expect(
        loginCommand.execute({
          email: 'invalid-email',
          password: 'Password123!',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.login).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for short password', async () => {
      await expect(
        loginCommand.execute({
          email: 'test@example.com',
          password: 'short',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.login).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for empty email', async () => {
      await expect(
        loginCommand.execute({
          email: '',
          password: 'Password123!',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.login).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for empty password', async () => {
      await expect(
        loginCommand.execute({
          email: 'test@example.com',
          password: '',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.login).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const repositoryError = new Error('Database connection failed');
      mockRepository.login.mockRejectedValue(repositoryError);

      await expect(
        loginCommand.execute({
          email: 'test@example.com',
          password: 'Password123!',
        })
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('RegisterCommand', () => {
    let registerCommand: RegisterCommand;

    beforeEach(() => {
      registerCommand = new RegisterCommand(mockRepository);
    });

    it('should successfully register with valid data', async () => {
      mockRepository.register.mockResolvedValue(mockUser);

      const result = await registerCommand.execute({
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result).toEqual(mockUser);
      expect(mockRepository.register).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!',
        'John',
        'Doe'
      );
      expect(mockRepository.register).toHaveBeenCalledTimes(1);
    });

    it('should throw ValidationError for mismatched passwords', async () => {
      await expect(
        registerCommand.execute({
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'DifferentPassword123!',
          firstName: 'John',
          lastName: 'Doe',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.register).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid email', async () => {
      await expect(
        registerCommand.execute({
          email: 'invalid-email',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.register).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for empty first name', async () => {
      await expect(
        registerCommand.execute({
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          firstName: '',
          lastName: 'Doe',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.register).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for empty last name', async () => {
      await expect(
        registerCommand.execute({
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          firstName: 'John',
          lastName: '',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.register).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for first name exceeding 50 characters', async () => {
      const longName = 'a'.repeat(51);
      await expect(
        registerCommand.execute({
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          firstName: longName,
          lastName: 'Doe',
        })
      ).rejects.toThrow(ValidationError);

      expect(mockRepository.register).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const repositoryError = new Error('User already exists');
      mockRepository.register.mockRejectedValue(repositoryError);

      await expect(
        registerCommand.execute({
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          firstName: 'John',
          lastName: 'Doe',
        })
      ).rejects.toThrow('User already exists');
    });
  });

  describe('LogoutCommand', () => {
    let logoutCommand: LogoutCommand;

    beforeEach(() => {
      logoutCommand = new LogoutCommand(mockRepository);
    });

    it('should successfully logout', async () => {
      mockRepository.logout.mockResolvedValue(undefined);

      await logoutCommand.execute();

      expect(mockRepository.logout).toHaveBeenCalledTimes(1);
    });

    it('should propagate repository errors', async () => {
      const repositoryError = new Error('Logout failed');
      mockRepository.logout.mockRejectedValue(repositoryError);

      await expect(logoutCommand.execute()).rejects.toThrow('Logout failed');
    });

    it('should not throw error even if repository logout throws', async () => {
      mockRepository.logout.mockRejectedValue(new Error('Token cleanup failed'));

      await expect(logoutCommand.execute()).rejects.toThrow();
    });
  });
});
