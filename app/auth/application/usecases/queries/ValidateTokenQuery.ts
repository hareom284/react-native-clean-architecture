import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '@/auth/application/ports/UserRepository';

@injectable()
export class ValidateTokenQuery {
  constructor(
    @inject(UserRepositoryToken) private userRepository: UserRepository
  ) {}

  async execute(token: string): Promise<boolean> {
    return this.userRepository.validateToken(token);
  }
}
