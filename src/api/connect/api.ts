import { fetchConnector } from '../providers';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  return fetchConnector.fetch<T>(path, options);
}
