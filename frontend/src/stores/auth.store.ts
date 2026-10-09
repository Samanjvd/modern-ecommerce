import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User } from '@/types/auth';

type AuthState = {
  user: User | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  setAuth: (user: User, accessToken: string) => void;

  setUser: (user: User | null) => void;

  setAccessToken: (token: string) => void;

  setLoading: (value: boolean) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      accessToken: null,

      isAuthenticated: false,

      isLoading: true,

      setAuth: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
        }),

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setAccessToken: (accessToken) =>
        set({
          accessToken,
          isAuthenticated: true,
        }),

      setLoading: (isLoading) =>
        set({
          isLoading,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),

    {
      name: 'zanbilak-auth',

      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
