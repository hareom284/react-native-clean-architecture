import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authModuleContainer } from '@/auth/infrastructure/di/AuthModule';
import { RootAuthUseCase } from '@/auth/application/usecases/RootAuthUseCase';
import { authMutationKeys, clearAuthQueries } from '@/auth/presentation/stores/authStore';

/**
 * Hook to perform logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const authUseCase = authModuleContainer.get(RootAuthUseCase);

  return useMutation<void, Error, void>({
    mutationKey: authMutationKeys.logout,
    mutationFn: () => authUseCase.logout(),
    onSuccess: () => {
      // Clear all auth queries after successful logout
      clearAuthQueries(queryClient);
    },
  });
};
