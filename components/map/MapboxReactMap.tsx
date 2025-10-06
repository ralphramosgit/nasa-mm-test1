'use client';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your access token here
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoicmFscGhyYW1vczIyIiwiYSI6ImNtZ2U0dG1lNjF4azEyam9jZXV0MDluOHMifQ.4KOyMsLQh0kOCjeJKCJ5Gw';

interface MapboxReactMapProps {
  onLocationChange?: (lat: number, lon: number) => void;
}

export default function MapboxReactMap({ onLocationChange }: MapboxReactMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(1.5);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      projection: 'globe'
    });

    // Add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Set the map's atmosphere
    map.current.on('style.load', () => {
      if (map.current) {
        map.current.setFog({
          'horizon-blend': 0.1,
          color: 'rgba(255,255,255,0.6)',
          'high-color': '#add8e6',
          'space-color': '#000000',
          'star-intensity': 0.15,
        });
      }
    });

    // Add initial marker
    const initialMarker = new mapboxgl.Marker({ color: '#ff0000' })
      .setLngLat([lng, lat])
      .addTo(map.current);
    setMarker(initialMarker);

    // Add click handler
    map.current.on('click', (e) => {
      setLng(e.lngLat.lng);
      setLat(e.lngLat.lat);
      
      // Move marker to clicked location
      if (marker) {
        marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
      }
      
      // Call the callback
      onLocationChange?.(e.lngLat.lat, e.lngLat.lng);
    });

    // Update state when map moves
    map.current.on('move', () => {
      if (map.current) {
        setLng(Number(map.current.getCenter().lng.toFixed(4)));
        setLat(Number(map.current.getCenter().lat.toFixed(4)));
        setZoom(Number(map.current.getZoom().toFixed(2)));
      }
    });
  }, [lng, lat, zoom, marker, onLocationChange]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-[500px]">
      <div className="absolute top-0 left-0 m-3 p-2 bg-black bg-opacity-60 text-white text-xs rounded">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="absolute top-8 left-0 m-3 p-2 bg-black bg-opacity-60 text-white text-xs rounded">
        Click anywhere on the globe to set impact location
      </div>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}