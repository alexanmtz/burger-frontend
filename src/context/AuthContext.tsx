import { useState, type ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, type LoginPayload } from '@/api/connect/auth';
import type { User } from '@/types/types';
import { AuthContext } from './auth';

const TOKEN_KEY = 'burger_token';
const USER_KEY  = 'burger_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading] = useState(false);

  const signIn = async (payload: LoginPayload) => {
    const res = await apiLogin(payload);
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
  };

  const signOut = async () => {
    await apiLogout();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
