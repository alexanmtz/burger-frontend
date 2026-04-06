import type { Restaurant } from '@/types/types';

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const DAY_MAP: Record<string, number> = {
  Sun: 0, Sunday: 0,
  Mon: 1, Monday: 1,
  Tue: 2, Tuesday: 2,
  Wed: 3, Wednesday: 3,
  Thu: 4, Thursday: 4,
  Fri: 5, Friday: 5,
  Sat: 6, Saturday: 6,
};

function isDayInRange(dayStr: string, today: number): boolean {
  const sep = dayStr.includes('–') ? '–' : '-';
  if (dayStr.includes(sep)) {
    const [startStr, endStr] = dayStr.split(sep);
    const start = DAY_MAP[startStr.trim()];
    const end = DAY_MAP[endStr.trim()];
    if (start <= end) return today >= start && today <= end;
    return today >= start || today <= end;
  }
  return DAY_MAP[dayStr.trim()] === today;
}

function parseHours(hoursStr: string): { open: number; close: number } | null {
  if (hoursStr === 'Closed') return null;
  const sep = hoursStr.includes('–') ? '–' : '-';
  const [openStr, closeStr] = hoursStr.split(sep);
  const [openH, openM] = openStr.split(':').map(Number);
  const [closeH, closeM] = closeStr.split(':').map(Number);
  const open = openH + openM / 60;
  const close = closeH === 0 && closeM === 0 ? 24 : closeH + closeM / 60;
  return { open, close };
}

export function isOpenNow(openingHours: Restaurant['openingHours']): boolean {
  const now = new Date();
  const today = now.getDay();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  const entry = openingHours.find((h) => isDayInRange(h.day, today));
  if (!entry || entry.hours === 'Closed') return false;

  const hours = parseHours(entry.hours);
  if (!hours) return false;

  return currentHour >= hours.open && currentHour < hours.close;
}
