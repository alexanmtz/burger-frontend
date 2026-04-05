import { useState } from 'react';

import styles from './StarRating.module.css';

interface StarRatingProps {
  value: number; // 0–10
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  const display = hover !== null ? hover : value;
  const stars = 5;

  const getFill = (starIndex: number): 'full' | 'half' | 'empty' => {
    const threshold = (starIndex + 1) * 2;
    if (display >= threshold) return 'full';
    if (display >= threshold - 1) return 'half';
    return 'empty';
  };

  return (
    <div
      data-testid="star-rating"
      className={`${styles.stars} ${styles[size]} ${readonly ? styles.readonly : ''}`}
      role={readonly ? 'img' : 'group'}
      aria-label={`Rating: ${value} out of 10`}
    >
      {Array.from({ length: stars }, (_, i) => {
        const fill = getFill(i);
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            className={`${styles.star} ${styles[fill]}`}
            onClick={() => !readonly && onChange?.((i + 1) * 2)}
            onMouseEnter={() => !readonly && setHover((i + 1) * 2)}
            onMouseLeave={() => !readonly && setHover(null)}
            aria-label={`${(i + 1) * 2} out of 10`}
          >
            {fill === 'full' && (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
            {fill === 'half' && (
              <svg viewBox="0 0 24 24">
                <defs>
                  <linearGradient id={`half-${i}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={`url(#half-${i})`}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            )}
            {fill === 'empty' && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </button>
        );
      })}
      {!readonly && <span className={styles.score}>{hover ?? value}/10</span>}
    </div>
  );
}
