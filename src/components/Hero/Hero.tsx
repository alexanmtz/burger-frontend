import styles from './Hero.module.css';
import { Link } from 'react-router-dom';
import heroBurger from '../../assets/hero-burguer.jpg';
import type { User } from '@/types/types';

export const Hero = ({ user }: { user: User | null }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroImage}>
        <img width="800" src={heroBurger} alt="Delicious burger" />
      </div>
      <div className={styles.heroText}>
        <h1>
          Discover the world's <br /><em className={styles.heroAccent}>best burgers,</em><br />
          Tasted by <br /> <em className={styles.heroAccentAlt}>burger lovers</em>
        </h1>
        <p className={styles.heroSub}>
          A social platform for burger fanatics. Score taste, texture & presentation.
        </p>
        <div className={styles.heroCta}>
          {user ? (
            <Link to="/submit" className="btn btn-primary">Share a review</Link>
          ) : (
            <Link to="/login" className="btn btn-primary">Get started</Link>
          )}
          <Link to="/restaurants" className="btn btn-ghost">Explore restaurants</Link>
        </div>
      </div>
    </section>
  );
};