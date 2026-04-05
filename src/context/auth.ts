import { createContext } from 'react';

import type { LoginPayload } from '@/api/connect/auth';
import type { User } from '@/types/types';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
