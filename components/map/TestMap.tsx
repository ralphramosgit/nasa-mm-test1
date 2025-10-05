'use client';

import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// This must be in the component file, not globals
import 'mapbox-gl/dist/mapbox-gl.css';

export default function TestMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    // Set access token
    mapboxgl.accessToken = 'pk.eyJ1IjoicmFscGhyYW1vczIyIiwiYSI6ImNtZ2U0dG1lNjF4azEyam9jZXV0MDluOHMifQ.4KOyMsLQh0kOCjeJKCJ5Gw';
    
    console.log('Mapbox token:', mapboxgl.accessToken);
    console.log('Map container:', mapContainer.current);
    
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;

    try {
      console.log('Initializing map...');
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // Simple streets style first
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 9 // starting zoom
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully!');
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });

    } catch (error) {
      console.error('Failed to create map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="w-full h-[400px] bg-gray-200">
      <div className="p-4 bg-blue-100 text-sm">
        Test Map Component - Check browser console for errors
      </div>
      <div 
        ref={mapContainer} 
        className="w-full h-full border-2 border-red-500"
        style={{ height: '350px' }}
      />
    </div>
  );
}