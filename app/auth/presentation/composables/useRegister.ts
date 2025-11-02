import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authModuleContainer } from '@/auth/infrastructure/di/AuthModule';
import { RootAuthUseCase } from '@/auth/application/usecases/RootAuthUseCase';
import { authMutationKeys, invalidateAuthQueries } from '@/auth/presentation/stores/authStore';
import { User } from '@/auth/domain/entities/User';

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

/**
 * Hook to perform user registration
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  const authUseCase = authModuleContainer.get(RootAuthUseCase);

  return useMutation<User, Error, RegisterPayload>({
    mutationKey: authMutationKeys.register,
    mutationFn: (payload: RegisterPayload) => authUseCase.register(payload),
    onSuccess: () => {
      // Invalidate and refetch current user after successful registration
      invalidateAuthQueries(queryClient);
    },
  });
};
