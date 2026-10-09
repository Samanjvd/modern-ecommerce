import { useEffect } from 'react';

import { api } from '@/api/axios';

import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const {
    user,

    accessToken,

    setUser,

    setAccessToken,

    logout,

    isLoading,

    setLoading,
  } = useAuthStore();

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await api.get('/auth/me');

        setUser(response.data.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  return {
    user,

    accessToken,

    setAccessToken,

    setUser,

    logout,

    isLoading,
  };
}
