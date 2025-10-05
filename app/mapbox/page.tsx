'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { NeoData, ImpactPrediction, SimulationParams } from '@/types/asteroid';
import { NasaNeoService } from '@/lib/services/nasa-neo-service';
import { UsgsService } from '@/lib/services/usgs-service';
import { ImpactPredictor } from '@/lib/ml/impact-predictor';
import AsteroidDataTable from '@/components/tables/AsteroidDataTable';
import SimulationControls from '@/components/ui/SimulationControls';

// Dynamic import for Map (client-side only)
const MapboxReactMap = dynamic(() => import('@/components/map/MapboxReactMap'), { ssr: false });

export default function MapboxPage() {
  const [asteroids, setAsteroids] = useState<NeoData[]>([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState<NeoData | undefined>();
  const [prediction, setPrediction] = useState<ImpactPrediction | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [mapLocation, setMapLocation] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
  const [usingMockData, setUsingMockData] = useState(false);

  // Load asteroids on mount
  useEffect(() => {
    loadAsteroids();
  }, []);

  const loadAsteroids = async () => {
    setIsLoading(true);
    try {
      const result = await NasaNeoService.browseAsteroids(0, 10);
      setAsteroids(result.asteroids);
      
      // Check if we got the expected number of asteroids (indicating mock data usage)
      if (result.asteroids.length === 6 && result.asteroids[0]?.name === "54 Alexandra") {
        setUsingMockData(true);
      }
    } catch (error) {
      console.error('Error loading asteroids:', error);
      setUsingMockData(true);
    }
    setIsLoading(false);
  };

  const handleAsteroidSelect = (asteroid: NeoData) => {
    setSelectedAsteroid(asteroid);
    setPrediction(undefined);
  };

  const handleSimulate = async (params: SimulationParams) => {
    if (!selectedAsteroid) return;

    setIsLoading(true);
    try {
      // Get geological data for target location
      const geologicalData = await UsgsService.getGeologicalData(
        params.targetLocation.latitude,
        params.targetLocation.longitude
      );

      // Run ML prediction
      const predictor = new ImpactPredictor();
      await predictor.initializeModel();

      const impactPrediction = await predictor.predictImpact(
        params,
        geologicalData,
        selectedAsteroid.id
      );

      setPrediction(impactPrediction);
    } catch (error) {
      console.error('Error running simulation:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Mapbox Asteroid Impact Simulator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Interactive 3D globe for asteroid impact simulation using Mapbox GL JS
          </p>
          
          {/* Navigation */}
          <div className="flex gap-4 mb-4">
            <Link 
              href="/"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← Back to Main Simulator
            </Link>
          </div>

          {usingMockData && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                ⚠️ Using sample data due to NASA API rate limiting. The simulation features still work normally!
              </p>
            </div>
          )}
        </div>

        {/* Main Map Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Impact Location Selector
              </h2>
              <MapboxReactMap
                onLocationChange={(lat: number, lon: number) => setMapLocation({ latitude: lat, longitude: lon })}
              />
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Instructions:</strong></p>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Click anywhere on the globe to set the asteroid impact point</li>
                  <li>Select an asteroid from the list below</li>
                  <li>Adjust impact parameters and run the simulation</li>
                  <li>The predicted impact zone will appear as a red circle</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Controls and Data */}
          <div className="space-y-6">
            {/* Simulation Controls */}
            <SimulationControls
              onSimulate={handleSimulate}
              isLoading={isLoading}
              selectedLocation={mapLocation}
            />

            {/* Selected Asteroid Info */}
            {selectedAsteroid && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Selected Asteroid
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="text-md font-semibold text-gray-900 dark:text-white">
                      {selectedAsteroid.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Diameter (km)
                    </p>
                    <p className="text-md font-semibold text-gray-900 dark:text-white">
                      {selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Potentially Hazardous
                    </p>
                    <p className="text-md font-semibold">
                      {selectedAsteroid.is_potentially_hazardous_asteroid ? (
                        <span className="text-red-600">Yes</span>
                      ) : (
                        <span className="text-green-600">No</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Impact Prediction Results */}
            {prediction && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Impact Prediction
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Impact Radius:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {prediction.impactZone.radius.toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Casualties:</span>
                    <span className="font-semibold text-red-600">
                      {prediction.impactZone.estimatedCasualties.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Economic Damage:</span>
                    <span className="font-semibold text-red-600">
                      ${(prediction.impactZone.economicDamage / 1e9).toFixed(1)}B
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Kinetic Energy:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {prediction.kinecticEnergy.toFixed(1)} MT TNT
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Asteroid List */}
        <div className="mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Available Asteroids
            </h2>
            <AsteroidDataTable
              asteroids={asteroids}
              onSelectAsteroid={handleAsteroidSelect}
              selectedAsteroid={selectedAsteroid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}