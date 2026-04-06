import type { User } from '@/types/types';
import { apiFetch } from '@/api/connect/api';

export async function fetchUsers(): Promise<User[]> {
  return apiFetch<User[]>('/users');
}

export async function fetchUser(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}
