'use client';

import { useRef, useEffect, useState } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';
import { CometData, ImpactLocation, ImpactSimulation } from '@/types/comet';
import { TEST_COMETS, simulateImpact, getDamageZones } from '@/lib/services/comet-simulation';

interface Impact3DSimulatorProps {
  className?: string;
}

export default function Impact3DSimulator({ className = '' }: Impact3DSimulatorProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedComet, setSelectedComet] = useState<CometData>(TEST_COMETS[0]);
  const [impactLocation, setImpactLocation] = useState<ImpactLocation>({
    longitude: -74.5,
    latitude: 40.7,
    city: 'New York',
    country: 'USA'
  });
  const [currentSimulation, setCurrentSimulation] = useState<ImpactSimulation | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize map
  useEffect(() => {
    let mapboxMap: MapboxMap | null = null;

    const initializeMap = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        mapboxgl.accessToken = 'pk.eyJ1IjoicmFscGhyYW1vczIyIiwiYSI6ImNtZ2U0dG1lNjF4azEyam9jZXV0MDluOHMifQ.4KOyMsLQh0kOCjeJKCJ5Gw';
        
        if (!mapContainer.current) return;
        
        mapboxMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          center: [impactLocation.longitude, impactLocation.latitude],
          zoom: 4,
          projection: 'globe' as const
        });

        mapboxMap.on('load', () => {
          setMapLoaded(true);
          setMap(mapboxMap);
          
          // Add some atmosphere to the globe
          if (mapboxMap) {
            try {
              (mapboxMap as unknown as any).setFog({
                color: '#220053',
                'high-color': '#ffc2a8',
                'horizon-blend': 0.02,
                'space-color': '#000000',
                'star-intensity': 0.8
              });
            } catch {
              console.log('Fog not supported in this version');
            }
          }
        });

        // Handle clicks to set impact location
        mapboxMap.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          setImpactLocation({
            longitude: lng,
            latitude: lat,
            city: 'Selected Location',
            country: 'Unknown'
          });
        });

      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapboxMap) {
        mapboxMap.remove();
      }
    };
  }, []); // Empty dependency array since we handle updates separately

  // Update map center when impact location changes
  useEffect(() => {
    if (map && mapLoaded) {
      map.flyTo({
        center: [impactLocation.longitude, impactLocation.latitude],
        zoom: 8,
        duration: 2000
      });
    }
  }, [map, mapLoaded, impactLocation]);

  // Run simulation when comet or location changes
  useEffect(() => {
    if (selectedComet && impactLocation) {
      const simulation = simulateImpact(selectedComet, impactLocation);
      setCurrentSimulation(simulation);
    }
  }, [selectedComet, impactLocation]);

  // Add damage zones to map
  useEffect(() => {
    if (!map || !mapLoaded || !currentSimulation) return;

    // Remove existing layers
    const layerIds = ['damage-zones', 'impact-point'];
    layerIds.forEach(id => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    });

    // Add impact point
    map.addSource('impact-point', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [currentSimulation.location.longitude, currentSimulation.location.latitude]
        },
        properties: {}
      }
    });

    map.addLayer({
      id: 'impact-point',
      type: 'circle',
      source: 'impact-point',
      paint: {
        'circle-radius': 10,
        'circle-color': '#ff0000',
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.8
      }
    });

    // Add damage zones as circles
    const damageZones = getDamageZones(currentSimulation);
    
    damageZones.forEach((zone, index) => {
      const sourceId = `damage-zone-${index}`;
      const layerId = `damage-zone-layer-${index}`;
      
      // Create circle feature
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [currentSimulation.location.longitude, currentSimulation.location.latitude]
          },
          properties: {}
        }
      });

      map.addLayer({
        id: layerId,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': {
            stops: [
              [0, 0],
              [10, zone.radius * 0.1], // Scale for visibility
              [15, zone.radius * 0.5]
            ]
          },
          'circle-color': zone.color,
          'circle-opacity': 0.3,
          'circle-stroke-width': 2,
          'circle-stroke-color': zone.color,
          'circle-stroke-opacity': 0.8
        }
      });
    });

  }, [map, mapLoaded, currentSimulation]);

  const runImpactAnimation = async () => {
    if (!map || !currentSimulation) return;
    
    setIsAnimating(true);
    
    // Zoom out to show trajectory
    await map.flyTo({
      center: [currentSimulation.location.longitude, currentSimulation.location.latitude],
      zoom: 3,
      duration: 1000
    }).once('moveend');
    
    // Animate "asteroid" approach (simple simulation)
    const startLng = currentSimulation.location.longitude + 10;
    const startLat = currentSimulation.location.latitude + 5;
    
    // Add asteroid marker
    if (!map.getSource('asteroid')) {
      map.addSource('asteroid', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [startLng, startLat]
          },
          properties: {}
        }
      });

      map.addLayer({
        id: 'asteroid',
        type: 'circle',
        source: 'asteroid',
        paint: {
          'circle-radius': 8,
          'circle-color': '#ff8800',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9
        }
      });
    }
    
    // Animate asteroid movement
    const steps = 50;
    const lngStep = (currentSimulation.location.longitude - startLng) / steps;
    const latStep = (currentSimulation.location.latitude - startLat) / steps;
    
    for (let i = 0; i <= steps; i++) {
      const currentLng = startLng + (lngStep * i);
      const currentLat = startLat + (latStep * i);
      
      const source = map.getSource('asteroid') as any;
      source?.setData({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [currentLng, currentLat]
        },
        properties: {}
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Remove asteroid and zoom to impact
    if (map.getLayer('asteroid')) {
      map.removeLayer('asteroid');
    }
    if (map.getSource('asteroid')) {
      map.removeSource('asteroid');
    }
    
    // Zoom to impact site
    await map.flyTo({
      center: [currentSimulation.location.longitude, currentSimulation.location.latitude],
      zoom: 10,
      duration: 1500
    });
    
    setIsAnimating(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Controls */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Asteroid/Comet:
            </label>
            <select
              value={selectedComet.id}
              onChange={(e) => {
                const comet = TEST_COMETS.find(c => c.id === e.target.value);
                if (comet) setSelectedComet(comet);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {TEST_COMETS.map(comet => (
                <option key={comet.id} value={comet.id}>
                  {comet.name} ({comet.diameter}m)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Impact Location:
            </label>
            <div className="text-sm text-gray-600">
              {impactLocation.city} ({impactLocation.longitude.toFixed(2)}, {impactLocation.latitude.toFixed(2)})
            </div>
          </div>
          
          <button
            onClick={runImpactAnimation}
            disabled={isAnimating || !mapLoaded}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnimating ? 'Simulating...' : 'Simulate Impact'}
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full h-[500px] bg-black"
        />
        
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <div>Loading 3D Globe...</div>
            </div>
          </div>
        )}
      </div>

      {/* Simulation Results */}
      {currentSimulation && (
        <div className="p-4 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Impact Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="text-gray-600">Impact Energy</div>
              <div className="text-xl font-bold text-red-600">
                {currentSimulation.impactEnergy.toLocaleString()} MT
              </div>
              <div className="text-xs text-gray-500">TNT equivalent</div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <div className="text-gray-600">Crater Diameter</div>
              <div className="text-xl font-bold text-orange-600">
                {(currentSimulation.craterDiameter / 1000).toFixed(1)} km
              </div>
              <div className="text-xs text-gray-500">{currentSimulation.craterDiameter}m</div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <div className="text-gray-600">Est. Casualties</div>
              <div className="text-xl font-bold text-red-800">
                {currentSimulation.casualties.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">people</div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <div className="text-gray-600">Economic Damage</div>
              <div className="text-xl font-bold text-green-700">
                ${currentSimulation.economicDamage}B
              </div>
              <div className="text-xs text-gray-500">USD billions</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-600">
            💡 <strong>Tip:</strong> Click anywhere on the globe to change the impact location. 
            The larger the asteroid, the more devastating the impact!
          </div>
        </div>
      )}
    </div>
  );
}