import { Link } from 'react-router-dom';
import type { Restaurant } from '@/types/types';
import styles from './RestaurantCard.module.css';
import { isOpenNow } from '@/utils/time';

interface RestaurantCardProps {
  restaurant: Restaurant;
  distanceKm?: number | null;
}

export function RestaurantCard({ restaurant, distanceKm }: RestaurantCardProps) {
  const open = isOpenNow(restaurant.openingHours);

  return (
    <Link to={`/restaurants/${restaurant.id}`} className={`card ${styles.card}`}>
      <div className={styles.imageWrap}>
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className={styles.image}
        />
        <div className={styles.overlay}>
          <span className={`badge ${open ? 'badge-open' : 'badge-closed'}`}>
            <span className={styles.dot} />
            {open ? 'Open now' : 'Closed'}
          </span>
          {distanceKm !== undefined && distanceKm !== null && (
            <span className="badge badge-amber">{distanceKm.toFixed(1)} km</span>
          )}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.top}>
          <h3 className={styles.name}>{restaurant.name}</h3>
          <div className={styles.score}>
            <span className={styles.scoreNum}>{restaurant.averageScore.toFixed(1)}</span>
            <span className={styles.scoreMax}>/10</span>
          </div>
        </div>

        <p className={styles.meta}>
          <span>{restaurant.cuisine}</span>
          <span className={styles.dot2}>·</span>
          <span>{restaurant.priceRange}</span>
          <span className={styles.dot2}>·</span>
          <span className="text-muted">{restaurant.city}</span>
        </p>

        <p className="text-muted text-sm">{restaurant.reviewCount} reviews</p>
      </div>
    </Link>
  );
}
