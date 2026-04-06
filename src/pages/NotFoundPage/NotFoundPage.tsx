import styles from './NotFoundPage.module.css';

import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="page">
      <div className="container">
        <div className={styles.wrap}>
          <div className={styles.icon}>🍔</div>
          <h1 className={styles.code}>404</h1>
          <h2 className={styles.title}>Patty not found</h2>
          <p className="text-muted">
            The page you're looking for has vanished — like the last burger at a BBQ.
          </p>
          <div className={styles.actions}>
            <Link to="/" className="btn btn-primary">
              Back to the feed
            </Link>
            <Link to="/restaurants" className="btn btn-ghost">
              Browse restaurants
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
