import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Review } from '@/types/types';
import { StarRating } from '../StarRating/StarRating';
import { ScoreBreakdown } from '../ScoreBreakdown/ScoreBreakdown';
import styles from './BurgerReviewCard.module.css';
import { useUser } from '@/hooks/users/useUser';
import { useRestaurant } from '@/hooks/restaurants/useRestaurant';
import { formatDate } from '@/utils/time';

interface BurgerReviewCardProps {
  review: Review;
}

export function BurgerReviewCard({ review }: BurgerReviewCardProps) {
  const [expanded, setExpanded] = useState(false);

  const { data: user } = useUser(review.userId);
  const { data: restaurant } = useRestaurant(review.restaurantId);

  return (
    <article className={`card ${styles.card} animate-fade-in-up`}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          {user && (
            <img src={user.avatar} alt={user.name} className={styles.avatar} />
          )}
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
        <button
          className={styles.action}
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
        >
          <svg
            width="12" height="12" viewBox="0 0 12 12"
            style={{ transform: expanded ? 'rotate(180deg)' : undefined, transition: 'transform 200ms' }}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {expanded ? 'Hide' : 'Show'} score breakdown
        </button>
        {expanded && (
          <div className={styles.breakdown}>
            <ScoreBreakdown scores={review.scores} />
          </div>
        )}
      </div>
    </article>
  );
}
