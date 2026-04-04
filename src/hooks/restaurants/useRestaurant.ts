import { useQuery } from '@tanstack/react-query';
import { getRestaurant } from '../../api/resources/restaurants';

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurant(id),
    enabled: !!id,
  });
}