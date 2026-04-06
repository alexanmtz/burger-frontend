import styles from './LoginPage.module.css';

import { type JSX, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { redirectAfterLogin } from '@/storage/redirectAfterLogin';

const mockLoginEnabled = import.meta.env.VITE_USE_SUPABASE === 'false';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const from = redirectAfterLogin.get();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<JSX.Element | string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn({ email, password });
      redirectAfterLogin.clear();
      navigate(from, { replace: true });
    } catch {
      setError(
        <>
          Invalid credentials. <br />
          Please try again with a valid email and password.
        </>,
      );
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="container">
        <div className={styles.wrap}>
          <div className={styles.header}>
            <span className={styles.icon}>🍔</span>
            <h1>Welcome back</h1>
            <p className="text-muted">Sign in to share your burger reviews.</p>
          </div>

          {mockLoginEnabled && (
            <div className={styles.mockNotice}>
              <strong>Demo mode:</strong> any email and password will work.
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className={styles.footer}>
            Don't have an account?{' '}
            <Link to="/" className={styles.link}>
              Explore as guest
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
