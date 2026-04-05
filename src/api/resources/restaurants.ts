import type { Restaurant } from '@/types/types';

import { apiFetch as api } from '../connect/api';

export function getRestaurants() {
  return api<Restaurant[]>('/restaurants');
}

export function getRestaurant(id: string) {
  return api<Restaurant>(`/restaurants/${id}`);
}

export async function searchRestaurants(query: string): Promise<Restaurant[]> {
  const restaurants = await getRestaurants();
  const q = query.trim().toLowerCase();

  if (!q) return restaurants;

  return restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q),
  );
}

export async function getNearbyRestaurants(
  lat: number,
  lng: number,
  radiusKm = 5,
): Promise<Restaurant[]> {
  const restaurants = await getRestaurants();
  const filtered = restaurants.filter((r) => {
    const dlat = r.lat - lat;
    const dlng = r.lng - lng;
    const dist = Math.sqrt(dlat * dlat + dlng * dlng) * 111;
    return dist <= radiusKm;
  });

  return filtered.length ? filtered : restaurants;
}
