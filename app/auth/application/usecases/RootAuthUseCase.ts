import { injectable, inject } from 'inversiland';
import { LoginCommand, LoginPayload } from '@/auth/application/usecases/commands/LoginCommand';
import { RegisterCommand, RegisterPayload } from '@/auth/application/usecases/commands/RegisterCommand';
import { LogoutCommand } from '@/auth/application/usecases/commands/LogoutCommand';
import { GetCurrentUserQuery } from '@/auth/application/usecases/queries/GetCurrentUserQuery';
import { ValidateTokenQuery } from '@/auth/application/usecases/queries/ValidateTokenQuery';
import { GetStoredTokenQuery } from '@/auth/application/usecases/queries/GetStoredTokenQuery';
import { User } from '@/auth/domain/entities/User';

/**
 * Root UseCase that orchestrates all auth operations
 * This is the single entry point for auth-related business logic
 */
@injectable()
export class RootAuthUseCase {
  constructor(
    // Commands
    @inject(LoginCommand) private loginCmd: LoginCommand,
    @inject(RegisterCommand) private registerCmd: RegisterCommand,
    @inject(LogoutCommand) private logoutCmd: LogoutCommand,

    // Queries
    @inject(GetCurrentUserQuery) private getCurrentUserQuery: GetCurrentUserQuery,
    @inject(ValidateTokenQuery) private validateTokenQuery: ValidateTokenQuery,
    @inject(GetStoredTokenQuery) private getStoredTokenQuery: GetStoredTokenQuery,
  ) {}

  // Command operations (writes)
  async login(payload: LoginPayload): Promise<User> {
    return this.loginCmd.execute(payload);
  }

  async register(payload: RegisterPayload): Promise<User> {
    return this.registerCmd.execute(payload);
  }

  async logout(): Promise<void> {
    return this.logoutCmd.execute();
  }

  // Query operations (reads)
  async getCurrentUser(): Promise<User | null> {
    return this.getCurrentUserQuery.execute();
  }

  async validateToken(token: string): Promise<boolean> {
    return this.validateTokenQuery.execute(token);
  }

  async getStoredToken(): Promise<string | null> {
    return this.getStoredTokenQuery.execute();
  }
}
