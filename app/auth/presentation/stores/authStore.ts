import { QueryClient } from '@tanstack/react-query';

/**
 * Auth Query Keys
 */
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
  validateToken: (token: string) => [...authKeys.all, 'validateToken', token] as const,
  storedToken: () => [...authKeys.all, 'storedToken'] as const,
};

/**
 * Auth Mutation Keys
 */
export const authMutationKeys = {
  login: ['auth', 'login'] as const,
  register: ['auth', 'register'] as const,
  logout: ['auth', 'logout'] as const,
};

/**
 * Default React Query configuration for auth queries
 */
export const authQueryConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
};

/**
 * Invalidate all auth-related queries
 */
export const invalidateAuthQueries = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({ queryKey: authKeys.all });
};

/**
 * Clear all auth-related queries from cache
 */
export const clearAuthQueries = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: authKeys.all });
};
