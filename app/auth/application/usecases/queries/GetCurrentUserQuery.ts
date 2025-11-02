import { injectable, inject } from 'inversiland';
import { UserRepository, UserRepositoryToken } from '@/auth/application/ports/UserRepository';
import { User } from '@/auth/domain/entities/User';

@injectable()
export class GetCurrentUserQuery {
  constructor(
    @inject(UserRepositoryToken) private userRepository: UserRepository
  ) {}

  async execute(): Promise<User | null> {
    return this.userRepository.getCurrentUser();
  }
}
