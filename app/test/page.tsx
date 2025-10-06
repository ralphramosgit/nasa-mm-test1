'use client';

import dynamic from 'next/dynamic';

// Dynamic import to ensure client-side only rendering
const TestMap = dynamic(() => import('@/components/map/TestMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">Loading test map...</div>
});

const SimpleMapbox = dynamic(() => import('@/components/map/SimpleMapbox'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">Loading simple map...</div>
});

const CDNMapbox = dynamic(() => import('@/components/map/CDNMapbox'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">Loading CDN map...</div>
});

const MinimalMapbox = dynamic(() => import('@/components/map/MinimalMapbox'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center">Loading minimal map...</div>
});

const RobustMapbox = dynamic(() => import('@/components/map/RobustMapbox'), {
  ssr: false,
  loading: () => <div className="w-full h-[350px] bg-gray-100 flex items-center justify-center">Loading robust map...</div>
});

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mapbox Test Page</h1>
        <p className="mb-4 text-gray-600">Testing basic Mapbox functionality</p>
        
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Test 1: Basic Mapbox</h2>
          <TestMap />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Test 2: Dynamic Import</h2>
          <SimpleMapbox />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Test 3: CDN Approach</h2>
          <CDNMapbox />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Test 4: Minimal (Debug)</h2>
          <MinimalMapbox />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">Test 5: Robust (Best)</h2>
          <RobustMapbox />
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Debug Info:</strong><br/>
            - Open browser console to see any errors<br/>
            - The map should appear in the red-bordered area above<br/>
            - Token: {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? 'Present' : 'Missing'}
          </p>
        </div>
      </div>
    </div>
  );
}