import { useQuery } from '@tanstack/react-query';
import { getFeed } from '@/api/resources/reviews';

export function useFeed(sort: 'recent' | 'top' = 'recent') {
  return useQuery({
    queryKey: ['feed', sort],
    queryFn: () => getFeed(sort),
  });
}
