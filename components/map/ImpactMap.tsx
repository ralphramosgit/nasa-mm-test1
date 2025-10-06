"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl, { Map, Marker, LngLatLike, GeoJSONSource, MapMouseEvent } from 'mapbox-gl';
import * as turf from '@turf/turf';

// Expect a NEXT_PUBLIC_MAPBOX_TOKEN in env
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

console.log('Mapbox token loaded:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? 'Yes' : 'No');

interface ImpactMapProps {
  initialLocation?: { latitude: number; longitude: number };
  onLocationChange?: (lat: number, lon: number) => void;
  impactRadiusKm?: number; // optional predicted radius to display
}

/**
 * ImpactMap renders a 3D globe (Mapbox globe style) and lets the user pick an impact point.
 * It shows an adjustable impact radius circle using Turf.js.
 */
export const ImpactMap: React.FC<ImpactMapProps> = ({
  initialLocation = { latitude: 40.7128, longitude: -74.006 },
  onLocationChange,
  impactRadiusKm,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [current, setCurrent] = useState(initialLocation);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  const impactLayerId = 'impact-radius-fill';
  const impactLineId = 'impact-radius-line';
  const impactSourceId = 'impact-radius-source';

  const updateCircle = useCallback(
    (center: { latitude: number; longitude: number }, radiusKm: number) => {
      if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;
      
      const circle = turf.circle([center.longitude, center.latitude], radiusKm, {
        steps: 128,
        units: 'kilometers',
      });
      const source = mapRef.current.getSource(impactSourceId) as GeoJSONSource;
      if (source) {
        source.setData(circle as GeoJSON.FeatureCollection);
      } else {
        mapRef.current.addSource(impactSourceId, {
          type: 'geojson',
          data: circle as GeoJSON.FeatureCollection,
        });
        mapRef.current.addLayer({
          id: impactLayerId,
          type: 'fill',
          source: impactSourceId,
          paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.2,
          },
        });
        mapRef.current.addLayer({
          id: impactLineId,
            type: 'line',
            source: impactSourceId,
            paint: {
              'line-color': '#ff0000',
              'line-width': 2,
            },
        });
      }
    },
    []
  );

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    console.log('Initializing Mapbox map...');
    
    const style = 'mapbox://styles/mapbox/satellite-streets-v12';

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style,
        center: [initialLocation.longitude, initialLocation.latitude] as LngLatLike,
        zoom: 2,
        // Start with regular projection, then switch to globe after load
      });
      
      setMapInitialized(true);
      console.log('Map initialized successfully');

      mapRef.current.on('style.load', () => {
        console.log('Map style loaded successfully');
        
        // Switch to globe projection after map loads
        if (mapRef.current) {
          try {
            mapRef.current.setProjection('globe');
            console.log('Switched to globe projection');
          } catch (e) {
            console.warn('Globe projection not supported, using default projection:', e);
          }
        }
        
        // Add atmosphere / sky
        mapRef.current?.setFog({
          'horizon-blend': 0.1,
          color: 'rgba(255,255,255,0.6)',
          'high-color': '#add8e6',
          'space-color': '#000000',
          'star-intensity': 0.15,
        });
        setMapLoaded(true);
      });

      mapRef.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

      // Marker
      markerRef.current = new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat([initialLocation.longitude, initialLocation.latitude])
        .addTo(mapRef.current);

      // Click handler to move marker
      mapRef.current.on('click', (e: MapMouseEvent) => {
        const { lng, lat } = e.lngLat;
        markerRef.current?.setLngLat([lng, lat]);
        const updated = { latitude: lat, longitude: lng };
        setCurrent(updated);
        onLocationChange?.(lat, lng);
        if (impactRadiusKm) updateCircle(updated, impactRadiusKm);
      });

    } catch (error) {
      console.error('Failed to initialize Mapbox map:', error);
    }

    // Resize handling
    const resize = () => mapRef.current?.resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      mapRef.current?.remove();
    };
  }, [initialLocation.latitude, initialLocation.longitude, impactRadiusKm, onLocationChange, updateCircle]);

  // Update circle when radius or location changes externally
  useEffect(() => {
    if (impactRadiusKm && mapRef.current && mapLoaded) {
      updateCircle(current, impactRadiusKm);
    } else if (mapRef.current && mapLoaded && mapRef.current.getSource(impactSourceId) && !impactRadiusKm) {
      // remove layers if radius removed
      try {
        if (mapRef.current.getLayer(impactLayerId)) mapRef.current.removeLayer(impactLayerId);
        if (mapRef.current.getLayer(impactLineId)) mapRef.current.removeLayer(impactLineId);
        if (mapRef.current.getSource(impactSourceId)) mapRef.current.removeSource(impactSourceId);
      } catch (error) {
        console.warn('Error removing map layers:', error);
      }
    }
  }, [impactRadiusKm, current, updateCircle, mapLoaded]);

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 relative">
      {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
        <>
          <div ref={mapContainerRef} className="w-full h-full" />
          {!mapInitialized && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">Initializing map...</p>
              </div>
            </div>
          )}
          {mapInitialized && !mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 dark:bg-gray-800/90">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">Loading map style...</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-center p-6 text-sm text-red-600 dark:text-red-400 bg-gray-50 dark:bg-gray-800">
          <div>
            <p className="mb-2">Missing Mapbox token.</p>
            <p>Set NEXT_PUBLIC_MAPBOX_TOKEN in your .env.local file to enable the globe.</p>
            <p className="mt-2 text-xs">Get a free token at: https://account.mapbox.com/access-tokens/</p>
          </div>
        </div>
      )}
      
      {process.env.NEXT_PUBLIC_MAPBOX_TOKEN && mapLoaded && (
        <>
          <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 text-white text-xs rounded shadow">
            Click the globe to choose an impact location
          </div>
          <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 text-white text-xs rounded shadow">
            Lat: {current.latitude.toFixed(2)} | Lon: {current.longitude.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
};

export default ImpactMap;
