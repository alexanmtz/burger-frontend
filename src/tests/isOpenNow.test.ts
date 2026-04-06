import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isOpenNow } from '@/utils/time';
import type { Restaurant } from '@/types/types';

type OpeningHours = Restaurant['openingHours'];

// Helpers — set fake "now" to a specific weekday + time
function setFakeTime(isoDate: string) {
  vi.setSystemTime(new Date(isoDate));
}

describe('isOpenNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Mon–Sun range (Smoke & Stack)', () => {
    const hours: OpeningHours = [{ day: 'Mon–Sun', hours: '12:00–22:00' }];

    it('returns true on Wednesday at 15:00', () => {
      setFakeTime('2024-03-20T15:00:00'); // Wednesday
      expect(isOpenNow(hours)).toBe(true);
    });

    it('returns false before opening on Saturday at 11:59', () => {
      setFakeTime('2024-03-23T11:59:00'); // Saturday
      expect(isOpenNow(hours)).toBe(false);
    });

    it('returns false at exactly closing time (22:00)', () => {
      setFakeTime('2024-03-18T22:00:00'); // Monday
      expect(isOpenNow(hours)).toBe(false);
    });

    it('returns true at exactly opening time (12:00)', () => {
      setFakeTime('2024-03-18T12:00:00'); // Monday
      expect(isOpenNow(hours)).toBe(true);
    });
  });

  // ── Bun & Board: Mon–Thu 11:00–22:00 / Fri–Sat 11:00–00:00 / Sunday 12:00–21:00 ──
  describe('multi-entry schedule (Bun & Board)', () => {
    const hours: OpeningHours = [
      { day: 'Mon–Thu', hours: '11:00–22:00' },
      { day: 'Fri–Sat', hours: '11:00–00:00' },
      { day: 'Sunday', hours: '12:00–21:00' },
    ];

    it('returns true on Tuesday at 13:30', () => {
      setFakeTime('2024-03-19T13:30:00'); // Tuesday
      expect(isOpenNow(hours)).toBe(true);
    });

    it('returns false on Thursday after closing (22:30)', () => {
      setFakeTime('2024-03-21T22:30:00'); // Thursday
      expect(isOpenNow(hours)).toBe(false);
    });

    it('returns true on Friday at 23:30 (closes midnight)', () => {
      setFakeTime('2024-03-22T23:30:00'); // Friday
      expect(isOpenNow(hours)).toBe(true);
    });

    it('returns true on Saturday at 23:59 (closes midnight)', () => {
      setFakeTime('2024-03-23T23:59:00'); // Saturday
      expect(isOpenNow(hours)).toBe(true);
    });

    it('returns true on Sunday at 14:00', () => {
      setFakeTime('2024-03-24T14:00:00'); // Sunday
      expect(isOpenNow(hours)).toBe(true);
    });

    it('returns false on Sunday after 21:00', () => {
      setFakeTime('2024-03-24T21:01:00'); // Sunday
      expect(isOpenNow(hours)).toBe(false);
    });
  });
  describe('Closed entries (The Patty Collective)', () => {
    const hours: OpeningHours = [
      { day: 'Tue–Thu', hours: '12:00–22:00' },
      { day: 'Fri–Sat', hours: '12:00–23:00' },
      { day: 'Sun–Mon', hours: 'Closed' },
    ];

    it('returns false on Sunday (Closed)', () => {
      setFakeTime('2024-03-17T15:00:00'); // Sunday
      expect(isOpenNow(hours)).toBe(false);
    });

    it('returns false on Monday (Closed)', () => {
      setFakeTime('2024-03-18T15:00:00'); // Monday
      expect(isOpenNow(hours)).toBe(false);
    });

    it('returns true on Wednesday at 20:00', () => {
      setFakeTime('2024-03-20T20:00:00'); // Wednesday
      expect(isOpenNow(hours)).toBe(true);
    });

    it('returns true on Saturday at 22:30', () => {
      setFakeTime('2024-03-23T22:30:00'); // Saturday
      expect(isOpenNow(hours)).toBe(true);
    });

    it('returns false on Friday before opening (11:59)', () => {
      setFakeTime('2024-03-22T11:59:00'); // Friday
      expect(isOpenNow(hours)).toBe(false);
    });
  });
  describe('half-hour opening time (Grind House)', () => {
    const hours: OpeningHours = [
      { day: 'Mon–Fri', hours: '11:30–22:00' },
      { day: 'Sat–Sun', hours: '12:00–23:00' },
    ];

    it('returns false on Monday at 11:29', () => {
      setFakeTime('2024-03-18T11:29:00'); // Monday
      expect(isOpenNow(hours)).toBe(false);
    });

    it('returns true on Monday at 11:30', () => {
      setFakeTime('2024-03-18T11:30:00'); // Monday
      expect(isOpenNow(hours)).toBe(true);
    });

    it('returns true on Sunday at 22:00', () => {
      setFakeTime('2024-03-24T22:00:00'); // Sunday
      expect(isOpenNow(hours)).toBe(true);
    });

    it('returns false on Sunday at 23:00', () => {
      setFakeTime('2024-03-24T23:00:00'); // Sunday
      expect(isOpenNow(hours)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns false for an empty schedule', () => {
      setFakeTime('2024-03-20T15:00:00');
      expect(isOpenNow([])).toBe(false);
    });
  });
});
