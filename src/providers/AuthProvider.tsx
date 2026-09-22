import { useEffect, useState, type ReactNode } from 'react';

import { api } from '@/api/axios';

import { useAuthStore } from '@/stores/auth.store';

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const setUser = useAuthStore((state) => state.setUser);

  const logout = useAuthStore((state) => state.logout);

  const setLoading = useAuthStore((state) => state.setLoading);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        let token = accessToken;

        if (!token) {
          const response = await api.post<{
            accessToken: string;
          }>('/auth/refresh');

          token = response.data.accessToken;

          setAccessToken(token);
        }

        const response = await api.get('/auth/me');

        if (!mounted) {
          return;
        }

        setUser(response.data.user);
      } catch {
        if (!mounted) {
          return;
        }

        logout();
      } finally {
        if (!mounted) {
          // eslint-disable-next-line no-unsafe-finally
          return;
        }

        setLoading(false);
        setInitialized(true);
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
