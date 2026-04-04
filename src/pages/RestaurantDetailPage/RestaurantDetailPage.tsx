import { useParams, Link } from 'react-router-dom';
import { BurgerReviewCard } from '@/components/BurgerReviewCard/BurgerReviewCard';
import { useAuth } from '@/hooks/useAuth';
import styles from './RestaurantDetailPage.module.css';
import { isOpenNow } from '@/utils/time';
import { useRestaurant } from '@/hooks/restaurants/useRestaurant';
import { useReviews } from '@/hooks/reviews/useReviews';

export function RestaurantDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { user } = useAuth();

  const {
    data: restaurant,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useRestaurant(id);

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useReviews(id);

  if (restaurantLoading) {
    return (
      <main className="page">
        <div className="container">
          <p className="text-muted">Loading restaurant…</p>
        </div>
      </main>
    );
  }

  if (restaurantError || !restaurant) {
    const notFound = restaurantError?.message.includes('404');
    const message = restaurantError
      ? (notFound ? 'Restaurant not found.' : 'Failed to load restaurant.')
      : 'Restaurant not found.';

    return (
      <main className="page">
        <div className="container">
          <div className="empty-state">
            <span className="empty-state-icon">🍔</span>
            <p>{message}</p>
            <Link to="/restaurants" className="btn btn-ghost">Back to restaurants</Link>
          </div>
        </div>
      </main>
    );
  }

  const open = isOpenNow(restaurant.openingHours);

  return (
    <main className="page">
      <div className={styles.cover}>
        <img src={restaurant.coverImage} alt={restaurant.name} className={styles.coverImg} />
        <div className={styles.coverOverlay} />
        <div className={`container ${styles.coverContent}`}>
          <Link to="/restaurants" className={styles.backLink}>
            ← Restaurants
          </Link>
          <div className={styles.coverMeta}>
            <span className={`badge ${open ? 'badge-open' : 'badge-closed'}`}>
              {open ? 'Open now' : 'Closed'}
            </span>
            <span className="badge badge-amber">{restaurant.cuisine}</span>
            <span className="badge badge-amber">{restaurant.priceRange}</span>
          </div>
          <h1 className={styles.coverTitle}>{restaurant.name}</h1>
          <p className={styles.coverAddress}>{restaurant.address}, {restaurant.city}</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          <section className={styles.main}>
            <div className={styles.reviewsHeader}>
              <h2>{reviews?.length ?? 0} Reviews</h2>
              {user ? (
                <Link to={`/restaurants/${id}/review`} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  + Write a review
                </Link>
              ) : (
                <Link to="/login" className="btn btn-ghost" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                  Sign in to review
                </Link>
              )}
            </div>

            {reviewsLoading && <p className="text-muted">Loading reviews…</p>}
            {reviewsError && <p style={{ color: 'var(--color-error)' }}>Failed to load reviews.</p>}

            {!reviewsLoading && reviews?.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">🍔</span>
                <p>No reviews yet for this restaurant.</p>
              </div>
            )}

            <div className={`${styles.reviewsList} stagger`}>
              {reviews?.map(r => (
                <BurgerReviewCard key={r.id} review={r} />
              ))}
            </div>
          </section>

          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <div className={styles.scoreRow}>
                <div className="score-circle large">{restaurant.averageScore.toFixed(1)}</div>
                <div>
                  <p className={styles.scoreLabel}>Average score</p>
                  <p className="text-muted text-sm">{restaurant.reviewCount} reviews</p>
                </div>
              </div>
            </div>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Opening hours</h3>
              <ul className={styles.hoursList}>
                {restaurant.openingHours.map((row: { day: string; hours: string }, i: number) => (
                  <li key={i} className={styles.hoursRow}>
                    <span className={styles.hoursDay}>{row.day}</span>
                    <span className={`${styles.hoursTime} ${row.hours === 'Closed' ? 'text-muted' : ''}`}>
                      {row.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Contact</h3>
              <p className="text-sm text-muted">{restaurant.phone}</p>
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
              >
                {restaurant.website.replace('https://', '')} →
              </a>
            </div>
            <div className={styles.mapContainer}>
              <iframe
                title={`Map of ${restaurant.name}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${restaurant.lng - 0.01},${restaurant.lat - 0.01},${restaurant.lng + 0.01},${restaurant.lat + 0.01}&layer=mapnik&marker=${restaurant.lat},${restaurant.lng}`}
                className={styles.mapFrame}
                loading="lazy"
              />
              <p className="text-xs text-muted" style={{ marginTop: 6, textAlign: 'center' }}>
                {restaurant.address}, {restaurant.city}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
