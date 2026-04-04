import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitReview, type ReviewPayload } from '@/api/resources/reviews';

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewPayload) => submitReview(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', payload.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant', payload.restaurantId] });
    },
  });
}
