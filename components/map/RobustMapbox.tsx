'use client';

import { useRef, useEffect, useState } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';

export default function RobustMapbox() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    let map: MapboxMap | null = null;

    const initializeMap = async () => {
      try {
        setStatus('Loading Mapbox...');
        
        // Import Mapbox GL JS dynamically
        const mapboxgl = (await import('mapbox-gl')).default;
        
        setStatus('Setting token...');
        mapboxgl.accessToken = 'pk.eyJ1IjoicmFscGhyYW1vczIyIiwiYSI6ImNtZ2U0dG1lNjF4azEyam9jZXV0MDluOHMifQ.4KOyMsLQh0kOCjeJKCJ5Gw';
        
        if (!mapContainer.current) {
          throw new Error('Map container not found');
        }
        
        setStatus('Creating map...');
        
        map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-74.5, 40.7],
          zoom: 9
        });

        map.on('load', () => {
          setStatus('Map loaded successfully!');
          setMapLoaded(true);
          
          // Add a marker to show it's working
          if (map) {
            new mapboxgl.Marker({ color: 'red' })
              .setLngLat([-74.5, 40.7])
              .addTo(map);
          }
        });

        map.on('error', (e: { error?: { message?: string } }) => {
          console.error('Map error:', e);
          setError(`Map error: ${e.error?.message || 'Unknown error'}`);
          setStatus('Map error occurred');
        });

      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('Failed to initialize map:', error);
        setError(`Initialization error: ${error.message}`);
        setStatus('Failed to initialize');
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div className="p-3 bg-indigo-100 text-sm">
        <div><strong>Status:</strong> {status}</div>
        {error && <div className="text-red-600"><strong>Error:</strong> {error}</div>}
        <div><strong>Map Loaded:</strong> {mapLoaded ? '✅ Yes' : '❌ No'}</div>
      </div>
      
      <div 
        ref={mapContainer} 
        className="w-full bg-indigo-200 border-2 border-indigo-500"
        style={{ height: '350px', minHeight: '350px' }}
      >
        {!mapLoaded && !error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
              <div className="text-gray-600 text-sm">{status}</div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-600 p-4">
              <div className="text-4xl mb-2">❌</div>
              <div className="font-semibold">Map Failed to Load</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}