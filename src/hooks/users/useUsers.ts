import { useQuery } from '@tanstack/react-query';

import { fetchUsers } from '@/api/resources/users';

import { type User } from '../../types/types';

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}
