import styles from './RestaurantCard.module.css';

export const RestaurantCardSkeleton = () => {
  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.imageWrap}>
        <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
      </div>
      <div className={styles.body}>
        <div className={styles.top}>
          <div className="skeleton" style={{ width: '60%', height: '14px', borderRadius: '4px' }} />
          <div className="skeleton" style={{ width: '32px', height: '14px', borderRadius: '4px' }} />
        </div>
        <div className="skeleton" style={{ width: '40%', height: '12px', borderRadius: '4px' }} />
      </div>
    </div>
  );
};
