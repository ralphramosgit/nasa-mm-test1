'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { NeoData } from '@/types/asteroid';
import { ImpactZone } from '@/types/asteroid';
import Asteroid from './Asteroid';
import OrbitalPath from './OrbitalPath';
import EarthWithImpactZone from './EarthWithImpactZone';

interface ImpactSceneProps {
  selectedAsteroid?: NeoData;
  impactZone?: ImpactZone;
  showOrbits?: boolean;
  showImpact?: boolean;
}

export default function ImpactScene({
  selectedAsteroid,
  impactZone,
  showOrbits = true,
  showImpact = false,
}: ImpactSceneProps) {
  return (
    <div className="w-full h-[600px] bg-black rounded-lg overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} />
        <OrbitControls enableZoom={true} enablePan={true} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Stars background */}
        <Stars
          radius={300}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />

        {/* Sun */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Earth with impact zone */}
        <group position={[10, 0, 0]}>
          <EarthWithImpactZone impactZone={impactZone} showImpact={showImpact} />
        </group>

        {/* Selected asteroid and orbit */}
        {selectedAsteroid && (
          <>
            {showOrbits && <OrbitalPath neoData={selectedAsteroid} />}
            <Asteroid
              neoData={selectedAsteroid}
              position={[15, 2, 5]}
              scale={0.5}
            />
          </>
        )}
      </Canvas>
    </div>
  );
}
