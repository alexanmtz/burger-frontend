import styles from './RestaurantCard.module.css';

export const RestaurantCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={`skeleton ${styles.skeletonImage}`} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '60%' }} />
        <div
          className={`skeleton ${styles.skeletonLine}`}
          style={{ width: '40%', height: '12px' }}
        />
      </div>
    </div>
  );
};
