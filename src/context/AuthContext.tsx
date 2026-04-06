import { type ReactNode, useEffect, useState } from 'react';

import { authConnector } from '@/api/auth';
import type { LoginPayload, SessionUser } from '@/api/auth/types';
import type { User } from '@/types/types';

import { AuthContext } from './auth';

function toAppUser(u: SessionUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    bio: u.bio,
    reviewCount: u.reviewCount,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authConnector.getInitialSession().then(({ user: u, token: t }) => {
      setUser(u ? toAppUser(u) : null);
      setToken(t);
      setLoading(false);
    });

    const unsubscribe = authConnector.onSessionChange((u) => {
      setUser(u ? toAppUser(u) : null);
    });

    return unsubscribe;
  }, []);

  const signIn = async (payload: LoginPayload) => {
    await authConnector.signIn(payload);
    // Token may have been updated; re-read it after sign in
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
