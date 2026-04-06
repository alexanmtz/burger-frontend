import type { AuthConnector } from '../../auth/types';
import type { FetchConnector } from '../types';

const apiUrl = import.meta.env.VITE_API_URL;

export class RealFetchConnector implements FetchConnector {
  constructor(private auth: AuthConnector) {}

  async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await this.auth.getToken();
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...(options.headers as Record<string, string> ?? {}),
      } as HeadersInit,
    });
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
    return res.json() as Promise<T>;
  }
}
