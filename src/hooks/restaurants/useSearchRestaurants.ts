import { useQuery } from '@tanstack/react-query';
import { searchRestaurants } from '@/api/resources/restaurants';

export function useSearchRestaurants(query: string) {
  return useQuery({
    queryKey: ['restaurants', 'search', query],
    queryFn: () => searchRestaurants(query),
  });
}
