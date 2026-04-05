import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { redirectAfterLogin } from '@/storage/redirectAfterLogin';

import styles from './Navigation.module.css';

export function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  return (
    <header className={`glass ${styles.nav}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🍔</span>
          <span className={styles.logoText}>
            Burger<em>Lovers</em>
          </span>
        </Link>
        <nav className={styles.links}>
          <NavLink to="/reviews" className={navLinkClass}>
            Reviews
          </NavLink>
          <NavLink to="/restaurants" className={navLinkClass}>
            Restaurants
          </NavLink>
        </nav>
        <div className={styles.auth}>
          {user ? (
            <div className={styles.userMenu}>
              <Link to="/dashboard" className={styles.userIdentity}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className={styles.avatar} />
                ) : (
                  <span className={styles.avatarPlaceholder}>{user.name.charAt(0)}</span>
                )}
                <span className={styles.userName}>{user.name}</span>
              </Link>
              <button
                className="btn btn-ghost"
                onClick={handleSignOut}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
              onClick={() => redirectAfterLogin.set(location.pathname)}
            >
              Sign in
            </Link>
          )}
        </div>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </div>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {user && (
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
          )}
          <NavLink to="/reviews" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Reviews
          </NavLink>
          <NavLink to="/restaurants" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            Restaurants
          </NavLink>
          {user && (
            <button className={`btn btn-ghost ${styles.mobileSignOut}`} onClick={handleSignOut}>
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
