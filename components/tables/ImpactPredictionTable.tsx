'use client';

import { ImpactPrediction } from '@/types/asteroid';

interface ImpactPredictionTableProps {
  prediction?: ImpactPrediction;
}

export default function ImpactPredictionTable({
  prediction,
}: ImpactPredictionTableProps) {
  if (!prediction) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-500 dark:text-gray-400">
          Select an asteroid to see impact predictions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Impact Prediction Analysis
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Impact Info */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Impact Parameters
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Impact Probability
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {(prediction.impactProbability * 100).toFixed(3)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kinetic Energy
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {prediction.kinecticEnergy.toFixed(2)} MT TNT
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Impact Radius
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {prediction.impactZone.radius.toFixed(2)} km
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Location
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {prediction.impactZone.latitude.toFixed(2)}°,{' '}
                {prediction.impactZone.longitude.toFixed(2)}°
              </p>
            </div>
          </div>
        </div>

        {/* Population Impact */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Population Impact
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Estimated Casualties
              </p>
              <p className="text-lg font-semibold text-red-600">
                {prediction.secondaryEffects.populationImpact.casualties.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Population Displacement
              </p>
              <p className="text-lg font-semibold text-orange-600">
                {prediction.secondaryEffects.populationImpact.displacement.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Affected Area
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {prediction.secondaryEffects.populationImpact.affectedArea.toFixed(
                  2
                )}{' '}
                km²
              </p>
            </div>
          </div>
        </div>

        {/* Economic Impact */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Economic Impact
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Direct Damage
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                $
                {(
                  prediction.secondaryEffects.economicImpact.directDamage /
                  1000000000
                ).toFixed(2)}
                B
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Indirect Damage
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                $
                {(
                  prediction.secondaryEffects.economicImpact.indirectDamage /
                  1000000000
                ).toFixed(2)}
                B
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recovery Time
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {prediction.secondaryEffects.economicImpact.recoveryYears} years
              </p>
            </div>
          </div>
        </div>

        {/* Infrastructure Damage */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Infrastructure Damage
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Roads
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${prediction.secondaryEffects.infrastructureDamage.roads}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {prediction.secondaryEffects.infrastructureDamage.roads.toFixed(
                    1
                  )}
                  %
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Buildings
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${prediction.secondaryEffects.infrastructureDamage.buildings}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {prediction.secondaryEffects.infrastructureDamage.buildings.toFixed(
                    1
                  )}
                  %
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Utilities
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${prediction.secondaryEffects.infrastructureDamage.utilities}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {prediction.secondaryEffects.infrastructureDamage.utilities.toFixed(
                    1
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
            Environmental Impact
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Crater Size
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {prediction.secondaryEffects.environmentalImpact.craterSize.toFixed(
                  2
                )}{' '}
                km
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dust Cloud Radius
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {prediction.secondaryEffects.environmentalImpact.dustCloudRadius.toFixed(
                  2
                )}{' '}
                km
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Seismic Activity
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {prediction.secondaryEffects.environmentalImpact.seismicActivity.toFixed(
                  1
                )}{' '}
                Richter
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
