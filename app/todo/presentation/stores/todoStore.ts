import { QueryClient } from '@tanstack/react-query';

/**
 * Todo Query Keys
 */
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
  completed: () => [...todoKeys.all, 'completed'] as const,
  pending: () => [...todoKeys.all, 'pending'] as const,
};

/**
 * Todo Mutation Keys
 */
export const todoMutationKeys = {
  create: ['todos', 'create'] as const,
  update: ['todos', 'update'] as const,
  delete: ['todos', 'delete'] as const,
  toggle: ['todos', 'toggle'] as const,
};

/**
 * Default React Query configuration for todo queries
 */
export const todoQueryConfig = {
  staleTime: 3 * 60 * 1000, // 3 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 1,
};

/**
 * Invalidate all todo-related queries
 */
export const invalidateTodoQueries = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({ queryKey: todoKeys.all });
};

/**
 * Clear all todo-related queries from cache
 */
export const clearTodoQueries = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: todoKeys.all });
};
