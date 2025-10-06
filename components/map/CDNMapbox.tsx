'use client';

import { useRef, useEffect } from 'react';
import Head from 'next/head';

declare global {
  interface Window {
    mapboxgl: any;
  }
}

export default function CDNMapbox() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add Mapbox CSS to head
    const cssLink = document.createElement('link');
    cssLink.href = 'https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css';
    cssLink.rel = 'stylesheet';
    document.head.appendChild(cssLink);

    // Add Mapbox JS script
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.js';
    script.async = true;
    
    script.onload = () => {
      if (window.mapboxgl && mapContainer.current) {
        console.log('Mapbox GL loaded from CDN');
        
        window.mapboxgl.accessToken = 'pk.eyJ1IjoicmFscGhyYW1vczIyIiwiYSI6ImNtZ2U0dG1lNjF4azEyam9jZXV0MDluOHMifQ.4KOyMsLQh0kOCjeJKCJ5Gw';
        
        const map = new window.mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-74.5, 40.7],
          zoom: 9
        });

        map.on('load', () => {
          console.log('CDN Map loaded successfully!');
        });

        map.on('error', (e: any) => {
          console.error('CDN Map error:', e);
        });
      }
    };

    script.onerror = () => {
      console.error('Failed to load Mapbox GL from CDN');
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(cssLink);
    };
  }, []);

  return (
    <div className="w-full h-[400px]">
      <div className="p-2 bg-green-100 text-xs">
        CDN Mapbox Test
      </div>
      <div 
        ref={mapContainer} 
        className="w-full bg-gray-400 border-2 border-green-500"
        style={{ height: '370px' }}
      />
    </div>
  );
}