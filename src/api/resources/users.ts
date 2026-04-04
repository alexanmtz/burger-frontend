import { apiFetch } from '../connect/api';

export type User = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  joinDate: string;
  reviewCount: number;
};

export async function fetchUsers(): Promise<User[]> {
  return apiFetch<User[]>('/users');
}

export async function fetchUser(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}