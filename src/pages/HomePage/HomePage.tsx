import { useState } from 'react';

import { Feed } from '@/components/Feed/Feed';
import { FeedControls } from '@/components/FeedControls/FeedControls';
import { Hero } from '@/components/Hero/Hero';
import { useFeed } from '@/hooks/feed/useFeed';
import { useAuth } from '@/hooks/auth/useAuth';

type Sort = 'recent' | 'top';

export function HomePage() {
  const { user } = useAuth();
  const [sort, setSort] = useState<Sort>('recent');
  const { data: reviews, isLoading, error } = useFeed(sort);

  return (
    <main className="page">
      <div className="container">
        <Hero user={user} />
        <hr className="divider" />
        <FeedControls sort={sort} setSort={setSort} />
        <Feed reviews={reviews || []} loading={isLoading} error={error ? error.message : null} />
      </div>
    </main>
  );
}
