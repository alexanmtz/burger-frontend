import { useState } from 'react';

import { Feed } from '@/components/Feed/Feed';
import { FeedControls } from '@/components/FeedControls/FeedControls';
import { PageTitle } from '@/components/Typography/PageTitle/PageTitle';
import { useFeed } from '@/hooks/feed/useFeed';

type Sort = 'recent' | 'top';

export function ReviewsPage() {
  const [sort, setSort] = useState<Sort>('recent');
  const { data: reviews, isLoading, error } = useFeed(sort);

  return (
    <main className="page">
      <div className="container">
        <PageTitle
          title="Burger Reviews"
          subtitle="Discover the latest burger reviews from our passionate community."
          controls={<FeedControls sort={sort} setSort={setSort} hasTitle={false} />}
        />
        <hr className="divider" />
        <Feed reviews={reviews || []} loading={isLoading} error={error ? error.message : null} />
      </div>
    </main>
  );
}
