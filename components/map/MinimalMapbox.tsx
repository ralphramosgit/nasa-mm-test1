'use client';

import { useRef, useEffect } from 'react';

export default function MinimalMapbox() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        // Load CSS first
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Wait a bit for CSS to load
        await new Promise(resolve => setTimeout(resolve, 100));

        // Import mapbox
        const mapboxgl = (await import('mapbox-gl')).default;
        
        mapboxgl.accessToken = 'pk.eyJ1IjoicmFscGhyYW1vczIyIiwiYSI6ImNtZ2U0dG1lNjF4azEyam9jZXV0MDluOHMifQ.4KOyMsLQh0kOCjeJKCJ5Gw';
        
        if (!mapContainer.current) return;

        console.log('Creating minimal map');
        
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-74.5, 40.7],
          zoom: 10
        });

        map.on('load', () => {
          console.log('✅ Minimal map loaded!');
          // Add a simple marker to confirm it's working
          new mapboxgl.Marker()
            .setLngLat([-74.5, 40.7])
            .addTo(map);
        });

        map.on('error', (e) => {
          console.error('❌ Minimal map error:', e);
        });

      } catch (error) {
        console.error('❌ Failed to create minimal map:', error);
      }
    };

    initMap();
  }, []);

  return (
    <div className="w-full">
      <div className="p-2 bg-purple-100 text-xs font-mono">
        Minimal Mapbox (No fancy features)
      </div>
      <div 
        ref={mapContainer} 
        className="w-full bg-purple-200 border-2 border-purple-500"
        style={{ height: '300px', minHeight: '300px' }}
      >
        {/* Fallback content */}
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          Map should load here...
        </div>
      </div>
      <div className="p-2 bg-purple-50 text-xs">
        Check browser console for logs
      </div>
    </div>
  );
}