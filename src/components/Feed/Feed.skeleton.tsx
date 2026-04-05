import styles from './Feed.module.css';

export const FeedSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonHeader}>
        <div className={`skeleton ${styles.skeletonAvatar}`} />
        <div className={styles.skeletonLines}>
          <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '40%' }} />
          <div
            className={`skeleton ${styles.skeletonLine}`}
            style={{ width: '25%', height: '12px' }}
          />
        </div>
      </div>
      <div className={`skeleton ${styles.skeletonImage}`} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '90%' }} />
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '75%' }} />
        <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '55%' }} />
      </div>
    </div>
  );
};
