/**
 * Satellite API Service
 * Integrates with N2YO.com REST API v1 for real-time satellite tracking
 * Documentation: https://www.n2yo.com/api
 */

export interface TLEResponse {
  info: {
    satname: string;
    satid: number;
    transactionscount: number;
  };
  tle: string;
}

export interface PositionResponse {
  info: {
    satname: string;
    satid: number;
    transactionscount: number;
    satlatitude: number;
    satlongitude: number;
    sataltitude: number;
    azimuth: number;
    elevation: number;
    ra: number;
    dec: number;
    timestamp: number;
    units: string;
  };
  positions: Array<{
    satlatitude: number;
    satlongitude: number;
    sataltitude: number;
    azimuth: number;
    elevation: number;
    ra: number;
    dec: number;
    timestamp: number;
  }>;
}

export interface SatelliteCatalogItem {
  satid: number;
  satname: string;
  intDesignator: string;
  launchDate: string;
  satlat: number;
  satlng: number;
  satalt: number;
}

const API_BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

/**
 * Get API key from environment variable
 * Users should register at https://www.n2yo.com/login/ and generate an API key
 */
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_N2YO_API_KEY;
  if (!apiKey) {
    console.warn(
      'N2YO API key not found. Please set VITE_N2YO_API_KEY in your .env file.\n' +
      'Register at https://www.n2yo.com/login/ and generate an API key from your profile page.'
    );
  }
  return apiKey || '';
};

/**
 * Fetch TLE (Two-Line Element) data for a satellite
 * @param noradId NORAD catalog number (e.g., 25544 for ISS)
 * @returns TLE data or null if error
 */
export const fetchTLE = async (noradId: number): Promise<TLEResponse | null> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/tle/${noradId}?apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: TLEResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching TLE for satellite ${noradId}:`, error);
    return null;
  }
};

/**
 * Fetch current position of a satellite
 * @param noradId NORAD catalog number
 * @param observerLat Observer latitude (optional, for elevation/azimuth)
 * @param observerLng Observer longitude (optional, for elevation/azimuth)
 * @param observerAlt Observer altitude in meters (optional)
 * @param seconds Number of seconds to predict (max 300)
 * @returns Position data or null if error
 */
export const fetchPosition = async (
  noradId: number,
  observerLat?: number,
  observerLng?: number,
  observerAlt?: number,
  seconds: number = 1
): Promise<PositionResponse | null> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    // N2YO positions endpoint already includes observer coordinates in the path
    const response = await fetch(
      `${API_BASE_URL}/positions/${noradId}/${observerLat || 0}/${observerLng || 0}/${observerAlt || 0}/${seconds}?apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: PositionResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching position for satellite ${noradId}:`, error);
    return null;
  }
};

/**
 * Parse TLE string into separate lines
 * @param tleString Combined TLE string from API
 * @returns Object with line1 and line2, or null if invalid
 */
export const parseTLE = (tleString: string): { line1: string; line2: string } | null => {
  const lines = tleString.split('\n').filter(line => line.trim().length > 0);
  if (lines.length >= 2) {
    return {
      line1: lines[0].trim(),
      line2: lines[1].trim()
    };
  }
  return null;
};

/**
 * Get visual passes (when satellite will be visible)
 * @param noradId NORAD catalog number
 * @param observerLat Observer latitude
 * @param observerLng Observer longitude
 * @param observerAlt Observer altitude in meters
 * @param days Number of days to predict (max 10)
 * @param minVisibility Minimum visibility threshold (1-10)
 * @returns Array of pass predictions
 */
export const fetchVisualPasses = async (
  noradId: number,
  observerLat: number,
  observerLng: number,
  observerAlt: number = 0,
  days: number = 10,
  minVisibility: number = 1
): Promise<any> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/visualpasses/${noradId}/${observerLat}/${observerLng}/${observerAlt}/${days}/${minVisibility}?apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching visual passes for satellite ${noradId}:`, error);
    return null;
  }
};

/**
 * Check if API key is configured
 */
export const isApiKeyConfigured = (): boolean => {
  return !!import.meta.env.VITE_N2YO_API_KEY;
};

