import type { Review } from "@/types/types";
import { CardGrid } from "../CardGrid/CardGrid";
import { FeedSkeleton } from "./Feed.skeleton";
import { BurgerReviewCard } from "../BurgerReviewCard/BurgerReviewCard";

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
      renderSkeleton={() => <FeedSkeleton />}
      renderItem={(review) => <BurgerReviewCard review={review} />}
    />
  );
};
