import styles from './ScoreBreakdown.module.css';

interface ScoreBreakdownProps {
  scores: {
    taste: number;
    texture: number;
    presentation: number;
  };
}

const DIMENSIONS = [
  { key: 'taste',        label: 'Taste' },
  { key: 'texture',      label: 'Texture' },
  { key: 'presentation', label: 'Presentation' },
] as const;

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  return (
    <div className={styles.breakdown}>
      {DIMENSIONS.map(({ key, label }) => {
        const val = scores[key];
        const pct = (val / 10) * 100;
        return (
          <div key={key} className={styles.row}>
            <span className={styles.label}>{label}</span>
            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{ '--bar-width': `${pct}%` } as React.CSSProperties}
              />
            </div>
            <span className={styles.value}>{val.toFixed(1)}</span>
          </div>
        );
      })}
    </div>
  );
}
