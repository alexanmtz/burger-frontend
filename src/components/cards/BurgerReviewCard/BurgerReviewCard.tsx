import styles from './BurgerReviewCard.module.css';

import { Link } from 'react-router-dom';

import { ScoreBreakdown } from '@/components/score/ScoreBreakdown/ScoreBreakdown';
import { StarRating } from '@/components/score/StarRating/StarRating';
import { useRestaurant } from '@/hooks/restaurants/useRestaurant';
import { useUser } from '@/hooks/users/useUser';
import type { Review } from '@/types/types';
import { formatDate } from '@/utils/time';

interface BurgerReviewCardProps {
  review: Review;
}

export function BurgerReviewCard({ review }: BurgerReviewCardProps) {
  const { data: user } = useUser(review.userId);
  const { data: restaurant } = useRestaurant(review.restaurantId);

  return (
    <article className={`card ${styles.card} animate-fade-in-up`}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          {user && <img src={user.avatar} alt={user.name} className={styles.avatar} />}
          <div>
            <p className={styles.userName}>{user?.name ?? 'Unknown'}</p>
            <p className={styles.meta}>
              {restaurant && (
                <Link to={`/restaurants/${restaurant.id}`} className={styles.restaurantLink}>
                  {restaurant.name}
                </Link>
              )}
              <span className="text-muted"> · {formatDate(review.createdAt)}</span>
            </p>
          </div>
        </div>
        <div className="score-circle">{review.overallScore.toFixed(1)}</div>
      </div>

      {review.imageUrl && (
        <div className={styles.imageWrap}>
          <img src={review.imageUrl} alt={review.burgerName} className={styles.image} />
          <div className={styles.burgerNameOverlay}>{review.burgerName}</div>
        </div>
      )}

      <div className={styles.body}>
        <p className={styles.caption}>{review.caption}</p>
        <div className={styles.starsRow}>
          <StarRating value={review.overallScore} readonly size="sm" />
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.breakdown}>
          <ScoreBreakdown scores={review.scores} />
        </div>
      </div>
    </article>
  );
}
