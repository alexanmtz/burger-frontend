import styles from './PageTitle.module.css';

type PageTitleProps = {
  title: string;
  subtitle?: string;
  controls: React.ReactNode;
};

export const PageTitle = ({ title, subtitle, controls }: PageTitleProps) => {
  return (
    <div className={styles.header}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="text-muted" style={{ marginTop: 8 }}>{subtitle}</p>}
      </div>
      {controls}
    </div>
  );
};