import styles from './FeedControls.module.css';

type FeedControlsProps = {
  sort: 'recent' | 'top';
  setSort: (sort: 'recent' | 'top') => void;
  hasTitle?: boolean;
  title?: string;
};

export const FeedControls = ({ sort, setSort, hasTitle = true, title }: FeedControlsProps) => {
  return (
    <div className={styles.feedHeader}>
      {hasTitle && <h2 className={styles.feedTitle}>{title || 'Latest reviews'}</h2>}
      <div className={styles.sortButtons}>
        <button
          className={`btn ${sort === 'recent' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setSort('recent')}
        >
          Recent
        </button>
        <button
          className={`btn ${sort === 'top' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setSort('top')}
        >
          Top rated
        </button>
      </div>
    </div>
  );
};
