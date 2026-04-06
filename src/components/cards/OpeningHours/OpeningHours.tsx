import styles from './OpeningHours.module.css';

interface HoursRow {
  day: string;
  hours: string;
}

interface Props {
  openingHours: HoursRow[];
}

export function OpeningHours({ openingHours }: Props) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Opening hours</h3>
      <ul className={styles.list}>
        {openingHours.map((row, i) => (
          <li key={i} className={styles.row}>
            <span className={styles.day}>{row.day}</span>
            <span className={`${styles.time} ${row.hours === 'Closed' ? 'text-muted' : ''}`}>
              {row.hours}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
