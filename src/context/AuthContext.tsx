import { type ReactNode, useEffect, useState } from 'react';

import { authConnector } from '@/api/auth';
import type { LoginPayload } from '@/api/auth/types';
import { useUser } from '@/hooks/users/useUser';

import { AuthContext } from './auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const { data: user = null, isLoading: userLoading } = useUser(userId ?? undefined);

  const loading = authLoading || (!!userId && userLoading);

  useEffect(() => {
    authConnector.getInitialSession().then(({ user: u, token: t }) => {
      setUserId(u?.id ?? null);
      setToken(t);
      setAuthLoading(false);
    });

    const unsubscribe = authConnector.onSessionChange((u) => {
      setUserId(u?.id ?? null);
    });

    return unsubscribe;
  }, []);

  const signIn = async (payload: LoginPayload) => {
    await authConnector.signIn(payload);
    const t = await authConnector.getToken();
    setToken(t);
  };

  const signOut = async () => {
    await authConnector.signOut();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
