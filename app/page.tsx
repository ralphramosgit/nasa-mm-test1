'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { NeoData } from '@/types/asteroid';
import { NasaNeoService } from '@/lib/services/nasa-neo-service';
import AsteroidDataTable from '@/components/tables/AsteroidDataTable';

// Dynamically import 3D components to avoid SSR issues
const ImpactScene = dynamic(() => import('@/components/3d/ImpactScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
      <p className="text-white">Loading 3D Visualization...</p>
    </div>
  ),
});

export default function Home() {
  const [asteroids, setAsteroids] = useState<NeoData[]>([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState<NeoData | undefined>();
  const [showOrbits, setShowOrbits] = useState(true);
  const [showImpact, setShowImpact] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load asteroids on mount
  useEffect(() => {
    loadAsteroids();
  }, []);

  const loadAsteroids = async () => {
    setIsLoading(true);
    try {
      const result = await NasaNeoService.browseAsteroids(0, 20);
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
    setShowImpact(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Asteroid Impact Simulator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Interactive 3D visualization and ML-powered impact prediction using NASA NEO and USGS data
          </p>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap gap-4 mb-4">
            <Link 
              href="/impact"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 3D Impact Simulator
            </Link>
            <Link 
              href="/mapbox"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              🌍 Mapbox Globe Version
            </Link>
            <Link 
              href="/test"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              🔧 Test Maps
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

        {/* 3D Visualization */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setShowOrbits(!showOrbits)}
              className={`px-4 py-2 rounded-md ${
                showOrbits
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {showOrbits ? 'Hide Orbits' : 'Show Orbits'}
            </button>
          </div>
          <ImpactScene
            selectedAsteroid={selectedAsteroid}
            showOrbits={showOrbits}
            showImpact={showImpact}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Asteroid List */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Near-Earth Objects
              </h2>
              <AsteroidDataTable
                asteroids={asteroids}
                onSelectAsteroid={handleAsteroidSelect}
                selectedAsteroid={selectedAsteroid}
              />
            </div>

            {/* Mitigation Scenarios - removed, now on Mapbox page */}
          </div>

          {/* Right Column - Simulation Controls */}
          <div className="space-y-8">
            {/* SimulationControls moved next to map above. Keep selected asteroid card here. */}

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
                      Absolute Magnitude
                    </p>
                    <p className="text-md font-semibold text-gray-900 dark:text-white">
                      {selectedAsteroid.absolute_magnitude_h.toFixed(2)}
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
          </div>
        </div>
      </div>
    </div>
  );
}
