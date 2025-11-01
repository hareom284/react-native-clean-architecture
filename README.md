# 🔐 Clean Architecture - Todo + Authentication Example

**Complete implementation with Login, Register, and Todo CRUD using Port/Repository pattern**

---

## 📂 Complete File Structure

```
src/
 ├── core/
 │    ├── domain/
 │    │    ├── entities/
 │    │    │    └── BaseEntity.ts
 │    │    ├── valueObjects/
 │    │    │    ├── Email.ts
 │    │    │    └── Password.ts
 │    │    ├── services/
 │    │    │    └── PasswordHashingService.ts
 │    │    ├── errors/
 │    │    │    ├── DomainError.ts
 │    │    │    ├── ValidationError.ts
 │    │    │    ├── UnauthorizedError.ts
 │    │    │    └── NotFoundError.ts
 │    │    └── constants/
 │    │         └── HttpStatus.ts
 │    │
 │    ├── application/
 │    │    └── services/
 │    │         └── ValidationService.ts
 │    │
 │    ├── infrastructure/
 │    │    ├── http/
 │    │    │    ├── HttpClient.ts
 │    │    │    └── ApiErrorHandler.ts
 │    │    └── storage/
 │    │         └── AsyncStorageAdapter.ts
 │    │
 │    └── presentation/
 │         ├── theme/
 │         │    ├── colors.ts
 │         │    └── spacing.ts
 │         └── components/
 │              ├── Button.tsx
 │              └── Input.tsx
 │
 ├── auth/ (Authentication Feature)
 │    ├── domain/
 │    │    ├── entities/
 │    │    │    └── User.ts
 │    │    ├── valueObjects/
 │    │    │    └── AuthToken.ts
 │    │    └── services/
 │    │         └── TokenValidationService.ts
 │    │
 │    ├── application/
 │    │    ├── ports/
 │    │    │    └── UserRepository.ts (interface)
 │    │    │
 │    │    ├── services/
 │    │    │    └── AuthValidationService.ts
 │    │    │
 │    │    └── useCases/
 │    │         ├── commands/
 │    │         │    ├── LoginCommand.ts
 │    │         │    ├── RegisterCommand.ts
 │    │         │    └── LogoutCommand.ts
 │    │         ├── queries/
 │    │         │    ├── GetCurrentUserQuery.ts
 │    │         │    └── ValidateTokenQuery.ts
 │    │         └── RootAuthUseCase.ts
 │    │
 │    ├── infrastructure/
 │    │    ├── api/
 │    │    │    └── AuthApi.ts
 │    │    ├── dto/
 │    │    │    ├── UserDto.ts
 │    │    │    ├── LoginRequestDto.ts
 │    │    │    └── RegisterRequestDto.ts
 │    │    ├── mappers/
 │    │    │    └── UserMapper.ts
 │    │    └── repositories/
 │    │         └── UserRepositoryImpl.ts (implementation)
 │    │
 │    ├── presentation/
 │    │    ├── views/
 │    │    │    ├── LoginView.tsx
 │    │    │    └── RegisterView.tsx
 │    │    ├── components/
 │    │    │    └── AuthForm.tsx
 │    │    ├── composables/
 │    │    │    ├── commands/
 │    │    │    │    ├── useLogin.ts
 │    │    │    │    ├── useRegister.ts
 │    │    │    │    └── useLogout.ts
 │    │    │    ├── queries/
 │    │    │    │    └── useCurrentUser.ts
 │    │    │    └── useAuthActions.ts
 │    │    └── stores/
 │    │         └── authStore.ts
 │    │
 │    └── AuthModule.ts
 │
 ├── todo/ (Todo Feature)
 │    ├── domain/
 │    │    ├── entities/
 │    │    │    └── Todo.ts
 │    │    ├── valueObjects/
 │    │    │    └── TodoTitle.ts
 │    │    └── services/
 │    │         └── TodoEnrichmentService.ts
 │    │
 │    ├── application/
 │    │    ├── ports/
 │    │    │    └── TodoRepository.ts (interface)
 │    │    │
 │    │    ├── services/
 │    │    │    └── TodoFilterService.ts
 │    │    │
 │    │    └── useCases/
 │    │         ├── commands/
 │    │         │    ├── CreateTodoCommand.ts
 │    │         │    ├── UpdateTodoCommand.ts
 │    │         │    ├── DeleteTodoCommand.ts
 │    │         │    └── ToggleTodoCommand.ts
 │    │         ├── queries/
 │    │         │    ├── GetTodosQuery.ts
 │    │         │    ├── GetTodoByIdQuery.ts
 │    │         │    └── GetActiveTodosQuery.ts
 │    │         └── RootTodoUseCase.ts
 │    │
 │    ├── infrastructure/
 │    │    ├── api/
 │    │    │    └── TodoApi.ts
 │    │    ├── dto/
 │    │    │    ├── TodoDto.ts
 │    │    │    └── CreateTodoRequestDto.ts
 │    │    ├── mappers/
 │    │    │    └── TodoMapper.ts
 │    │    └── repositories/
 │    │         └── TodoRepositoryImpl.ts (implementation)
 │    │
 │    ├── presentation/
 │    │    ├── views/
 │    │    │    ├── TodoListView.tsx
 │    │    │    └── TodoDetailView.tsx
 │    │    ├── components/
 │    │    │    ├── TodoItem.tsx
 │    │    │    └── TodoForm.tsx
 │    │    ├── composables/
 │    │    │    ├── commands/
 │    │    │    │    ├── useCreateTodo.ts
 │    │    │    │    ├── useUpdateTodo.ts
 │    │    │    │    ├── useDeleteTodo.ts
 │    │    │    │    └── useToggleTodo.ts
 │    │    │    ├── queries/
 │    │    │    │    ├── useTodos.ts
 │    │    │    │    ├── useTodoById.ts
 │    │    │    │    └── useActiveTodos.ts
 │    │    │    └── useTodoActions.ts
 │    │    └── stores/
 │    │         └── todoStore.ts
 │    │
 │    └── TodoModule.ts
 │
 └── App.tsx
```

---

## 🔐 AUTHENTICATION FEATURE

---

### 1️⃣ DOMAIN LAYER

```typescript
// auth/domain/entities/User.ts
import { BaseEntity } from '../../../core/domain/entities/BaseEntity';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  token?: string;
}

// auth/domain/valueObjects/AuthToken.ts
export class AuthToken {
  private readonly value: string;

  constructor(token: string) {
    if (!token || token.trim() === '') {
      throw new Error('Token cannot be empty');
    }
    this.value = token;
  }

  toString(): string {
    return this.value;
  }

  isExpired(): boolean {
    try {
      const payload = JSON.parse(atob(this.value.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }
}

// auth/domain/services/TokenValidationService.ts
import { AuthToken } from '../valueObjects/AuthToken';

export class TokenValidationService {
  static validate(token: string): boolean {
    try {
      const authToken = new AuthToken(token);
      return !authToken.isExpired();
    } catch {
      return false;
    }
  }
}
```

---

### 2️⃣ APPLICATION LAYER

```typescript
// auth/application/ports/UserRepository.ts
import { User } from '../../domain/entities/User';

export const UserRepositoryToken = Symbol('UserRepository');

/**
 * UserRepository: Port (Interface)
 * This defines WHAT the application needs
 */
export interface UserRepository {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string, firstName: string, lastName: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  saveToken(token: string): Promise<void>;
  getToken(): Promise<string | null>;
  clearToken(): Promise<void>;
}

// auth/application/services/AuthValidationService.ts
import { ValidationService } from '../../../core/application/services/ValidationService';
import { ValidationError } from '../../../core/domain/errors/ValidationError';

export class AuthValidationService {
  static validateLoginCredentials(email: string, password: string): void {
    ValidationService.validateRequired(email, 'email');
    ValidationService.validateEmail(email);
    ValidationService.validateRequired(password, 'password');
  }

  static validateRegisterData(
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string
  ): void {
    // Email validation
    ValidationService.validateRequired(email, 'email');
    ValidationService.validateEmail(email);

    // Password validation
    ValidationService.validateRequired(password, 'password');
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters', 'password');
    }

    // Confirm password
    if (password !== confirmPassword) {
      throw new ValidationError('Passwords do not match', 'confirmPassword');
    }

    // Name validation
    ValidationService.validateRequired(firstName, 'firstName');
    ValidationService.validateRequired(lastName, 'lastName');
  }
}

// auth/application/useCases/commands/LoginCommand.ts
import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '../../ports/UserRepository';
import { User } from '../../../domain/entities/User';
import { AuthValidationService } from '../../services/AuthValidationService';

export interface LoginPayload {
  email: string;
  password: string;
}

@injectable()
export class LoginCommand {
  constructor(
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository
  ) {}

  async execute(payload: LoginPayload): Promise<User> {
    // Validate
    AuthValidationService.validateLoginCredentials(payload.email, payload.password);

    // Login
    const user = await this.userRepository.login(payload.email, payload.password);

    // Save token
    if (user.token) {
      await this.userRepository.saveToken(user.token);
    }

    return user;
  }
}

// auth/application/useCases/commands/RegisterCommand.ts
import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '../../ports/UserRepository';
import { User } from '../../../domain/entities/User';
import { AuthValidationService } from '../../services/AuthValidationService';

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

@injectable()
export class RegisterCommand {
  constructor(
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository
  ) {}

  async execute(payload: RegisterPayload): Promise<User> {
    // Validate
    AuthValidationService.validateRegisterData(
      payload.email,
      payload.password,
      payload.confirmPassword,
      payload.firstName,
      payload.lastName
    );

    // Register
    const user = await this.userRepository.register(
      payload.email,
      payload.password,
      payload.firstName,
      payload.lastName
    );

    // Save token
    if (user.token) {
      await this.userRepository.saveToken(user.token);
    }

    return user;
  }
}

// auth/application/useCases/commands/LogoutCommand.ts
import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '../../ports/UserRepository';

@injectable()
export class LogoutCommand {
  constructor(
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository
  ) {}

  async execute(): Promise<void> {
    await this.userRepository.logout();
    await this.userRepository.clearToken();
  }
}

// auth/application/useCases/queries/GetCurrentUserQuery.ts
import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '../../ports/UserRepository';
import { User } from '../../../domain/entities/User';

@injectable()
export class GetCurrentUserQuery {
  constructor(
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository
  ) {}

  async execute(): Promise<User | null> {
    return this.userRepository.getCurrentUser();
  }
}

// auth/application/useCases/queries/ValidateTokenQuery.ts
import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '../../ports/UserRepository';
import { TokenValidationService } from '../../../domain/services/TokenValidationService';

@injectable()
export class ValidateTokenQuery {
  constructor(
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository
  ) {}

  async execute(): Promise<boolean> {
    const token = await this.userRepository.getToken();
    if (!token) return false;
    return TokenValidationService.validate(token);
  }
}

// auth/application/useCases/RootAuthUseCase.ts
import { injectable, inject } from 'inversiland';
import { LoginCommand, LoginPayload } from './commands/LoginCommand';
import { RegisterCommand, RegisterPayload } from './commands/RegisterCommand';
import { LogoutCommand } from './commands/LogoutCommand';
import { GetCurrentUserQuery } from './queries/GetCurrentUserQuery';
import { ValidateTokenQuery } from './queries/ValidateTokenQuery';
import { User } from '../../domain/entities/User';

@injectable()
export class RootAuthUseCase {
  constructor(
    @inject(LoginCommand) private loginCmd: LoginCommand,
    @inject(RegisterCommand) private registerCmd: RegisterCommand,
    @inject(LogoutCommand) private logoutCmd: LogoutCommand,
    @inject(GetCurrentUserQuery) private getCurrentUserQuery: GetCurrentUserQuery,
    @inject(ValidateTokenQuery) private validateTokenQuery: ValidateTokenQuery,
  ) {}

  async login(payload: LoginPayload): Promise<User> {
    return this.loginCmd.execute(payload);
  }

  async register(payload: RegisterPayload): Promise<User> {
    return this.registerCmd.execute(payload);
  }

  async logout(): Promise<void> {
    return this.logoutCmd.execute();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.getCurrentUserQuery.execute();
  }

  async validateToken(): Promise<boolean> {
    return this.validateTokenQuery.execute();
  }
}
```

---

### 3️⃣ INFRASTRUCTURE LAYER

```typescript
// auth/infrastructure/api/AuthApi.ts
import { injectable, inject } from 'inversiland';
import IHttpClient, { IHttpClientToken } from '../../../core/domain/specifications/IHttpClient';

@injectable()
export class AuthApi {
  private readonly baseUrl = '/auth';

  constructor(
    @inject(IHttpClientToken)
    private httpClient: IHttpClient
  ) {}

  async login(email: string, password: string): Promise<any> {
    return this.httpClient.post<any, any>(`${this.baseUrl}/login`, {
      email,
      password,
    });
  }

  async register(data: any): Promise<any> {
    return this.httpClient.post<any, any>(`${this.baseUrl}/register`, data);
  }

  async logout(): Promise<void> {
    return this.httpClient.post<void, void>(`${this.baseUrl}/logout`, {});
  }

  async getCurrentUser(): Promise<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/me`);
  }
}

// auth/infrastructure/dto/UserDto.ts
import { Expose } from 'class-transformer';
import { User } from '../../domain/entities/User';

export class UserDto {
  @Expose() id!: string;
  @Expose() email!: string;
  @Expose() firstName!: string;
  @Expose() lastName!: string;
  @Expose() token?: string;
  @Expose() createdAt!: string;
  @Expose() updatedAt!: string;

  toDomain(): User {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      token: this.token,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };
  }
}

// auth/infrastructure/mappers/UserMapper.ts
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/UserDto';
import { User } from '../../domain/entities/User';

export class UserMapper {
  static toDomain(dto: any): User {
    return plainToInstance(UserDto, dto).toDomain();
  }
}

// auth/infrastructure/repositories/UserRepositoryImpl.ts
import { injectable, inject } from 'inversiland';
import { UserRepository } from '../../application/ports/UserRepository';
import { User } from '../../domain/entities/User';
import { AuthApi } from '../api/AuthApi';
import { UserMapper } from '../mappers/UserMapper';
import { IStorage, IStorageToken } from '../../../core/domain/specifications/IStorage';
import { UnauthorizedError } from '../../../core/domain/errors/UnauthorizedError';
import { DomainError } from '../../../core/domain/errors/DomainError';

/**
 * UserRepositoryImpl: Implementation of UserRepository port
 */
@injectable()
export class UserRepositoryImpl implements UserRepository {
  private readonly TOKEN_KEY = '@auth_token';

  constructor(
    @inject(AuthApi)
    private api: AuthApi,

    @inject(IStorageToken)
    private storage: IStorage
  ) {}

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await this.api.login(email, password);
      return UserMapper.toDomain(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<User> {
    try {
      const response = await this.api.register({
        email,
        password,
        firstName,
        lastName,
      });
      return UserMapper.toDomain(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.logout();
    } catch (error) {
      // Continue even if API call fails
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.api.getCurrentUser();
      return UserMapper.toDomain(response);
    } catch (error) {
      return null;
    }
  }

  async saveToken(token: string): Promise<void> {
    await this.storage.setItem(this.TOKEN_KEY, token);
  }

  async getToken(): Promise<string | null> {
    return this.storage.getItem(this.TOKEN_KEY);
  }

  async clearToken(): Promise<void> {
    await this.storage.removeItem(this.TOKEN_KEY);
  }

  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        return new UnauthorizedError('Invalid credentials');
      }

      if (status === 422) {
        return new DomainError(data.message || 'Validation failed');
      }

      if (status >= 500) {
        return new DomainError('Server error. Please try again.');
      }
    }

    if (error.request) {
      return new DomainError('Network error. Check your connection.');
    }

    return error;
  }
}
```

---

### 4️⃣ PRESENTATION LAYER

```typescript
// auth/presentation/stores/authStore.ts
export const authStore = {
  queryKeys: {
    currentUser: ['auth', 'currentUser'] as const,
    validateToken: ['auth', 'validateToken'] as const,
  },

  config: {
    staleTime: 10 * 60 * 1000, // 10 minutes
  },
};

// auth/presentation/composables/commands/useLogin.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RootAuthUseCase } from '../../../application/useCases/RootAuthUseCase';
import { LoginPayload } from '../../../application/useCases/commands/LoginCommand';
import { authStore } from '../../stores/authStore';
import { authModuleContainer } from '../../../AuthModule';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const rootUseCase = authModuleContainer.get(RootAuthUseCase);

  return useMutation({
    mutationFn: (payload: LoginPayload) => rootUseCase.login(payload),
    onSuccess: (user) => {
      // Update current user cache
      queryClient.setQueryData(authStore.queryKeys.currentUser, user);
    },
  });
};

// auth/presentation/composables/commands/useRegister.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RootAuthUseCase } from '../../../application/useCases/RootAuthUseCase';
import { RegisterPayload } from '../../../application/useCases/commands/RegisterCommand';
import { authStore } from '../../stores/authStore';
import { authModuleContainer } from '../../../AuthModule';

export const useRegister = () => {
  const queryClient = useQueryClient();
  const rootUseCase = authModuleContainer.get(RootAuthUseCase);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => rootUseCase.register(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authStore.queryKeys.currentUser, user);
    },
  });
};

// auth/presentation/composables/commands/useLogout.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RootAuthUseCase } from '../../../application/useCases/RootAuthUseCase';
import { authStore } from '../../stores/authStore';
import { authModuleContainer } from '../../../AuthModule';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const rootUseCase = authModuleContainer.get(RootAuthUseCase);

  return useMutation({
    mutationFn: () => rootUseCase.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authStore.queryKeys.currentUser, null);
      queryClient.clear(); // Clear all queries
    },
  });
};

// auth/presentation/composables/queries/useCurrentUser.ts
import { useQuery } from '@tanstack/react-query';
import { RootAuthUseCase } from '../../../application/useCases/RootAuthUseCase';
import { authStore } from '../../stores/authStore';
import { authModuleContainer } from '../../../AuthModule';

export const useCurrentUser = () => {
  const rootUseCase = authModuleContainer.get(RootAuthUseCase);

  return useQuery({
    queryKey: authStore.queryKeys.currentUser,
    queryFn: () => rootUseCase.getCurrentUser(),
    staleTime: authStore.config.staleTime,
  });
};

// auth/presentation/composables/useAuthActions.ts
import { useLogin } from './commands/useLogin';
import { useRegister } from './commands/useRegister';
import { useLogout } from './commands/useLogout';
import { useCurrentUser } from './queries/useCurrentUser';

export const useAuthActions = () => ({
  useLogin,
  useRegister,
  useLogout,
  useCurrentUser,
});

// auth/presentation/views/LoginView.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLogin } from '../composables/commands/useLogin';
import { Button } from '../../../core/presentation/components/Button';
import { Input } from '../../../core/presentation/components/Input';

export const LoginView = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useLogin();

  const handleLogin = async () => {
    try {
      await login.mutateAsync({ email, password });
      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('TodoList');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={login.isPending ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={login.isPending}
      />

      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate('Register')}
        variant="secondary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
});

// auth/presentation/views/RegisterView.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRegister } from '../composables/commands/useRegister';
import { Button } from '../../../core/presentation/components/Button';
import { Input } from '../../../core/presentation/components/Input';

export const RegisterView = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const register = useRegister();

  const handleRegister = async () => {
    try {
      await register.mutateAsync({
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      });
      Alert.alert('Success', 'Registered successfully!');
      navigation.navigate('TodoList');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Input placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button
        title={register.isPending ? 'Registering...' : 'Register'}
        onPress={handleRegister}
        disabled={register.isPending}
      />

      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
        variant="secondary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
});
```

---

## ✅ TODO FEATURE

---

### 1️⃣ DOMAIN LAYER

```typescript
// todo/domain/entities/Todo.ts
import { BaseEntity } from '../../../core/domain/entities/BaseEntity';

export interface Todo extends BaseEntity {
  title: string;
  description: string;
  isCompleted: boolean;
  userId: string;
  dueDate?: Date;
}

// todo/domain/valueObjects/TodoTitle.ts
import { ValidationError } from '../../../core/domain/errors/ValidationError';

export class TodoTitle {
  private readonly value: string;

  constructor(title: string) {
    if (!title || title.trim() === '') {
      throw new ValidationError('Title cannot be empty', 'title');
    }

    if (title.length > 100) {
      throw new ValidationError('Title too long (max 100 chars)', 'title');
    }

    this.value = title.trim();
  }

  toString(): string {
    return this.value;
  }
}

// todo/domain/services/TodoEnrichmentService.ts
import { Todo } from '../entities/Todo';

export class TodoEnrichmentService {
  static isOverdue(todo: Todo): boolean {
    if (!todo.dueDate || todo.isCompleted) return false;
    return todo.dueDate < new Date();
  }

  static enrichTodo(todo: Todo) {
    return {
      ...todo,
      isOverdue: this.isOverdue(todo),
      daysUntilDue: todo.dueDate
        ? Math.ceil((todo.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
    };
  }
}
```

---

### 2️⃣ APPLICATION LAYER

```typescript
// todo/application/ports/TodoRepository.ts
import { Todo } from '../../domain/entities/Todo';

export const TodoRepositoryToken = Symbol('TodoRepository');

/**
 * TodoRepository: Port (Interface)
 */
export interface TodoRepository {
  getAll(): Promise<Todo[]>;
  getById(id: string): Promise<Todo>;
  getActive(): Promise<Todo[]>;
  getCompleted(): Promise<Todo[]>;
  create(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo>;
  update(todo: Todo): Promise<Todo>;
  delete(id: string): Promise<void>;
  toggle(id: string): Promise<Todo>;
}

// todo/application/services/TodoFilterService.ts
import { Todo } from '../../domain/entities/Todo';

export class TodoFilterService {
  static filterByStatus(todos: Todo[], isCompleted: boolean): Todo[] {
    return todos.filter(todo => todo.isCompleted === isCompleted);
  }

  static filterByDueDate(todos: Todo[], daysAhead: number): Todo[] {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      return todo.dueDate <= targetDate;
    });
  }

  static sortByDueDate(todos: Todo[]): Todo[] {
    return [...todos].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }
}

// todo/application/useCases/commands/CreateTodoCommand.ts
import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '../../ports/TodoRepository';
import { Todo } from '../../../domain/entities/Todo';
import { ValidationService } from '../../../../core/application/services/ValidationService';
import { TodoTitle } from '../../../domain/valueObjects/TodoTitle';

export interface CreateTodoPayload {
  title: string;
  description: string;
  userId: string;
  dueDate?: Date;
}

@injectable()
export class CreateTodoCommand {
  constructor(
    @inject(TodoRepositoryToken)
    private todoRepository: TodoRepository
  ) {}

  async execute(payload: CreateTodoPayload): Promise<Todo> {
    // Validate
    ValidationService.validateRequired(payload.title, 'title');
    new TodoTitle(payload.title); // Value object validation

    // Create
    return this.todoRepository.create({
      ...payload,
      isCompleted: false,
    });
  }
}

// todo/application/useCases/commands/UpdateTodoCommand.ts
import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '../../ports/TodoRepository';
import { Todo } from '../../../domain/entities/Todo';

@injectable()
export class UpdateTodoCommand {
  constructor(
    @inject(TodoRepositoryToken)
    private todoRepository: TodoRepository
  ) {}

  async execute(todo: Todo): Promise<Todo> {
    return this.todoRepository.update(todo);
  }
}

// todo/application/useCases/commands/DeleteTodoCommand.ts
import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '../../ports/TodoRepository';

@injectable()
export class DeleteTodoCommand {
  constructor(
    @inject(TodoRepositoryToken)
    private todoRepository: TodoRepository
  ) {}

  async execute(id: string): Promise<void> {
    return this.todoRepository.delete(id);
  }
}

// todo/application/useCases/commands/ToggleTodoCommand.ts
import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '../../ports/TodoRepository';
import { Todo } from '../../../domain/entities/Todo';

@injectable()
export class ToggleTodoCommand {
  constructor(
    @inject(TodoRepositoryToken)
    private todoRepository: TodoRepository
  ) {}

  async execute(id: string): Promise<Todo> {
    return this.todoRepository.toggle(id);
  }
}

// todo/application/useCases/queries/GetTodosQuery.ts
import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '../../ports/TodoRepository';
import { Todo } from '../../../domain/entities/Todo';
import { TodoFilterService } from '../../services/TodoFilterService';
import { TodoEnrichmentService } from '../../../domain/services/TodoEnrichmentService';

@injectable()
export class GetTodosQuery {
  constructor(
    @inject(TodoRepositoryToken)
    private todoRepository: TodoRepository
  ) {}

  async execute(): Promise<Todo[]> {
    const todos = await this.todoRepository.getAll();

    // Sort by due date
    const sorted = TodoFilterService.sortByDueDate(todos);

    // Enrich
    return sorted.map(todo => TodoEnrichmentService.enrichTodo(todo));
  }
}

// todo/application/useCases/queries/GetActiveTodosQuery.ts
import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '../../ports/TodoRepository';
import { Todo } from '../../../domain/entities/Todo';

@injectable()
export class GetActiveTodosQuery {
  constructor(
    @inject(TodoRepositoryToken)
    private todoRepository: TodoRepository
  ) {}

  async execute(): Promise<Todo[]> {
    return this.todoRepository.getActive();
  }
}

// todo/application/useCases/queries/GetTodoByIdQuery.ts
import { injectable, inject } from 'inversiland';
import { TodoRepository, TodoRepositoryToken } from '../../ports/TodoRepository';
import { Todo } from '../../../domain/entities/Todo';

@injectable()
export class GetTodoByIdQuery {
  constructor(
    @inject(TodoRepositoryToken)
    private todoRepository: TodoRepository
  ) {}

  async execute(id: string): Promise<Todo> {
    return this.todoRepository.getById(id);
  }
}

// todo/application/useCases/RootTodoUseCase.ts
import { injectable, inject } from 'inversiland';
import { CreateTodoCommand, CreateTodoPayload } from './commands/CreateTodoCommand';
import { UpdateTodoCommand } from './commands/UpdateTodoCommand';
import { DeleteTodoCommand } from './commands/DeleteTodoCommand';
import { ToggleTodoCommand } from './commands/ToggleTodoCommand';
import { GetTodosQuery } from './queries/GetTodosQuery';
import { GetActiveTodosQuery } from './queries/GetActiveTodosQuery';
import { GetTodoByIdQuery } from './queries/GetTodoByIdQuery';
import { Todo } from '../../domain/entities/Todo';

@injectable()
export class RootTodoUseCase {
  constructor(
    @inject(CreateTodoCommand) private createCmd: CreateTodoCommand,
    @inject(UpdateTodoCommand) private updateCmd: UpdateTodoCommand,
    @inject(DeleteTodoCommand) private deleteCmd: DeleteTodoCommand,
    @inject(ToggleTodoCommand) private toggleCmd: ToggleTodoCommand,
    @inject(GetTodosQuery) private getTodosQuery: GetTodosQuery,
    @inject(GetActiveTodosQuery) private getActiveQuery: GetActiveTodosQuery,
    @inject(GetTodoByIdQuery) private getByIdQuery: GetTodoByIdQuery,
  ) {}

  // Commands
  createTodo(payload: CreateTodoPayload): Promise<Todo> {
    return this.createCmd.execute(payload);
  }

  updateTodo(todo: Todo): Promise<Todo> {
    return this.updateCmd.execute(todo);
  }

  deleteTodo(id: string): Promise<void> {
    return this.deleteCmd.execute(id);
  }

  toggleTodo(id: string): Promise<Todo> {
    return this.toggleCmd.execute(id);
  }

  // Queries
  getTodos(): Promise<Todo[]> {
    return this.getTodosQuery.execute();
  }

  getActiveTodos(): Promise<Todo[]> {
    return this.getActiveQuery.execute();
  }

  getTodoById(id: string): Promise<Todo> {
    return this.getByIdQuery.execute(id);
  }
}
```

---

### 3️⃣ INFRASTRUCTURE LAYER

```typescript
// todo/infrastructure/api/TodoApi.ts
import { injectable, inject } from 'inversiland';
import IHttpClient, { IHttpClientToken } from '../../../core/domain/specifications/IHttpClient';

@injectable()
export class TodoApi {
  private readonly baseUrl = '/todos';

  constructor(
    @inject(IHttpClientToken)
    private httpClient: IHttpClient
  ) {}

  async getAll(): Promise<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl);
  }

  async getById(id: string): Promise<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`);
  }

  async create(data: any): Promise<any> {
    return this.httpClient.post<any, any>(this.baseUrl, data);
  }

  async update(id: string, data: any): Promise<any> {
    return this.httpClient.put<any, any>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async toggle(id: string): Promise<any> {
    return this.httpClient.patch<any, any>(`${this.baseUrl}/${id}/toggle`, {});
  }
}

// todo/infrastructure/dto/TodoDto.ts
import { Expose } from 'class-transformer';
import { Todo } from '../../domain/entities/Todo';

export class TodoDto {
  @Expose() id!: string;
  @Expose() title!: string;
  @Expose() description!: string;
  @Expose() isCompleted!: boolean;
  @Expose() userId!: string;
  @Expose() dueDate?: string;
  @Expose() createdAt!: string;
  @Expose() updatedAt!: string;

  toDomain(): Todo {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      isCompleted: this.isCompleted,
      userId: this.userId,
      dueDate: this.dueDate ? new Date(this.dueDate) : undefined,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    };
  }
}

// todo/infrastructure/mappers/TodoMapper.ts
import { plainToInstance } from 'class-transformer';
import { TodoDto } from '../dto/TodoDto';
import { Todo } from '../../domain/entities/Todo';

export class TodoMapper {
  static toDomain(dto: any): Todo {
    return plainToInstance(TodoDto, dto).toDomain();
  }

  static toDomainArray(dtos: any[]): Todo[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  static toDto(todo: Todo): any {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      isCompleted: todo.isCompleted,
      userId: todo.userId,
      dueDate: todo.dueDate?.toISOString(),
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    };
  }
}

// todo/infrastructure/repositories/TodoRepositoryImpl.ts
import { injectable, inject } from 'inversiland';
import { TodoRepository } from '../../application/ports/TodoRepository';
import { Todo } from '../../domain/entities/Todo';
import { TodoApi } from '../api/TodoApi';
import { TodoMapper } from '../mappers/TodoMapper';
import { NotFoundError } from '../../../core/domain/errors/NotFoundError';
import { DomainError } from '../../../core/domain/errors/DomainError';

/**
 * TodoRepositoryImpl: Implementation of TodoRepository port
 */
@injectable()
export class TodoRepositoryImpl implements TodoRepository {
  constructor(
    @inject(TodoApi)
    private api: TodoApi
  ) {}

  async getAll(): Promise<Todo[]> {
    try {
      const dtos = await this.api.getAll();
      return TodoMapper.toDomainArray(dtos);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string): Promise<Todo> {
    try {
      const dto = await this.api.getById(id);
      return TodoMapper.toDomain(dto);
    } catch (error) {
      throw this.handleError(error, id);
    }
  }

  async getActive(): Promise<Todo[]> {
    const todos = await this.getAll();
    return todos.filter(todo => !todo.isCompleted);
  }

  async getCompleted(): Promise<Todo[]> {
    const todos = await this.getAll();
    return todos.filter(todo => todo.isCompleted);
  }

  async create(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
    try {
      const dto = await this.api.create(todo);
      return TodoMapper.toDomain(dto);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(todo: Todo): Promise<Todo> {
    try {
      const dto = TodoMapper.toDto(todo);
      const response = await this.api.update(todo.id, dto);
      return TodoMapper.toDomain(response);
    } catch (error) {
      throw this.handleError(error, todo.id);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.api.delete(id);
    } catch (error) {
      throw this.handleError(error, id);
    }
  }

  async toggle(id: string): Promise<Todo> {
    try {
      const dto = await this.api.toggle(id);
      return TodoMapper.toDomain(dto);
    } catch (error) {
      throw this.handleError(error, id);
    }
  }

  private handleError(error: any, resourceId?: string): Error {
    if (error.response) {
      const { status } = error.response;

      if (status === 404 && resourceId) {
        return new NotFoundError('Todo', resourceId);
      }

      if (status >= 500) {
        return new DomainError('Server error. Please try again.');
      }
    }

    if (error.request) {
      return new DomainError('Network error. Check your connection.');
    }

    return error;
  }
}
```

---

### 4️⃣ PRESENTATION LAYER

```typescript
// todo/presentation/stores/todoStore.ts
export const todoStore = {
  defaultTodo: {
    title: '',
    description: '',
    isCompleted: false,
    userId: '',
  },

  queryKeys: {
    all: ['todos'] as const,
    lists: () => [...todoStore.queryKeys.all, 'list'] as const,
    active: () => [...todoStore.queryKeys.all, 'active'] as const,
    detail: (id: string) => [...todoStore.queryKeys.all, 'detail', id] as const,
  },

  config: {
    staleTime: 30 * 1000, // 30 seconds
  },
};

// todo/presentation/composables/commands/useCreateTodo.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RootTodoUseCase } from '../../../application/useCases/RootTodoUseCase';
import { CreateTodoPayload } from '../../../application/useCases/commands/CreateTodoCommand';
import { todoStore } from '../../stores/todoStore';
import { todoModuleContainer } from '../../../TodoModule';

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const rootUseCase = todoModuleContainer.get(RootTodoUseCase);

  return useMutation({
    mutationFn: (payload: CreateTodoPayload) => rootUseCase.createTodo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoStore.queryKeys.all });
    },
  });
};

// todo/presentation/composables/commands/useToggleTodo.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RootTodoUseCase } from '../../../application/useCases/RootTodoUseCase';
import { todoStore } from '../../stores/todoStore';
import { todoModuleContainer } from '../../../TodoModule';

export const useToggleTodo = () => {
  const queryClient = useQueryClient();
  const rootUseCase = todoModuleContainer.get(RootTodoUseCase);

  return useMutation({
    mutationFn: (id: string) => rootUseCase.toggleTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoStore.queryKeys.all });
    },
  });
};

// todo/presentation/composables/queries/useTodos.ts
import { useQuery } from '@tanstack/react-query';
import { RootTodoUseCase } from '../../../application/useCases/RootTodoUseCase';
import { todoStore } from '../../stores/todoStore';
import { todoModuleContainer } from '../../../TodoModule';

export const useTodos = () => {
  const rootUseCase = todoModuleContainer.get(RootTodoUseCase);

  return useQuery({
    queryKey: todoStore.queryKeys.lists(),
    queryFn: () => rootUseCase.getTodos(),
    staleTime: todoStore.config.staleTime,
  });
};

// todo/presentation/views/TodoListView.tsx
import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTodos } from '../composables/queries/useTodos';
import { useCreateTodo } from '../composables/commands/useCreateTodo';
import { useToggleTodo } from '../composables/commands/useToggleTodo';
import { useCurrentUser } from '../../../auth/presentation/composables/queries/useCurrentUser';
import { Input } from '../../../core/presentation/components/Input';
import { Button } from '../../../core/presentation/components/Button';

export const TodoListView = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { data: user } = useCurrentUser();
  const { data: todos, isLoading } = useTodos();
  const createTodo = useCreateTodo();
  const toggleTodo = useToggleTodo();

  const handleCreate = async () => {
    if (!user || !title.trim()) return;

    await createTodo.mutateAsync({
      title,
      description,
      userId: user.id,
    });

    setTitle('');
    setDescription('');
  };

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Todos</Text>

      {/* Create Form */}
      <View style={styles.form}>
        <Input placeholder="Title" value={title} onChangeText={setTitle} />
        <Input placeholder="Description" value={description} onChangeText={setDescription} />
        <Button title="Add Todo" onPress={handleCreate} disabled={createTodo.isPending} />
      </View>

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.todoItem}
            onPress={() => toggleTodo.mutate(item.id)}
          >
            <View style={styles.todoContent}>
              <Text style={[styles.todoTitle, item.isCompleted && styles.completed]}>
                {item.title}
              </Text>
              <Text style={styles.todoDesc}>{item.description}</Text>
            </View>
            <Text style={styles.checkbox}>{item.isCompleted ? '☑' : '☐'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  form: { marginBottom: 20 },
  todoItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todoContent: { flex: 1 },
  todoTitle: { fontSize: 16, fontWeight: '600' },
  todoDesc: { fontSize: 14, color: '#666', marginTop: 4 },
  completed: { textDecorationLine: 'line-through', color: '#999' },
  checkbox: { fontSize: 24 },
});
```

---

## 🔌 Dependency Injection Modules

```typescript
// auth/AuthModule.ts
import { getModuleContainer, module } from 'inversiland';
import { UserRepositoryToken } from './application/ports/UserRepository';
import { UserRepositoryImpl } from './infrastructure/repositories/UserRepositoryImpl';
import { AuthApi } from './infrastructure/api/AuthApi';
import { LoginCommand } from './application/useCases/commands/LoginCommand';
import { RegisterCommand } from './application/useCases/commands/RegisterCommand';
import { LogoutCommand } from './application/useCases/commands/LogoutCommand';
import { GetCurrentUserQuery } from './application/useCases/queries/GetCurrentUserQuery';
import { ValidateTokenQuery } from './application/useCases/queries/ValidateTokenQuery';
import { RootAuthUseCase } from './application/useCases/RootAuthUseCase';

@module({
  providers: [
    // Port → Implementation
    {
      provide: UserRepositoryToken,
      useClass: UserRepositoryImpl,
    },

    // Infrastructure
    AuthApi,

    // Commands
    LoginCommand,
    RegisterCommand,
    LogoutCommand,

    // Queries
    GetCurrentUserQuery,
    ValidateTokenQuery,

    // Root UseCase
    RootAuthUseCase,
  ],
})
export class AuthModule {}

export const authModuleContainer = getModuleContainer(AuthModule);

// todo/TodoModule.ts
import { getModuleContainer, module } from 'inversiland';
import { TodoRepositoryToken } from './application/ports/TodoRepository';
import { TodoRepositoryImpl } from './infrastructure/repositories/TodoRepositoryImpl';
import { TodoApi } from './infrastructure/api/TodoApi';
import { CreateTodoCommand } from './application/useCases/commands/CreateTodoCommand';
import { UpdateTodoCommand } from './application/useCases/commands/UpdateTodoCommand';
import { DeleteTodoCommand } from './application/useCases/commands/DeleteTodoCommand';
import { ToggleTodoCommand } from './application/useCases/commands/ToggleTodoCommand';
import { GetTodosQuery } from './application/useCases/queries/GetTodosQuery';
import { GetActiveTodosQuery } from './application/useCases/queries/GetActiveTodosQuery';
import { GetTodoByIdQuery } from './application/useCases/queries/GetTodoByIdQuery';
import { RootTodoUseCase } from './application/useCases/RootTodoUseCase';

@module({
  providers: [
    // Port → Implementation
    {
      provide: TodoRepositoryToken,
      useClass: TodoRepositoryImpl,
    },

    // Infrastructure
    TodoApi,

    // Commands
    CreateTodoCommand,
    UpdateTodoCommand,
    DeleteTodoCommand,
    ToggleTodoCommand,

    // Queries
    GetTodosQuery,
    GetActiveTodosQuery,
    GetTodoByIdQuery,

    // Root UseCase
    RootTodoUseCase,
  ],
})
export class TodoModule {}

export const todoModuleContainer = getModuleContainer(TodoModule);
```

---

## 🎯 Complete Flow: Login → Create Todo

```
1. User opens LoginView
   ↓
2. Enters email/password → clicks Login
   ↓
3. useLogin() mutation called
   ↓
4. RootAuthUseCase.login()
   ↓
5. LoginCommand validates & calls userRepository.login()
   ↓
6. UserRepositoryImpl (implements UserRepository port)
   ↓
7. AuthApi.login() → HTTP POST /auth/login
   ↓
8. Response → UserMapper → User entity
   ↓
9. Token saved to AsyncStorage
   ↓
10. TanStack Query caches current user
   ↓
11. Navigate to TodoListView
   ↓
12. User enters todo title → clicks Add
   ↓
13. useCreateTodo() mutation called
   ↓
14. RootTodoUseCase.createTodo()
   ↓
15. CreateTodoCommand validates & calls todoRepository.create()
   ↓
16. TodoRepositoryImpl (implements TodoRepository port)
   ↓
17. TodoApi.create() → HTTP POST /todos
   ↓
18. Response → TodoMapper → Todo entity
   ↓
19. TanStack Query invalidates todos cache
   ↓
20. UI auto-refetches & shows new todo! 🎉
```

---

## ✅ Summary

| Feature | Implementation |
|---------|----------------|
| **Port Pattern** | `UserRepository` (interface) + `UserRepositoryImpl` (implementation) |
| **Repository Pattern** | `TodoRepository` (interface) + `TodoRepositoryImpl` (implementation) |
| **Authentication** | Login, Register, Logout with token management |
| **Todo CRUD** | Create, Read, Update, Delete, Toggle |
| **CQRS** | Commands (write) + Queries (read) |
| **TanStack Query** | Caching, mutations, invalidation |
| **Error Handling** | Repository handles errors & transforms to domain errors |
| **Domain Services** | Password hashing, token validation, todo enrichment |
| **Application Services** | Validation, filtering, calculations |

