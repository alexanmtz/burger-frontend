import { useQuery } from '@tanstack/react-query';
import { getReviewsByUser } from '@/api/resources/reviews';

export function useUserReviews(userId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => getReviewsByUser(userId!),
    enabled: !!userId,
  });
}
