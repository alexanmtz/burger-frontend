import styles from './RestaurantsPage.module.css';

import { useState } from 'react';

import { CardGrid } from '@/components/CardGrid/CardGrid';
import { RestaurantCard } from '@/components/RestaurantCard/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/RestaurantCard/RestaurantCard.skeleton';
import { PageTitle } from '@/components/Typography/PageTitle/PageTitle';
import { useGeolocation } from '@/hooks/common/useGeolocation';
import { useNearbyRestaurants } from '@/hooks/restaurants/useNearbyRestaurants';
import { useRestaurants } from '@/hooks/restaurants/useRestaurants';
import { useSearchRestaurants } from '@/hooks/restaurants/useSearchRestaurants';

export function RestaurantsPage() {
  const [query, setQuery] = useState('');
  const [userDismissedNearby, setUserDismissedNearby] = useState(false);

  const geo = useGeolocation();

  const nearbyMode = !!geo.lat && !!geo.lng && !geo.loading && !userDismissedNearby;

  const allQuery = useRestaurants();
  const searchQuery = useSearchRestaurants(query);
  const nearbyQuery = useNearbyRestaurants(geo.lat ?? 0, geo.lng ?? 0);

  const activeQuery = nearbyMode ? nearbyQuery : query.trim() ? searchQuery : allQuery;

  const { data: restaurants = [], isLoading: loading, error } = activeQuery;

  const handleNearMe = () => {
    setUserDismissedNearby(false);
    geo.request();
  };

  const resetNearby = () => {
    setUserDismissedNearby(true);
  };

  return (
    <main className="page">
      <div className="container">
        <PageTitle
          title="Restaurants"
          subtitle="Discover burger joints near you or search by name."
          controls={
            <div className={styles.controls}>
              <div className={styles.searchWrap}>
                <input
                  type="search"
                  className={`form-input ${styles.searchInput}`}
                  placeholder="Search restaurants"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setUserDismissedNearby(true);
                  }}
                  aria-label="Search restaurants"
                />
                <svg
                  className={styles.searchIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>

              <button
                className={`btn ${nearbyMode ? 'btn-primary' : 'btn-ghost'}`}
                onClick={nearbyMode ? resetNearby : handleNearMe}
                disabled={geo.loading}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                </svg>
                {geo.loading ? 'Locating…' : nearbyMode ? 'Clear nearby' : 'Near me'}
              </button>
            </div>
          }
        />

        {geo.error && <p className={styles.geoError}>{geo.error}</p>}

        {nearbyMode && geo.lat && (
          <p className={styles.nearbyNote}>Showing restaurants within 5 km of your location.</p>
        )}

        {!loading && !error && (
          <p className={styles.count}>
            {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
          </p>
        )}

        <CardGrid
          items={restaurants}
          loading={loading}
          error={error?.message ?? null}
          emptyMessage={
            nearbyMode
              ? 'No restaurants found near your location.'
              : `No restaurants found for "${query}"`
          }
          emptyIcon="🔍"
          skeletonCount={4}
          renderSkeleton={() => <RestaurantCardSkeleton />}
          renderItem={(r) => {
            let distanceKm: number | null = null;
            if (geo.lat && geo.lng) {
              const dlat = r.lat - geo.lat;
              const dlng = r.lng - geo.lng;
              const cosLat = Math.cos((geo.lat * Math.PI) / 180);
              distanceKm = +Math.sqrt(
                dlat * dlat * 111 * 111 + dlng * dlng * (111 * cosLat) * (111 * cosLat),
              ).toFixed(1);
            }
            return <RestaurantCard restaurant={r} distanceKm={distanceKm} />;
          }}
        />
      </div>
    </main>
  );
}
