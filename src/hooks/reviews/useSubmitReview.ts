import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type ReviewPayload, submitReview } from '@/api/resources/reviews';
import { useAuth } from '@/hooks/auth/useAuth';

export function useSubmitReview() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (payload: ReviewPayload) => submitReview(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', payload.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', payload.restaurantId] });
    },
  });
}
