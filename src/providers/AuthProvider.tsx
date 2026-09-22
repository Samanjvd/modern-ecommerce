import { useEffect, useState } from 'react';

import { getMeApi, refreshApi } from '@/api/auth.api';

import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cartStore';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((state) => state.setAuth);

  const logout = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        let token = localStorage.getItem('accessToken');

        if (!token) {
          const refresh = await refreshApi();

          token = refresh.accessToken;

          localStorage.setItem('accessToken', token!);
        }

        const data = await getMeApi();

        setAuth(data.user, token!);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const loadCart = useCartStore((state) => state.loadCart);
        await loadCart();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
}
