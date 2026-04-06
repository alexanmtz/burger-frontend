import styles from './BurgerReviewCard.module.css';

export const BurgerReviewCardSkeleton = () => {
  return (
    <article className={`card ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={`skeleton ${styles.avatar}`} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="skeleton" style={{ width: '40%', height: '14px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '25%', height: '12px', borderRadius: '4px' }} />
          </div>
        </div>
        <div className="skeleton score-circle" />
      </div>
      <div className={styles.imageWrap}>
        <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
      </div>
      <div className={styles.body}>
        <div className="skeleton" style={{ width: '90%', height: '14px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ width: '75%', height: '14px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ width: '55%', height: '14px', borderRadius: '4px' }} />
      </div>
    </article>
  );
};
