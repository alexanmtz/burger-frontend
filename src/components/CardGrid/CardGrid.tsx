import styles from './CardGrid.module.css';

import { Fragment } from 'react';

interface CardGridProps<T extends { id: string }> {
  items: T[] | null;
  loading: boolean;
  error?: string | null;
  emptyMessage?: string;
  emptyIcon?: string;
  skeletonCount?: number;
  renderItem: (item: T) => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
}

export function CardGrid<T extends { id: string }>({
  items,
  loading,
  error,
  emptyMessage = 'No items found.',
  emptyIcon = '📭',
  skeletonCount = 4,
  renderItem,
  renderSkeleton,
}: CardGridProps<T>) {
  if (error) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!loading && (!items || items.length === 0)) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">{emptyIcon}</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.grid} stagger`}>
      {loading && renderSkeleton
        ? Array.from({ length: skeletonCount }, (_, i) => (
            <Fragment key={i}>{renderSkeleton()}</Fragment>
          ))
        : items!.map((item) => <Fragment key={item.id}>{renderItem(item)}</Fragment>)}
    </div>
  );
}
