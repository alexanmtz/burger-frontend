import type { Restaurant } from '@/types/types';

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function isOpenNow(openingHours: Restaurant['openingHours']): boolean {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  const hasOpenEntry = openingHours.some((h) => h.hours !== 'Closed');
  if (!hasOpenEntry) return false;

  // Default heuristic: open between 10:00 and 23:00
  return hour >= 10 && hour < 23;
}
