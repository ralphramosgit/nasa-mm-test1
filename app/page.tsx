'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { NeoData, ImpactPrediction, SimulationParams } from '@/types/asteroid';
import { NasaNeoService } from '@/lib/services/nasa-neo-service';
import { UsgsService } from '@/lib/services/usgs-service';
import { ImpactPredictor } from '@/lib/ml/impact-predictor';
import AsteroidDataTable from '@/components/tables/AsteroidDataTable';
import ImpactPredictionTable from '@/components/tables/ImpactPredictionTable';
import MitigationTable from '@/components/tables/MitigationTable';
import SimulationControls from '@/components/ui/SimulationControls';

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
  const [prediction, setPrediction] = useState<ImpactPrediction | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showImpact, setShowImpact] = useState(false);
  const [animateImpact, setAnimateImpact] = useState(false);

  // Load asteroids on mount
  useEffect(() => {
    loadAsteroids();
  }, []);

  const loadAsteroids = async () => {
    setIsLoading(true);
    try {
      const result = await NasaNeoService.browseAsteroids(0, 20);
      setAsteroids(result.asteroids);
    } catch (error) {
      console.error('Error loading asteroids:', error);
    }
    setIsLoading(false);
  };

  const handleAsteroidSelect = (asteroid: NeoData) => {
    setSelectedAsteroid(asteroid);
    setPrediction(undefined);
    setShowImpact(false);
    setAnimateImpact(false);
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
      setShowImpact(true);
      setAnimateImpact(true);
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
            Asteroid Impact Simulator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive 3D visualization and ML-powered impact prediction using NASA NEO and USGS data
          </p>
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
            <button
              onClick={() => setShowImpact(!showImpact)}
              disabled={!prediction}
              className={`px-4 py-2 rounded-md ${
                showImpact
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {showImpact ? 'Hide Impact' : 'Show Impact'}
            </button>
            <button
              onClick={() => setAnimateImpact(!animateImpact)}
              disabled={!prediction || !showImpact}
              className={`px-4 py-2 rounded-md ${
                animateImpact
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {animateImpact ? 'Stop Animation' : 'Animate Impact'}
            </button>
          </div>
          <ImpactScene
            selectedAsteroid={selectedAsteroid}
            impactZone={prediction?.impactZone}
            showOrbits={showOrbits}
            showImpact={showImpact}
            prediction={prediction}
            animateImpact={animateImpact}
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

            {/* Impact Prediction */}
            {prediction && (
              <div>
                <ImpactPredictionTable prediction={prediction} />
              </div>
            )}

            {/* Mitigation Scenarios */}
            {prediction && prediction.mitigationScenarios.length > 0 && (
              <div>
                <MitigationTable scenarios={prediction.mitigationScenarios} />
              </div>
            )}
          </div>

          {/* Right Column - Simulation Controls */}
          <div className="space-y-8">
            <SimulationControls
              onSimulate={handleSimulate}
              isLoading={isLoading}
            />

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
