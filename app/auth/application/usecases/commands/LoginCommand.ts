import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '@/auth/application/ports/UserRepository';
import { User } from '@/auth/domain/entities/User';
import { AuthValidationService } from '@/auth/application/services/AuthValidationService';

export interface LoginPayload {
  email: string;
  password: string;
}

@injectable()
export class LoginCommand {
  constructor(
    @inject(UserRepositoryToken) private userRepository: UserRepository
  ) {}

  async execute(payload: LoginPayload): Promise<User> {
    // Validate payload
    AuthValidationService.validateLoginPayload(payload.email, payload.password);

    // Execute login
    const user = await this.userRepository.login(payload.email, payload.password);

    return user;
  }
}
