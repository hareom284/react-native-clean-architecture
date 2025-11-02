import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authModuleContainer } from '@/auth/infrastructure/di/AuthModule';
import { RootAuthUseCase } from '@/auth/application/usecases/RootAuthUseCase';
import { authMutationKeys, invalidateAuthQueries } from '@/auth/presentation/stores/authStore';
import { User } from '@/auth/domain/entities/User';

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Hook to perform login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const authUseCase = authModuleContainer.get(RootAuthUseCase);

  return useMutation<User, Error, LoginPayload>({
    mutationKey: authMutationKeys.login,
    mutationFn: (payload: LoginPayload) => authUseCase.login(payload),
    onSuccess: () => {
      // Invalidate and refetch current user after successful login
      invalidateAuthQueries(queryClient);
    },
  });
};
