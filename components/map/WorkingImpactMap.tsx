"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

// Set access token
if (typeof window !== 'undefined') {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
}

interface WorkingImpactMapProps {
  initialLocation?: { latitude: number; longitude: number };
  onLocationChange?: (lat: number, lon: number) => void;
  impactRadiusKm?: number;
}

export const WorkingImpactMap: React.FC<WorkingImpactMapProps> = ({
  initialLocation = { latitude: 40.7128, longitude: -74.006 },
  onLocationChange,
  impactRadiusKm,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [current, setCurrent] = useState(initialLocation);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string>('');

  const updateCircle = useCallback((center: { latitude: number; longitude: number }, radiusKm: number) => {
    if (!mapRef.current || !mapLoaded) return;

    try {
      const circle = turf.circle([center.longitude, center.latitude], radiusKm, {
        steps: 64,
        units: 'kilometers',
      });

      const sourceId = 'impact-radius';
      const source = mapRef.current.getSource(sourceId);

      if (source && 'setData' in source) {
        (source as mapboxgl.GeoJSONSource).setData(circle as GeoJSON.FeatureCollection);
      } else {
        // Add source and layers
        mapRef.current.addSource(sourceId, {
          type: 'geojson',
          data: circle as GeoJSON.FeatureCollection,
        });

        mapRef.current.addLayer({
          id: 'impact-fill',
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.2,
          },
        });

        mapRef.current.addLayer({
          id: 'impact-line',
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#ff0000',
            'line-width': 2,
          },
        });
      }
    } catch (e) {
      console.warn('Error updating circle:', e);
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current || !process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return;

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [initialLocation.longitude, initialLocation.latitude],
        zoom: 2,
      });

      // Add marker
      markerRef.current = new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat([initialLocation.longitude, initialLocation.latitude])
        .addTo(mapRef.current);

      // Map events
      mapRef.current.on('load', () => {
        setMapLoaded(true);
        console.log('Map loaded successfully');
        
        // Try to enable globe after load
        setTimeout(() => {
          if (mapRef.current) {
            try {
              mapRef.current.setProjection('globe');
              mapRef.current.setFog({
                'horizon-blend': 0.1,
                color: 'rgba(255,255,255,0.6)',
                'high-color': '#add8e6',
                'space-color': '#000000',
                'star-intensity': 0.15,
              });
            } catch {
              console.log('Globe projection not available, using regular map');
            }
          }
        }, 1000);
      });

      mapRef.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        markerRef.current?.setLngLat([lng, lat]);
        const updated = { latitude: lat, longitude: lng };
        setCurrent(updated);
        onLocationChange?.(lat, lng);
        
        if (impactRadiusKm) {
          updateCircle(updated, impactRadiusKm);
        }
      });

      mapRef.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map');
      });

    } catch (err) {
      console.error('Failed to initialize map:', err);
      setError('Failed to initialize map');
    }

    return () => {
      mapRef.current?.remove();
    };
  }, [initialLocation.latitude, initialLocation.longitude, onLocationChange, impactRadiusKm, updateCircle]);

  // Update circle when radius changes
  useEffect(() => {
    if (impactRadiusKm && mapLoaded) {
      updateCircle(current, impactRadiusKm);
    } else if (mapLoaded && !impactRadiusKm) {
      // Remove circle
      try {
        if (mapRef.current?.getLayer('impact-fill')) {
          mapRef.current.removeLayer('impact-fill');
        }
        if (mapRef.current?.getLayer('impact-line')) {
          mapRef.current.removeLayer('impact-line');
        }
        if (mapRef.current?.getSource('impact-radius')) {
          mapRef.current.removeSource('impact-radius');
        }
      } catch (e) {
        console.warn('Error removing circle:', e);
      }
    }
  }, [impactRadiusKm, current, updateCircle, mapLoaded]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center p-6">
          <p className="text-red-600 dark:text-red-400 mb-2">Missing Mapbox Access Token</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Set NEXT_PUBLIC_MAPBOX_TOKEN in your .env.local file
          </p>
          <p className="text-xs text-gray-500">
            Get a free token at: <br/>
            https://account.mapbox.com/access-tokens/
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center p-6">
          <p className="text-red-600 dark:text-red-400 mb-2">Map Error</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 relative">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 dark:bg-gray-800/90">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      
      {mapLoaded && (
        <>
          <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 text-white text-xs rounded shadow">
            Click anywhere on the map to set impact location
          </div>
          <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 text-white text-xs rounded shadow">
            Lat: {current.latitude.toFixed(3)} | Lon: {current.longitude.toFixed(3)}
          </div>
          {impactRadiusKm && (
            <div className="absolute bottom-2 right-2 px-3 py-1 bg-black/60 text-white text-xs rounded shadow">
              Impact Radius: {impactRadiusKm.toFixed(1)} km
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkingImpactMap;