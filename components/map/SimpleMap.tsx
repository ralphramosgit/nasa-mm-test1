"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Set access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface SimpleMapProps {
  initialLocation?: { latitude: number; longitude: number };
  onLocationChange?: (lat: number, lon: number) => void;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({
  initialLocation = { latitude: 40.7128, longitude: -74.006 },
  onLocationChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [current, setCurrent] = useState(initialLocation);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    console.log('Initializing simple Mapbox map...');
    console.log('Token available:', !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-v9', // Simple satellite style
        center: [initialLocation.longitude, initialLocation.latitude],
        zoom: 2,
      });

      // Add marker
      markerRef.current = new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat([initialLocation.longitude, initialLocation.latitude])
        .addTo(mapRef.current);

      // Click handler
      mapRef.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        console.log('Map clicked:', lat, lng);
        markerRef.current?.setLngLat([lng, lat]);
        const updated = { latitude: lat, longitude: lng };
        setCurrent(updated);
        onLocationChange?.(lat, lng);
      });

      mapRef.current.on('load', () => {
        console.log('Map loaded successfully');
      });

      mapRef.current.on('error', (e) => {
        console.error('Map error:', e);
      });

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    return () => {
      mapRef.current?.remove();
    };
  }, [initialLocation.latitude, initialLocation.longitude, onLocationChange]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center p-6">
          <p className="text-red-600 dark:text-red-400 mb-2">Missing Mapbox token</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Set NEXT_PUBLIC_MAPBOX_TOKEN in your .env.local file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 relative">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 text-white text-xs rounded shadow">
        Click the map to choose an impact location
      </div>
      <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 text-white text-xs rounded shadow">
        Lat: {current.latitude.toFixed(2)} | Lon: {current.longitude.toFixed(2)}
      </div>
    </div>
  );
};

export default SimpleMap;