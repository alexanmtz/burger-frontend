import type { AuthConnector } from './types';
import { MockAuthConnector } from './mock';
import { SupabaseAuthConnector } from './supabase';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export const authConnector: AuthConnector = USE_MOCK_AUTH
  ? new MockAuthConnector()
  : new SupabaseAuthConnector();

export type { AuthConnector, SessionUser, LoginPayload } from './types';
