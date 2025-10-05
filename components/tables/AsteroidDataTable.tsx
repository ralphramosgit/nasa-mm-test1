'use client';

import { NeoData } from '@/types/asteroid';

interface AsteroidDataTableProps {
  asteroids: NeoData[];
  onSelectAsteroid: (asteroid: NeoData) => void;
  selectedAsteroid?: NeoData;
}

export default function AsteroidDataTable({
  asteroids,
  onSelectAsteroid,
  selectedAsteroid,
}: AsteroidDataTableProps) {
  return (
    <div className="w-full overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Diameter (km)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Velocity (km/s)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Miss Distance (km)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Hazardous
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Close Approach
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {asteroids.map((asteroid) => {
            const approach = asteroid.close_approach_data?.[0];
            const diameter =
              (asteroid.estimated_diameter?.kilometers
                ?.estimated_diameter_min +
                asteroid.estimated_diameter?.kilometers
                  ?.estimated_diameter_max) /
              2;

            return (
              <tr
                key={asteroid.id}
                onClick={() => onSelectAsteroid(asteroid)}
                className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedAsteroid?.id === asteroid.id
                    ? 'bg-blue-50 dark:bg-blue-900'
                    : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {asteroid.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {diameter?.toFixed(3)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {approach
                    ? parseFloat(
                        approach.relative_velocity.kilometers_per_second
                      ).toFixed(2)
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {approach
                    ? parseFloat(approach.miss_distance.kilometers).toFixed(0)
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {asteroid.is_potentially_hazardous_asteroid ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Yes
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {approach?.close_approach_date || 'N/A'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
