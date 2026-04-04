import { useNavigate, useParams, Link } from 'react-router-dom';
import { useRestaurant } from '@/hooks/restaurants/useRestaurant';
import { CreateReviewForm } from '@/components/CreateReviewForm/CreateReviewForm';
import styles from './SubmitReviewPage.module.css';

export function SubmitReviewPage() {
  const navigate = useNavigate();
  const { id: restaurantId } = useParams<{ id: string }>();
  const { data: restaurant } = useRestaurant(restaurantId ?? '');

  const handleSuccess = () => {
    navigate(restaurantId ? `/restaurants/${restaurantId}` : '/');
  };

  return (
    <main className="page">
      <div className="container">
        <div className={styles.wrap}>
          {restaurantId && restaurant && (
            <Link to={`/restaurants/${restaurantId}`} className={styles.backLink}>
              ← {restaurant.name}
            </Link>
          )}

          <div className={styles.titleBlock}>
            {restaurant ? (
              <>
                <h1>Share a review for</h1>
                <p className={styles.restaurantName}>{restaurant.name}</p>
              </>
            ) : (
              <>
                <h1>Share a review</h1>
                <p className="text-muted">Tell the community about your burger experience.</p>
              </>
            )}
          </div>

          <CreateReviewForm restaurant={restaurant} onSuccess={handleSuccess} />
        </div>
      </div>
    </main>
  );
}
