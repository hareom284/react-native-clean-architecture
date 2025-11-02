import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '@/auth/application/ports/UserRepository';

@injectable()
export class LogoutCommand {
  constructor(
    @inject(UserRepositoryToken) private userRepository: UserRepository
  ) {}

  async execute(): Promise<void> {
    await this.userRepository.logout();
  }
}
