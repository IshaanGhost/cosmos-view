import { useState, useEffect } from 'react';
import { fetchTLE, parseTLE, TLEResponse } from '@/lib/satellite-api';

export interface TLEData {
  line1: string;
  line2: string;
  satelliteName: string;
  noradId: number;
}

/**
 * Hook to fetch and refresh TLE data for a satellite
 * @param noradId NORAD catalog number
 * @param refreshInterval Refresh interval in milliseconds (default: 3600000 = 1 hour)
 * @returns TLE data, loading state, and error state
 */
export const useSatelliteTLE = (
  noradId: number,
  refreshInterval: number = 3600000 // 1 hour default
): {
  tle: TLEData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} => {
  const [tle, setTLE] = useState<TLEData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchTLE(noradId);
      
      if (!response) {
        setError('API key not configured or API unavailable');
        setLoading(false);
        return;
      }

      const parsed = parseTLE(response.tle);
      if (parsed) {
        setTLE({
          line1: parsed.line1,
          line2: parsed.line2,
          satelliteName: response.info.satname,
          noradId: response.info.satid,
        });
      } else {
        setError('Invalid TLE data received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch TLE data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up periodic refresh
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [noradId, refreshInterval]);

  return {
    tle,
    loading,
    error,
    refresh: fetchData,
  };
};

