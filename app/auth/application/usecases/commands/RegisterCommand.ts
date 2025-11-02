import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '@/auth/application/ports/UserRepository';
import { User } from '@/auth/domain/entities/User';
import { AuthValidationService } from '@/auth/application/services/AuthValidationService';

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
    @inject(UserRepositoryToken) private userRepository: UserRepository
  ) {}

  async execute(payload: RegisterPayload): Promise<User> {
    // Validate payload
    AuthValidationService.validateRegisterPayload(
      payload.email,
      payload.password,
      payload.confirmPassword,
      payload.firstName,
      payload.lastName
    );

    // Execute registration
    const user = await this.userRepository.register(
      payload.email,
      payload.password,
      payload.firstName,
      payload.lastName
    );

    return user;
  }
}
