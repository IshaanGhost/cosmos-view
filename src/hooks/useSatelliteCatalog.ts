import { useState, useEffect } from 'react';
import { fetchTLE, parseTLE } from '@/lib/satellite-api';

export interface CatalogSatellite {
  noradId: number;
  name: string;
  epoch: string;
  line1: string | null;
  line2: string | null;
  loading: boolean;
  error: string | null;
}

interface PopularSatellite {
  noradId: number;
  name: string;
}

// Popular satellites to show in catalog
const POPULAR_SATELLITES: PopularSatellite[] = [
  { noradId: 25544, name: 'ISS (ZARYA)' },
  { noradId: 44713, name: 'STARLINK-1007' },
  { noradId: 20580, name: 'HUBBLE SPACE TELESCOPE' },
  { noradId: 33591, name: 'NOAA 19' },
  { noradId: 48274, name: 'TIANGONG SPACE STATION' },
  { noradId: 25994, name: 'TERRA' },
  { noradId: 39634, name: 'SENTINEL-1A' },
];

/**
 * Hook to fetch TLE data for multiple satellites (catalog)
 * Fetches data sequentially to respect API rate limits
 */
export const useSatelliteCatalog = (): {
  satellites: CatalogSatellite[];
  loading: boolean;
  refresh: () => Promise<void>;
} => {
  const [satellites, setSatellites] = useState<CatalogSatellite[]>(
    POPULAR_SATELLITES.map(sat => ({
      noradId: sat.noradId,
      name: sat.name,
      epoch: new Date().toISOString().split('T')[0] + ' 12:00:00',
      line1: null,
      line2: null,
      loading: false,
      error: null,
    }))
  );
  const [loading, setLoading] = useState(true);

  const fetchCatalog = async () => {
    setLoading(true);
    
    // Update all satellites to loading state
    setSatellites(prev => prev.map(sat => ({ ...sat, loading: true, error: null })));

    // Fetch TLE data for each satellite sequentially (to respect rate limits)
    for (let i = 0; i < POPULAR_SATELLITES.length; i++) {
      const sat = POPULAR_SATELLITES[i];
      
      try {
        const response = await fetchTLE(sat.noradId);
        
        if (response) {
          const parsed = parseTLE(response.tle);
          
          setSatellites(prev => 
            prev.map(prevSat => 
              prevSat.noradId === sat.noradId
                ? {
                    ...prevSat,
                    line1: parsed?.line1 || null,
                    line2: parsed?.line2 || null,
                    name: response.info.satname,
                    epoch: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    loading: false,
                    error: parsed ? null : 'Invalid TLE format',
                  }
                : prevSat
            )
          );
        } else {
          // API key not configured or API unavailable
          setSatellites(prev => 
            prev.map(prevSat => 
              prevSat.noradId === sat.noradId
                ? {
                    ...prevSat,
                    loading: false,
                    error: 'API unavailable',
                  }
                : prevSat
            )
          );
        }
      } catch (error) {
        setSatellites(prev => 
          prev.map(prevSat => 
            prevSat.noradId === sat.noradId
              ? {
                  ...prevSat,
                  loading: false,
                  error: error instanceof Error ? error.message : 'Failed to fetch',
                }
              : prevSat
          )
        );
      }

      // Small delay between requests to respect rate limits (free tier: 1000/hour)
      if (i < POPULAR_SATELLITES.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
    // Refresh catalog every hour
    const interval = setInterval(fetchCatalog, 3600000);
    return () => clearInterval(interval);
  }, []);

  return {
    satellites,
    loading,
    refresh: fetchCatalog,
  };
};

