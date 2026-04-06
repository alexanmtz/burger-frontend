import { apiFetch } from '@/api/connect/api';
import type { User } from '@/types/types';

export async function fetchUsers(): Promise<User[]> {
  return apiFetch<User[]>('/users');
}

export async function fetchUser(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}
