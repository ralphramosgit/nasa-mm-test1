'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import to avoid SSR issues
const Impact3DSimulator = dynamic(() => import('@/components/map/Impact3DSimulatorSimple'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <div className="text-xl font-semibold text-gray-700">Loading 3D Impact Simulator...</div>
        <div className="text-sm text-gray-500 mt-2">Initializing Mapbox 3D Globe</div>
      </div>
    </div>
  )
});

export default function Impact3DPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🌍 Asteroid Impact Simulator
          </h1>
          <p className="text-xl text-blue-200 mb-6">
            Experience the devastating power of asteroid impacts on a 3D globe
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to NASA Dashboard
            </Link>
            <Link 
              href="/test" 
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔧 Test Maps
            </Link>
          </div>
        </div>

        {/* Simulator */}
        <div className="max-w-6xl mx-auto">
          <Impact3DSimulator className="shadow-2xl" />
        </div>

        {/* Information Panel */}
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-3">🎯 How to Use</h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Click anywhere</strong> on the 3D globe to set impact location</li>
              <li>• <strong>Select different asteroids</strong> from the dropdown menu</li>
              <li>• <strong>Click &ldquo;Simulate Impact&rdquo;</strong> to see the animation</li>
              <li>• <strong>View damage zones</strong> showing destruction radius</li>
              <li>• <strong>Check impact statistics</strong> below the map</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-3">📊 Asteroid Types</h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Small Rocky (50m):</strong> City-level damage</li>
              <li>• <strong>Medium Metallic (200m):</strong> Regional destruction</li>
              <li>• <strong>Large Rocky (1km):</strong> Continental impact</li>
              <li>• <strong>Giant Icy (5km):</strong> Civilization threat</li>
              <li>• <strong>Extinction Level (10km):</strong> Global catastrophe</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-blue-200 text-sm">
          <p>
            Powered by <strong>Mapbox 3D Globe</strong> • 
            Asteroid data simulated • 
            Impact calculations based on scientific models
          </p>
          <p className="mt-2 text-xs text-blue-300">
            This is a simulation for educational purposes. 
            Real asteroid impacts would have complex environmental effects not shown here.
          </p>
        </div>
      </div>
    </div>
  );
}