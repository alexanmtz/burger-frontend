import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserReviews } from '@/hooks/reviews/useUserReviews';
import { BurgerReviewCard } from '@/components/BurgerReviewCard/BurgerReviewCard';
import { FeedSkeleton } from '@/components/Feed/Feed.skeleton';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { user } = useAuth();
  const { data: reviews, isLoading, error } = useUserReviews(user?.id);

  const userName = user?.name.split(' ')[0] || 'Foodie';

  const avgScore = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviews.length).toFixed(1)
    : null;


  return (
    <main className="page">
      <div className="container">
        <div className={styles.header}>
          {user?.avatar && (
            <img src={user.avatar} alt={userName} className={styles.avatar} />
          )}
          <div>
            <h1 className={styles.greeting}>Welcome back, {userName}!</h1>
            {user?.bio && <p className="text-muted">{user.bio}</p>}
          </div>
        </div>
        <hr className="divider" />
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{reviews?.length ?? 0}</span>
            <span className={styles.statLabel}>Reviews</span>
          </div>
          {avgScore && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{avgScore}</span>
              <span className={styles.statLabel}>Avg Score</span>
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <Link to="/submit" className="btn btn-primary">
            Write a Review
          </Link>
          <Link to="/restaurants" className="btn btn-secondary">
            Browse Restaurants
          </Link>
        </div>

        <hr className="divider" />

        {/* User's reviews */}
        <h2 className={styles.sectionTitle}>Your Reviews</h2>

        {isLoading && (
          <div className={styles.feed}>
            <FeedSkeleton />
            <FeedSkeleton />
          </div>
        )}

        {error && <p className="text-muted">Could not load your reviews.</p>}

        {!isLoading && reviews?.length === 0 && (
          <div className={styles.empty}>
            <p>You haven't posted any reviews yet.</p>
            <Link to="/submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
              Write your first review
            </Link>
          </div>
        )}

        {!isLoading && reviews && reviews.length > 0 && (
          <div className={styles.feed}>
            {reviews.map(review => (
              <BurgerReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
