import { useState } from 'react';

import { Hero } from '@/components/layout/Hero/Hero';
import { Feed } from '@/components/sections/Feed/Feed';
import { FeedControls } from '@/components/sections/FeedControls/FeedControls';
import { useAuth } from '@/hooks/auth/useAuth';
import { useFeed } from '@/hooks/feed/useFeed';

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
