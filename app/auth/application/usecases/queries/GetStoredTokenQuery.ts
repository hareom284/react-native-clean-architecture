import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '@/auth/application/ports/UserRepository';

@injectable()
export class GetStoredTokenQuery {
  constructor(
    @inject(UserRepositoryToken) private userRepository: UserRepository
  ) {}

  async execute(): Promise<string | null> {
    return this.userRepository.getToken();
  }
}
