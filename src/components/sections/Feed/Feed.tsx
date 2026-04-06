import { BurgerReviewCard } from '@/components/cards/BurgerReviewCard/BurgerReviewCard';
import { CardGrid } from '@/components/layout/CardGrid/CardGrid';
import type { Review } from '@/types/types';
import { BurgerReviewCardSkeleton } from '@/components/cards/BurgerReviewCard/BurgerReviewCard.skeleton';

export const Feed = ({
  reviews,
  loading,
  error,
}: {
  reviews: Review[] | null;
  loading: boolean;
  error: string | null;
}) => {
  return (
    <CardGrid
      items={reviews}
      loading={loading}
      error={error ? `Failed to load feed: ${error}` : null}
      emptyMessage="No reviews yet. Be the first!"
      emptyIcon="🍔"
      skeletonCount={4}
      renderSkeleton={() => <BurgerReviewCardSkeleton />}
      renderItem={(review) => <BurgerReviewCard review={review} />}
    />
  );
};
