'use client';

import { useRef, useEffect } from 'react';

export default function SimpleMapbox() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Mapbox GL JS dynamically
    const loadMapbox = async () => {
      try {
        // Dynamically import mapbox-gl
        const mapboxgl = await import('mapbox-gl');
        
        // Set access token
        mapboxgl.default.accessToken = 'pk.eyJ1IjoicmFscGhyYW1vczIyIiwiYSI6ImNtZ2U0dG1lNjF4azEyam9jZXV0MDluOHMifQ.4KOyMsLQh0kOCjeJKCJ5Gw';
        
        if (!mapContainer.current) return;

        console.log('Creating map...');
        
        const map = new mapboxgl.default.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-74.5, 40.7],
          zoom: 9
        });

        map.on('load', () => {
          console.log('Map loaded!');
        });

        map.on('error', (e) => {
          console.error('Map error:', e);
        });

        return () => {
          map.remove();
        };
      } catch (error) {
        console.error('Failed to load mapbox:', error);
      }
    };

    loadMapbox();
  }, []);

  return (
    <div className="w-full h-[400px]">
      <style jsx global>{`
        @import url('https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css');
      `}</style>
      <div className="p-2 bg-blue-100 text-xs">
        Simple Mapbox Test (Dynamic Import)
      </div>
      <div 
        ref={mapContainer} 
        className="w-full bg-gray-300 border"
        style={{ height: '370px' }}
      />
    </div>
  );
}