import { QueryClient } from '@tanstack/react-query';
import {
  authKeys,
  authMutationKeys,
  authQueryConfig,
  invalidateAuthQueries,
  clearAuthQueries,
} from '@/auth/presentation/stores/authStore';

describe('authStore', () => {
  describe('authKeys', () => {
    it('should generate correct query key for all auth queries', () => {
      const key = authKeys.all;
      expect(key).toEqual(['auth']);
    });

    it('should generate correct query key for currentUser', () => {
      const key = authKeys.currentUser();
      expect(key).toEqual(['auth', 'currentUser']);
    });

    it('should generate correct query key for validateToken', () => {
      const token = 'test-token-123';
      const key = authKeys.validateToken(token);
      expect(key).toEqual(['auth', 'validateToken', token]);
    });

    it('should generate correct query key for storedToken', () => {
      const key = authKeys.storedToken();
      expect(key).toEqual(['auth', 'storedToken']);
    });

    it('should generate unique keys for different tokens', () => {
      const key1 = authKeys.validateToken('token-1');
      const key2 = authKeys.validateToken('token-2');
      expect(key1).not.toEqual(key2);
      expect(key1[2]).toBe('token-1');
      expect(key2[2]).toBe('token-2');
    });
  });

  describe('authMutationKeys', () => {
    it('should have correct mutation key for login', () => {
      expect(authMutationKeys.login).toEqual(['auth', 'login']);
    });

    it('should have correct mutation key for register', () => {
      expect(authMutationKeys.register).toEqual(['auth', 'register']);
    });

    it('should have correct mutation key for logout', () => {
      expect(authMutationKeys.logout).toEqual(['auth', 'logout']);
    });
  });

  describe('authQueryConfig', () => {
    it('should have correct stale time', () => {
      expect(authQueryConfig.staleTime).toBe(5 * 60 * 1000); // 5 minutes
    });

    it('should have correct cache time', () => {
      expect(authQueryConfig.cacheTime).toBe(10 * 60 * 1000); // 10 minutes
    });

    it('should have correct retry count', () => {
      expect(authQueryConfig.retry).toBe(1);
    });
  });

  describe('invalidateAuthQueries', () => {
    it('should invalidate all auth queries', () => {
      const queryClient = new QueryClient();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      invalidateAuthQueries(queryClient);

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['auth'] });
    });

    it('should invalidate all auth-related queries', () => {
      const queryClient = new QueryClient();

      // Set up some mock data
      queryClient.setQueryData(['auth', 'currentUser'], { id: '123' });
      queryClient.setQueryData(['auth', 'storedToken'], 'token');
      queryClient.setQueryData(['other', 'data'], 'value');

      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      invalidateAuthQueries(queryClient);

      // Should invalidate all queries starting with ['auth']
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['auth'] });
    });
  });

  describe('clearAuthQueries', () => {
    it('should remove all auth queries from cache', () => {
      const queryClient = new QueryClient();
      const removeSpy = jest.spyOn(queryClient, 'removeQueries');

      clearAuthQueries(queryClient);

      expect(removeSpy).toHaveBeenCalledWith({ queryKey: ['auth'] });
    });

    it('should clear cached auth data', () => {
      const queryClient = new QueryClient();

      // Set up some mock auth data
      queryClient.setQueryData(['auth', 'currentUser'], { id: '123', email: 'test@example.com' });
      queryClient.setQueryData(['auth', 'storedToken'], 'mock-token');

      clearAuthQueries(queryClient);

      // Auth data should be removed
      const currentUser = queryClient.getQueryData(['auth', 'currentUser']);
      const storedToken = queryClient.getQueryData(['auth', 'storedToken']);

      expect(currentUser).toBeUndefined();
      expect(storedToken).toBeUndefined();
    });

    it('should not affect non-auth queries', () => {
      const queryClient = new QueryClient();

      // Set up auth and non-auth data
      queryClient.setQueryData(['auth', 'currentUser'], { id: '123' });
      queryClient.setQueryData(['todos', 'list'], [{ id: '1', title: 'Task' }]);

      clearAuthQueries(queryClient);

      // Auth data should be removed
      const currentUser = queryClient.getQueryData(['auth', 'currentUser']);
      expect(currentUser).toBeUndefined();

      // Non-auth data should remain
      const todos = queryClient.getQueryData(['todos', 'list']);
      expect(todos).toEqual([{ id: '1', title: 'Task' }]);
    });
  });

  describe('query key consistency', () => {
    it('should use consistent base key across all auth query keys', () => {
      const baseKey = authKeys.all;
      const currentUserKey = authKeys.currentUser();
      const validateTokenKey = authKeys.validateToken('token');
      const storedTokenKey = authKeys.storedToken();

      // All should start with the same base key
      expect(currentUserKey[0]).toBe(baseKey[0]);
      expect(validateTokenKey[0]).toBe(baseKey[0]);
      expect(storedTokenKey[0]).toBe(baseKey[0]);
    });

    it('should use consistent base key across all mutation keys', () => {
      const baseKey = 'auth';

      expect(authMutationKeys.login[0]).toBe(baseKey);
      expect(authMutationKeys.register[0]).toBe(baseKey);
      expect(authMutationKeys.logout[0]).toBe(baseKey);
    });
  });
});
