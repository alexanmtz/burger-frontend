import { supabase } from '../providers/supabase/client';
import type { AuthConnector, LoginPayload, SessionUser } from './types';

function toSessionUser(sbUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, string>;
}): SessionUser {
  return {
    id: sbUser.id,
    name: sbUser.user_metadata?.name ?? sbUser.email ?? 'Unknown',
    email: sbUser.email ?? '',
    avatar: sbUser.user_metadata?.avatar_url ?? '',
    bio: sbUser.user_metadata?.bio ?? '',
    reviewCount: 0,
  };
}

export class SupabaseAuthConnector implements AuthConnector {
  async getToken(): Promise<string | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }

  async signIn(payload: LoginPayload): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  onSessionChange(cb: (user: SessionUser | null) => void): () => void {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      cb(session?.user ? toSessionUser(session.user) : null);
    });
    return () => subscription.unsubscribe();
  }

  async getInitialSession(): Promise<{ user: SessionUser | null; token: string | null }> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return {
      user: session?.user ? toSessionUser(session.user) : null,
      token: session?.access_token ?? null,
    };
  }
}
