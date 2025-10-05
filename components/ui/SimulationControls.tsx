'use client';

import { useState } from 'react';
import { SimulationParams } from '@/types/asteroid';

interface SimulationControlsProps {
  onSimulate: (params: SimulationParams) => void;
  isLoading: boolean;
}

export default function SimulationControls({
  onSimulate,
  isLoading,
}: SimulationControlsProps) {
  const [params, setParams] = useState<SimulationParams>({
    asteroidDiameter: 0.5,
    velocity: 20,
    angle: 45,
    targetLocation: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate(params);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Simulation Parameters
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="diameter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Asteroid Diameter (km)
          </label>
          <input
            type="number"
            id="diameter"
            step="0.1"
            min="0.1"
            max="10"
            value={params.asteroidDiameter}
            onChange={(e) =>
              setParams({
                ...params,
                asteroidDiameter: parseFloat(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="velocity"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Impact Velocity (km/s)
          </label>
          <input
            type="number"
            id="velocity"
            step="1"
            min="5"
            max="70"
            value={params.velocity}
            onChange={(e) =>
              setParams({ ...params, velocity: parseFloat(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="angle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Impact Angle (degrees)
          </label>
          <input
            type="number"
            id="angle"
            step="5"
            min="0"
            max="90"
            value={params.angle}
            onChange={(e) =>
              setParams({ ...params, angle: parseFloat(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Target Latitude
          </label>
          <input
            type="number"
            id="latitude"
            step="0.1"
            min="-90"
            max="90"
            value={params.targetLocation.latitude}
            onChange={(e) =>
              setParams({
                ...params,
                targetLocation: {
                  ...params.targetLocation,
                  latitude: parseFloat(e.target.value),
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Target Longitude
          </label>
          <input
            type="number"
            id="longitude"
            step="0.1"
            min="-180"
            max="180"
            value={params.targetLocation.longitude}
            onChange={(e) =>
              setParams({
                ...params,
                targetLocation: {
                  ...params.targetLocation,
                  longitude: parseFloat(e.target.value),
                },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? 'Simulating...' : 'Run Simulation'}
        </button>
      </form>
    </div>
  );
}
