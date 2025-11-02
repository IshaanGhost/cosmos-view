import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as satellite from 'satellite.js';

// ISS TLE data (updated periodically)
const ISS_TLE = {
  line1: '1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9005',
  line2: '2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391428615'
};

const TrackerView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [satelliteData, setSatelliteData] = useState({
    name: 'ISS (ZARYA)',
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 0
  });

  // Initialize satellite tracking
  const updateSatellitePosition = () => {
    const satrec = satellite.twoline2satrec(ISS_TLE.line1, ISS_TLE.line2);
    const now = new Date();
    const positionAndVelocity = satellite.propagate(satrec, now);

    if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
      const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
      const gmst = satellite.gstime(now);
      const positionGd = satellite.eciToGeodetic(positionEci, gmst);

      const latitude = satellite.degreesLat(positionGd.latitude);
      const longitude = satellite.degreesLong(positionGd.longitude);
      const altitude = positionGd.height;

      // Calculate speed (approximate)
      let speed = 0;
      if (positionAndVelocity.velocity && typeof positionAndVelocity.velocity !== 'boolean') {
        const velocity = positionAndVelocity.velocity as satellite.EciVec3<number>;
        speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);
      }

      setSatelliteData({
        name: 'ISS (ZARYA)',
        latitude,
        longitude,
        altitude,
        speed
      });

      // Update marker position
      if (markerRef.current && mapRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
        
        // Optional: pan to keep satellite in view
        if (!mapRef.current.getBounds().contains([latitude, longitude])) {
          mapRef.current.panTo([latitude, longitude], { animate: true });
        }
      }
    }
  };

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainer.current, {
      center: [0, 0],
      zoom: 2,
      zoomControl: true,
      minZoom: 2,
      maxZoom: 10,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0
    });

    mapRef.current = map;

    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Create custom satellite icon
    const satelliteIcon = L.divIcon({
      className: 'custom-satellite-icon',
      html: `<div class="flex items-center justify-center w-8 h-8 bg-primary rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]">
        <svg class="w-5 h-5 text-background" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18L17.82 7 12 10.82 6.18 7 12 4.18zM5 8.82l6 3.75v7.26l-6-3.75V8.82zm8 11.01v-7.26l6-3.75v7.26l-6 3.75z"/>
        </svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Initialize marker
    const marker = L.marker([0, 0], { icon: satelliteIcon }).addTo(map);
    markerRef.current = marker;

    // Update position immediately and then every second
    updateSatellitePosition();
    const interval = setInterval(updateSatellitePosition, 1000);

    return () => {
      clearInterval(interval);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 rounded-xl overflow-hidden" />
      
      {/* Satellite Data Overlay */}
      <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {satelliteData.name}
        </h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Latitude</span>
            <span className="font-mono text-foreground font-semibold">{satelliteData.latitude.toFixed(4)}°</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Longitude</span>
            <span className="font-mono text-foreground font-semibold">{satelliteData.longitude.toFixed(4)}°</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Altitude</span>
            <span className="font-mono text-primary font-semibold">{satelliteData.altitude.toFixed(2)} km</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Speed</span>
            <span className="font-mono text-primary font-semibold">{satelliteData.speed.toFixed(2)} km/s</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Live Tracking Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackerView;
