import { useQuery } from '@tanstack/react-query';
import { authModuleContainer } from '@/auth/infrastructure/di/AuthModule';
import { RootAuthUseCase } from '@/auth/application/usecases/RootAuthUseCase';
import { authKeys, authQueryConfig } from '@/auth/presentation/stores/authStore';
import { User } from '@/auth/domain/entities/User';

/**
 * Hook to get the current authenticated user
 */
export const useCurrentUser = () => {
  const authUseCase = authModuleContainer.get(RootAuthUseCase);

  return useQuery<User | null, Error>({
    queryKey: authKeys.currentUser(),
    queryFn: () => authUseCase.getCurrentUser(),
    ...authQueryConfig,
  });
};
