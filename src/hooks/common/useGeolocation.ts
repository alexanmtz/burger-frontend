import { useCallback, useState } from 'react';

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(): GeolocationState & { request: () => void } {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    loading: false,
    error: null,
  });

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (err) => {
        const messages: Record<number, string> = {
          1: 'Location access was denied. Enable it in your browser settings.',
          2: 'Location unavailable. Check your device settings.',
          3: 'Location request timed out. Please try again.',
        };
        setState({
          lat: null,
          lng: null,
          loading: false,
          error: messages[err.code] ?? 'An unknown error occurred.',
        });
      },
      { timeout: 10_000, maximumAge: 60_000, enableHighAccuracy: false },
    );
  }, []);

  return { ...state, request };
}
