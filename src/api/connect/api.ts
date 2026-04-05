import { supabase } from '../auth/supabase';

const BASE_URL = '/api';
const supabaseEnabled = import.meta.env.VITE_SUPABASE_ENABLED === 'true';

async function getSupabaseToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || '';
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = supabaseEnabled ? await getSupabaseToken() : localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(await authHeaders()),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
