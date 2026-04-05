import type { User } from '@/types/types';

import { fetchUsers } from '../resources/users';

const CURRENT_USER_STORAGE_KEY = 'burger_user';

function getStoredUser(): User | null {
  const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User> {
  const storedUser = getStoredUser();
  if (storedUser) return storedUser;

  const users = await fetchUsers();
  const fallbackUser = users[0];

  if (!fallbackUser) {
    throw new Error('No users available in json-server');
  }

  return fallbackUser;
}
