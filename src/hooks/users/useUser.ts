import { useQuery } from '@tanstack/react-query';
import { type User } from '../../types/types';
import { fetchUser } from '@/api/resources/users';

export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => fetchUser(id),
  });
}