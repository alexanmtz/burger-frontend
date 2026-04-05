import { useQuery } from '@tanstack/react-query';

import { getNearbyRestaurants } from '@/api/resources/restaurants';

export function useNearbyRestaurants(lat: number, lng: number, radiusKm = 5) {
  return useQuery({
    queryKey: ['restaurants', 'nearby', lat, lng, radiusKm],
    queryFn: () => getNearbyRestaurants(lat, lng, radiusKm),
    enabled: lat !== 0 && lng !== 0,
  });
}
