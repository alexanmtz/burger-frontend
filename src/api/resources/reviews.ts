import type { Restaurant, Review } from '@/types/types';

import { authConnector } from '@/api/auth';
import { apiFetch as api } from '@/api/connect/api';

async function updateRestaurantStats(restaurantId: string): Promise<void> {
  const reviews = await api<Review[]>(`/reviews?restaurantId=${restaurantId}`);

  const reviewCount = reviews.length;
  const averageScore = reviewCount
    ? +(reviews.reduce((total, r) => total + r.overallScore, 0) / reviewCount).toFixed(1)
    : 0;

  await api<Restaurant>(`/restaurants/${restaurantId}`, {
    method: 'PATCH',
    body: JSON.stringify({ averageScore, reviewCount }),
  });
}

export function getReviews() {
  return api<Review[]>('/reviews');
}

export async function getReviewsByRestaurant(restaurantId: string): Promise<Review[]> {
  const reviews = await api<Review[]>(`/reviews?restaurantId=${restaurantId}`);
  return [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getReviewsByUser(userId: string): Promise<Review[]> {
  const reviews = await api<Review[]>(`/reviews?userId=${userId}`);
  return [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getFeed(sort: 'recent' | 'top' = 'recent'): Promise<Review[]> {
  const reviews = await api<Review[]>('/reviews');
  return [...reviews].sort((a, b) =>
    sort === 'top'
      ? b.overallScore - a.overallScore
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export interface ReviewPayload {
  restaurantId: string;
  burgerName: string;
  caption: string;
  imageUrl: string;
  scores: { taste: number; texture: number; presentation: number };
}

export async function submitReview(payload: ReviewPayload): Promise<Review> {
  const { user } = await authConnector.getInitialSession();
  if (!user) throw new Error('User must be authenticated to submit a review.');

  const newReview: Review = {
    id: `rv${Date.now()}`,
    userId: user.id,
    overallScore: +(
      (payload.scores.taste + payload.scores.texture + payload.scores.presentation) /
      3
    ).toFixed(1),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  const createdReview = await api<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(newReview),
  });

  try {
    await updateRestaurantStats(payload.restaurantId);
  } catch {
    // Keep the submitted review even if derived restaurant stats could not be updated.
  }

  return createdReview;
}
