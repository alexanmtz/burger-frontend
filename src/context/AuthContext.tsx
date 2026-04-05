import { useState, useEffect, type ReactNode } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { login as apiLogin, logout as apiLogout, type LoginPayload } from '@/api/connect/auth';
import { supabase } from '@/api/auth/supabase';
import type { User } from '@/types/types';
import { AuthContext } from './auth';

const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true';
const TOKEN_KEY = 'burger_token';
const USER_KEY  = 'burger_user';

function toAppUser(sbUser: SupabaseUser): User {
  return {
    id: sbUser.id,
    name: sbUser.user_metadata?.name ?? sbUser.email ?? 'Unknown',
    email: sbUser.email ?? '',
    avatar: sbUser.user_metadata?.avatar_url ?? '',
    bio: sbUser.user_metadata?.bio ?? '',
    reviewCount: 0,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (USE_SUPABASE) return null;
    const saved = localStorage.getItem(USER_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    USE_SUPABASE ? null : localStorage.getItem(TOKEN_KEY)
  );
  const [loading, setLoading] = useState(USE_SUPABASE);

  useEffect(() => {
    if (!USE_SUPABASE) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token ?? null);
      setUser(session?.user ? toAppUser(session.user) : null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token ?? null);
      setUser(session?.user ? toAppUser(session.user) : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (payload: LoginPayload) => {
    if (USE_SUPABASE) {
      const { error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      if (error) throw error;
      // state updated via onAuthStateChange
    } else {
      const res = await apiLogin(payload);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
  };

  const signOut = async () => {
    if (USE_SUPABASE) {
      await supabase.auth.signOut();
      // state cleared via onAuthStateChange
    } else {
      await apiLogout();
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
