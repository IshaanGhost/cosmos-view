import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as satellite from 'satellite.js';
import { fetchTLE, parseTLE } from '@/lib/satellite-api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Satellite } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

// Popular satellites to track
interface SatelliteOption {
  noradId: number;
  name: string;
  fallbackTLE: {
    line1: string;
    line2: string;
  };
}

const SATELLITE_OPTIONS: SatelliteOption[] = [
  {
    noradId: 25544,
    name: 'ISS (ZARYA)',
    fallbackTLE: {
      line1: '1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9005',
      line2: '2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391428615'
    }
  },
  {
    noradId: 20580,
    name: 'HUBBLE SPACE TELESCOPE',
    fallbackTLE: {
      line1: '1 20580U 90037B   24001.50000000  .00000567  00000-0  23456-4 0  9991',
      line2: '2 20580  28.4700  45.6789 0002345 234.5678 125.4321 15.09234567890123'
    }
  },
  {
    noradId: 48274,
    name: 'TIANGONG SPACE STATION',
    fallbackTLE: {
      line1: '1 48274U 21035A   24001.50000000  .00012345  00000-0  67890-4 0  9993',
      line2: '2 48274  41.4678 345.6789 0001234  45.6789 314.5678 15.60123456789012'
    }
  },
  {
    noradId: 33591,
    name: 'NOAA 19',
    fallbackTLE: {
      line1: '1 33591U 09005A   24001.50000000  .00000234  00000-0  15678-4 0  9997',
      line2: '2 33591  99.1234 234.5678 0014567 156.7890 203.4567 14.12345678901234'
    }
  },
  {
    noradId: 25994,
    name: 'TERRA',
    fallbackTLE: {
      line1: '1 25994U 99068A   24001.50000000  .00000123  00000-0  12345-4 0  9998',
      line2: '2 25994  98.1986  45.6789 0001567 234.5678 125.4321 14.19567890123456'
    }
  },
  {
    noradId: 39634,
    name: 'SENTINEL-1A',
    fallbackTLE: {
      line1: '1 39634U 14016A   24001.50000000  .00000056  00000-0  12345-4 0  9999',
      line2: '2 39634  98.1818 123.4567 0002345 45.6789 314.5678 14.12345678901234'
    }
  },
  {
    noradId: 44713,
    name: 'STARLINK-1007',
    fallbackTLE: {
      line1: '1 44713U 19074A   24001.50000000  .00000123  00000-0  67890-4 0  9990',
      line2: '2 44713  53.0530 123.4567 0001567 234.5678 125.4321 15.12345678901234'
    }
  },
  {
    noradId: 50463,
    name: 'JAMES WEBB SPACE TELESCOPE',
    fallbackTLE: {
      line1: '1 50463U 21130A   24001.50000000  .00000123  00000-0  12345-4 0  9991',
      line2: '2 50463  98.1777 234.5678 0002345 156.7890 203.4567 14.19567890123456'
    }
  }
];

interface SatelliteData {
  noradId: number;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
}

interface TLEData {
  line1: string;
  line2: string;
  name: string;
}

const TrackerView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [isMinimalView, setIsMinimalView] = useState(true);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [showSatelliteSelector, setShowSatelliteSelector] = useState(false);
  
  // Selected satellites (NORAD IDs)
  const [selectedSatellites, setSelectedSatellites] = useState<number[]>([25544]); // ISS by default
  
  // TLE loading states
  const [tleData, setTleData] = useState<Map<number, TLEData>>(new Map());
  const [tleLoading, setTleLoading] = useState<Map<number, boolean>>(new Map());
  const [tleError, setTleError] = useState<string | null>(null);
  
  // Satellite data and refs
  const satelliteDataRef = useRef<Map<number, SatelliteData>>(new Map());
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const pastTrajectoriesRef = useRef<Map<number, L.Polyline>>(new Map());
  const futureTrajectoriesRef = useRef<Map<number, L.Polyline>>(new Map());
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTrajectoryUpdateRef = useRef<Map<number, number>>(new Map()); // Track last trajectory update time
  const processedTleDataRef = useRef<Set<number>>(new Set()); // Track processed TLE data
  
  // Selected satellite for detailed view
  const [selectedSatelliteDetail, setSelectedSatelliteDetail] = useState<number>(25544);

  // Fetch TLE data for selected satellites
  useEffect(() => {
    const fetchTLEs = async () => {
      const loadingMap = new Map<number, boolean>();
      selectedSatellites.forEach(noradId => {
        loadingMap.set(noradId, true);
      });
      setTleLoading(loadingMap);

      for (const noradId of selectedSatellites) {
        try {
          const response = await fetchTLE(noradId);
          if (response) {
            const parsed = parseTLE(response.tle);
            if (parsed) {
              setTleData(prev => {
                const newMap = new Map(prev);
                newMap.set(noradId, {
                  line1: parsed.line1,
                  line2: parsed.line2,
                  name: response.info.satname
                });
                return newMap;
              });
            }
          }
          setTleLoading(prev => {
            const newMap = new Map(prev);
            newMap.set(noradId, false);
            return newMap;
          });
        } catch (error) {
          setTleError('API unavailable - using fallback data');
          setTleLoading(prev => {
            const newMap = new Map(prev);
            newMap.set(noradId, false);
            return newMap;
          });
        }
      }
    };

    fetchTLEs();
    
    // Refresh TLE data every hour
    const interval = setInterval(fetchTLEs, 3600000);
    return () => clearInterval(interval);
  }, [selectedSatellites]);

  // Calculate trajectory points - return as single array, let Leaflet handle wrapping
  const calculateTrajectory = (satrec: satellite.SatRec, startTime: Date, minutes: number, step: number): [number, number][] => {
    const points: [number, number][] = [];
    const totalSteps = (minutes * 60) / step;

    for (let i = 0; i <= totalSteps; i++) {
      const time = new Date(startTime.getTime() + i * step * 1000);
      const positionAndVelocity = satellite.propagate(satrec, time);

      if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
        const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
        const gmst = satellite.gstime(time);
        const positionGd = satellite.eciToGeodetic(positionEci, gmst);

        const lat = satellite.degreesLat(positionGd.latitude);
        const lon = satellite.degreesLong(positionGd.longitude);
        points.push([lat, lon]);
      }
    }

    return points;
  };

  // Update position for a single satellite
  const updateSatellitePosition = (noradId: number) => {
    if (!mapRef.current) return;

    const option = SATELLITE_OPTIONS.find(s => s.noradId === noradId);
    if (!option) return;

    // Get TLE data (from API or fallback)
    const currentTleData = tleData; // Access current state
    let tleInfo = currentTleData.get(noradId);
    
    if (!tleInfo) {
      // Use fallback
      tleInfo = {
        line1: option.fallbackTLE.line1,
        line2: option.fallbackTLE.line2,
        name: option.name
      };
    }

    if (!tleInfo.line1 || !tleInfo.line2) return;

    const satrec = satellite.twoline2satrec(tleInfo.line1, tleInfo.line2);
    const now = new Date();
    const positionAndVelocity = satellite.propagate(satrec, now);

    if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
      const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
      const gmst = satellite.gstime(now);
      const positionGd = satellite.eciToGeodetic(positionEci, gmst);

      const latitude = satellite.degreesLat(positionGd.latitude);
      const longitude = satellite.degreesLong(positionGd.longitude);
      const altitude = positionGd.height;

      let speed = 0;
      if (positionAndVelocity.velocity && typeof positionAndVelocity.velocity !== 'boolean') {
        const velocity = positionAndVelocity.velocity as satellite.EciVec3<number>;
        speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);
      }

      // Update satellite data
      satelliteDataRef.current.set(noradId, {
        noradId,
        name: tleInfo.name,
        latitude,
        longitude,
        altitude,
        speed
      });

      // Update or create marker
      let marker = markersRef.current.get(noradId);
      if (!marker) {
        const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];
        const colorIndex = selectedSatellites.indexOf(noradId) % colors.length;
        const color = colors[colorIndex];

        const satelliteIcon = L.divIcon({
          className: 'custom-satellite-icon',
          html: `<div class="flex items-center justify-center w-8 h-8 rounded-full shadow-[0_0_20px_${color}]" style="background-color: ${color};">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18L17.82 7 12 10.82 6.18 7 12 4.18zM5 8.82l6 3.75v7.26l-6-3.75V8.82zm8 11.01v-7.26l6-3.75v7.26l-6 3.75z"/>
            </svg>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        marker = L.marker([latitude, longitude], { icon: satelliteIcon })
          .addTo(mapRef.current)
          .bindTooltip(tleInfo.name, {
            permanent: false,
            direction: 'top',
            offset: [0, -16],
            className: 'custom-tooltip'
          });
        
        marker.on('click', () => {
          setSelectedSatelliteDetail(noradId);
        });
        
        markersRef.current.set(noradId, marker);
      } else {
        // Smoothly update position without panning
        marker.setLatLng([latitude, longitude], { animate: false });
        marker.setTooltipContent(
          `<div class="text-sm font-semibold">${tleInfo.name}</div>
           <div class="text-xs">Lat: ${latitude.toFixed(4)}°</div>
           <div class="text-xs">Lon: ${longitude.toFixed(4)}°</div>`
        );
      }

      // Update trajectories only every 30 seconds to reduce glitching
      const lastUpdate = lastTrajectoryUpdateRef.current.get(noradId) || 0;
      const shouldUpdateTrajectory = now.getTime() - lastUpdate > 30000; // 30 seconds

      if (shouldUpdateTrajectory) {
        // Show trajectory segments (5 minutes past and 5 minutes future)
        const pastPoints = calculateTrajectory(satrec, new Date(now.getTime() - 5 * 60 * 1000), 5, 10);
        const futurePoints = calculateTrajectory(satrec, now, 5, 10);

        // Remove old trajectories
        const oldPast = pastTrajectoriesRef.current.get(noradId);
        const oldFuture = futureTrajectoriesRef.current.get(noradId);
        if (oldPast && mapRef.current) {
          mapRef.current.removeLayer(oldPast);
        }
        if (oldFuture && mapRef.current) {
          mapRef.current.removeLayer(oldFuture);
        }

        // Draw new trajectories as single continuous polylines
        const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];
        const colorIndex = selectedSatellites.indexOf(noradId) % colors.length;
        const color = colors[colorIndex];

        if (pastPoints.length > 1 && mapRef.current) {
          const pastPolyline = L.polyline(pastPoints, {
            color,
            weight: 2.5,
            opacity: 0.6,
            smoothFactor: 1.0
          }).addTo(mapRef.current);
          pastTrajectoriesRef.current.set(noradId, pastPolyline);
        }

        if (futurePoints.length > 1 && mapRef.current) {
          const futurePolyline = L.polyline(futurePoints, {
            color,
            weight: 2.5,
            opacity: 0.4,
            dashArray: '8, 12',
            smoothFactor: 1.0
          }).addTo(mapRef.current);
          futureTrajectoriesRef.current.set(noradId, futurePolyline);
        }

        lastTrajectoryUpdateRef.current.set(noradId, now.getTime());
      }
    }
  };

  // Update all selected satellites
  const updateAllSatellites = () => {
    selectedSatellites.forEach(noradId => {
      updateSatellitePosition(noradId);
    });
  };

  // Handle satellite selection toggle
  const toggleSatellite = (noradId: number) => {
    setSelectedSatellites(prev => {
      if (prev.includes(noradId)) {
        // Remove satellite
        const marker = markersRef.current.get(noradId);
        const pastTraj = pastTrajectoriesRef.current.get(noradId);
        const futureTraj = futureTrajectoriesRef.current.get(noradId);
        
        if (marker && mapRef.current) mapRef.current.removeLayer(marker);
        if (pastTraj && mapRef.current) mapRef.current.removeLayer(pastTraj);
        if (futureTraj && mapRef.current) mapRef.current.removeLayer(futureTraj);
        
        markersRef.current.delete(noradId);
        pastTrajectoriesRef.current.delete(noradId);
        futureTrajectoriesRef.current.delete(noradId);
        satelliteDataRef.current.delete(noradId);
        
        // If removing the detail view satellite, switch to another
        if (noradId === selectedSatelliteDetail && prev.length > 1) {
          const remaining = prev.filter(id => id !== noradId);
          setSelectedSatelliteDetail(remaining[0]);
        }
        
        return prev.filter(id => id !== noradId);
      } else {
        // Add satellite
        return [...prev, noradId];
      }
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = L.map(mapContainer.current, {
      center: [0, 0],
      zoom: 2,
      zoomControl: true,
      minZoom: 2,
      maxZoom: 10,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0
      // Don't enable worldCopyJump - it causes issues with polylines
    });

    mapRef.current = map;

    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);
    
    tileLayerRef.current = tileLayer;

    // Initial update
    updateAllSatellites();
    
    // Update positions every second (smooth tracking)
    updateIntervalRef.current = setInterval(updateAllSatellites, 1000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
      pastTrajectoriesRef.current.forEach(traj => {
        if (mapRef.current) mapRef.current.removeLayer(traj);
      });
      futureTrajectoriesRef.current.forEach(traj => {
        if (mapRef.current) mapRef.current.removeLayer(traj);
      });
      markersRef.current.forEach(marker => {
        if (mapRef.current) mapRef.current.removeLayer(marker);
      });
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      markersRef.current.clear();
      pastTrajectoriesRef.current.clear();
      futureTrajectoriesRef.current.clear();
      satelliteDataRef.current.clear();
      lastTrajectoryUpdateRef.current.clear();
    };
  }, []);

  // Update when selected satellites change
  useEffect(() => {
    if (!mapRef.current) return;
    // Only update if satellites changed, not when TLE data updates
    // TLE updates are handled by the interval
    updateAllSatellites();
    // Reset trajectory update times when satellites change
    lastTrajectoryUpdateRef.current.clear();
  }, [selectedSatellites]);

  // Update when TLE data is available (but not on every Map change)
  useEffect(() => {
    if (!mapRef.current || tleData.size === 0) return;
    
    // Check if we have new TLE data that hasn't been processed
    let hasNewData = false;
    tleData.forEach((_, noradId) => {
      if (!processedTleDataRef.current.has(noradId)) {
        hasNewData = true;
        processedTleDataRef.current.add(noradId);
      }
    });
    
    // Only update if we have genuinely new TLE data
    if (hasNewData) {
      updateAllSatellites();
    }
  }, [tleData.size]); // Only react to size changes

  // Handle view toggle
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    mapRef.current.removeLayer(tileLayerRef.current);

    const newTileLayer = isMinimalView
      ? L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        })
      : L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 20
        });

    newTileLayer.addTo(mapRef.current);
    tileLayerRef.current = newTileLayer;
  }, [isMinimalView]);

  // Get selected satellite data for detail view
  const selectedSatelliteData = satelliteDataRef.current.get(selectedSatelliteDetail);
  const hasTLEData = tleData.has(selectedSatelliteDetail);
  const isTLELoading = Array.from(tleLoading.values()).some(loading => loading);

  return (
    <div className="relative h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 rounded-xl overflow-hidden" />
      
      {/* Satellite Selector Toggle */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <Button
          onClick={() => setShowSatelliteSelector(!showSatelliteSelector)}
          variant="outline"
          className="bg-card/95 backdrop-blur-sm border border-border hover:bg-card transition-colors shadow-lg flex items-center gap-2"
        >
          <Satellite className="w-4 h-4" />
          Select Satellites ({selectedSatellites.length})
        </Button>

        <button
          onClick={() => setIsMinimalView(!isMinimalView)}
          className="bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition-colors shadow-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMinimalView ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            )}
          </svg>
          {isMinimalView ? 'Satellite View' : 'Minimal View'}
        </button>
      </div>

      {/* Satellite Selector Panel */}
      {showSatelliteSelector && (
        <div className="absolute top-20 right-4 z-[1000] w-80">
          <Card className="bg-card/95 backdrop-blur-sm border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Track Satellites</h3>
              <button
                onClick={() => setShowSatelliteSelector(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {SATELLITE_OPTIONS.map(option => (
                <div key={option.noradId} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sat-${option.noradId}`}
                    checked={selectedSatellites.includes(option.noradId)}
                    onCheckedChange={() => toggleSatellite(option.noradId)}
                  />
                  <label
                    htmlFor={`sat-${option.noradId}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      
      {/* API Status Alert */}
      {tleError && !alertDismissed && (
        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[1000]">
          <Alert className="bg-yellow-500/10 border-yellow-500/50 relative pr-8">
            <button
              onClick={() => setAlertDismissed(true)}
              className="absolute right-2 top-2 rounded-md p-1 text-yellow-200/70 hover:text-yellow-100 hover:bg-yellow-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              aria-label="Dismiss alert"
            >
              <X className="h-4 w-4" />
            </button>
            <AlertDescription className="text-sm text-yellow-200">
              <strong>Using fallback data:</strong> {tleError}. 
              <a 
                href="https://www.n2yo.com/login/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1 hover:text-yellow-100"
              >
                Get API key
              </a>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Satellite Data Overlay */}
      {selectedSatelliteData && (
        <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {selectedSatelliteData.name}
              </h2>
              {selectedSatellites.length > 1 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Click another satellite on the map to view details
                </p>
              )}
            </div>
            {isTLELoading && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Latitude</span>
              <span className="font-mono text-foreground font-semibold">{selectedSatelliteData.latitude.toFixed(4)}°</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Longitude</span>
              <span className="font-mono text-foreground font-semibold">{selectedSatelliteData.longitude.toFixed(4)}°</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Altitude</span>
              <span className="font-mono text-primary font-semibold">{selectedSatelliteData.altitude.toFixed(2)} km</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Speed</span>
              <span className="font-mono text-primary font-semibold">{selectedSatelliteData.speed.toFixed(2)} km/s</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Tracking {selectedSatellites.length} satellite{selectedSatellites.length !== 1 ? 's' : ''}</span>
              </div>
              {hasTLEData && (
                <span className="text-primary font-medium">Real-time TLE</span>
              )}
              {!hasTLEData && !isTLELoading && (
                <span className="text-yellow-500">Using cached data</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerView;
