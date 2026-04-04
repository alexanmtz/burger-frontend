import type { User } from '@/types/types';
import { getCurrentUser } from './user';

export interface LoginPayload { email: string; password: string }
export interface AuthResponse  { token: string; user: User }

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const user = await getCurrentUser();

  return {
    token: `mock-jwt-token-${payload.email || 'guest'}`,
    user,
  };
}

export async function logout(): Promise<void> {
  localStorage.removeItem('burger_token');
}