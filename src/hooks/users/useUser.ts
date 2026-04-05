import { useQuery } from '@tanstack/react-query';

import { fetchUser } from '@/api/resources/users';

import { type User } from '../../types/types';

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id),
  });
}
