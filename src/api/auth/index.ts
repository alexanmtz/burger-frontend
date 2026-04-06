import { MockAuthConnector } from './mock';
import { SupabaseAuthConnector } from './supabase';
import type { AuthConnector } from './types';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export const authConnector: AuthConnector = USE_MOCK_AUTH
  ? new MockAuthConnector()
  : new SupabaseAuthConnector();

export type { AuthConnector, LoginPayload, SessionUser } from './types';
