import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    logout,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
  };
}
