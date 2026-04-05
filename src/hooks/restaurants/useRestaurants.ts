import { useQuery } from '@tanstack/react-query';

import { getRestaurants } from '../../api/resources/restaurants';

export function useRestaurants() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  });
}
