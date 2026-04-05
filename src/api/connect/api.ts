import { supabase } from '../auth/supabase';
import mockDb from '../../../db.json';

const apiUrl = import.meta.env.VITE_API_URL;
const supabaseEnabled = import.meta.env.VITE_SUPABASE_ENABLED === 'true';
const shouldUseMock = import.meta.env.VITE_USE_MOCKS === 'true';

async function getSupabaseToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || '';
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = supabaseEnabled ? await getSupabaseToken() : localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function mockFetch<T>(path: string): T {
  const [pathPart, queryPart] = path.split('?');
  const [collection, id] = pathPart.replace(/^\//, '').split('/');
  const data = (mockDb as Record<string, unknown>)[collection];
  if (data === undefined) throw new Error(`Mock: no data for "${collection}"`);
  if (id) {
    const item = (data as Record<string, unknown>[]).find((r) => String(r.id) === id);
    if (!item) throw new Error(`Mock: no item with id "${id}" in "${collection}"`);
    return item as T;
  }
  let results = data as Record<string, unknown>[];
  if (queryPart) {
    const params = Object.fromEntries(new URLSearchParams(queryPart));
    results = results.filter((r) =>
      Object.entries(params).every(([k, v]) => String(r[k]) === v)
    );
  }
  return results as T;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (shouldUseMock) return mockFetch<T>(path);

  const res = await fetch(`${apiUrl}${path}`, {
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
