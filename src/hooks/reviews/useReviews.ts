import { useQuery } from '@tanstack/react-query';

import { getReviewsByRestaurant } from '@/api/resources/reviews';

export function useReviews(restaurantId: string) {
  return useQuery({
    queryKey: ['reviews', restaurantId],
    queryFn: () => getReviewsByRestaurant(restaurantId),
    enabled: !!restaurantId,
  });
}
