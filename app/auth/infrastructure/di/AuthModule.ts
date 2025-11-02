import { getModuleContainer, module } from 'inversiland';
import { UserRepositoryToken } from '@/auth/application/ports/UserRepository';
import { UserRepositoryImpl } from '@/auth/infrastructure/repositories/UserRepositoryImpl';
import { AuthApi } from '@/auth/infrastructure/api/AuthApi';
import { LoginCommand } from '@/auth/application/usecases/commands/LoginCommand';
import { RegisterCommand } from '@/auth/application/usecases/commands/RegisterCommand';
import { LogoutCommand } from '@/auth/application/usecases/commands/LogoutCommand';
import { GetCurrentUserQuery } from '@/auth/application/usecases/queries/GetCurrentUserQuery';
import { ValidateTokenQuery } from '@/auth/application/usecases/queries/ValidateTokenQuery';
import { GetStoredTokenQuery } from '@/auth/application/usecases/queries/GetStoredTokenQuery';
import { RootAuthUseCase } from '@/auth/application/usecases/RootAuthUseCase';

@module({
  providers: [
    // API
    AuthApi,

    // Repository (Port Implementation)
    {
      provide: UserRepositoryToken,
      useClass: UserRepositoryImpl,
    },

    // Commands
    LoginCommand,
    RegisterCommand,
    LogoutCommand,

    // Queries
    GetCurrentUserQuery,
    ValidateTokenQuery,
    GetStoredTokenQuery,

    // Root Use Case
    RootAuthUseCase,
  ],
})
export class AuthModule {}

export const authModuleContainer = getModuleContainer(AuthModule);
