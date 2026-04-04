import { useQuery } from '@tanstack/react-query';
import { type User } from '../types/types';
import { fetchUsers } from '@/api/resources/users';

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],    
    queryFn: fetchUsers,
  });
}