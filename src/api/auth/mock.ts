import mockDb from '../../../db.json';
import type { AuthConnector, LoginPayload, SessionUser } from './types';

const TOKEN_KEY = 'burger_token';
const USER_KEY = 'burger_user';

function getStoredUser(): SessionUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function resolveUser(): SessionUser {
  const stored = getStoredUser();
  if (stored) return stored;

  const raw = mockDb.users;
  const first = raw[0];
  if (!first) throw new Error('No users available in mock data');
  return first as SessionUser;
}

export class MockAuthConnector implements AuthConnector {
  private listeners: Array<(user: SessionUser | null) => void> = [];

  private notify(user: SessionUser | null) {
    this.listeners.forEach((cb) => cb(user));
  }

  async getToken(): Promise<string | null> {
    return localStorage.getItem(TOKEN_KEY);
  }

  async signIn(payload: LoginPayload): Promise<void> {
    const user = resolveUser();
    const token = `mock-jwt-token-${payload.email || 'guest'}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.notify(user);
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.notify(null);
  }

  onSessionChange(cb: (user: SessionUser | null) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  async getInitialSession(): Promise<{ user: SessionUser | null; token: string | null }> {
    const user = getStoredUser();
    const token = localStorage.getItem(TOKEN_KEY);
    return { user, token };
  }
}
