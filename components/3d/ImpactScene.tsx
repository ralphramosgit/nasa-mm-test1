'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { NeoData, ImpactZone, ImpactPrediction } from '@/types/asteroid';
import Asteroid from './Asteroid';
import OrbitalPath from './OrbitalPath';
import EnhancedEarth from './EnhancedEarth';
import ImpactAsteroid from './ImpactAsteroid';

interface ImpactSceneProps {
  selectedAsteroid?: NeoData;
  impactZone?: ImpactZone;
  showOrbits?: boolean;
  showImpact?: boolean;
  prediction?: ImpactPrediction;
  animateImpact?: boolean;
}

export default function ImpactScene({
  selectedAsteroid,
  impactZone,
  showOrbits = true,
  showImpact = false,
  prediction,
  animateImpact = false,
}: ImpactSceneProps) {
  return (
    <div className="w-full h-[600px] bg-black rounded-lg overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={true}
          minDistance={7}
          maxDistance={50}
          zoomSpeed={1.2}
        />

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

        {/* Earth with enhanced impact visualization */}
        <group position={[10, 0, 0]}>
          <EnhancedEarth 
            impactZone={impactZone} 
            showImpact={showImpact}
            secondaryEffects={prediction?.secondaryEffects}
            animateImpact={animateImpact}
          />
          {/* Animated asteroid approaching Earth */}
          <ImpactAsteroid
            impactZone={impactZone}
            animate={animateImpact && showImpact}
            asteroidSize={0.4}
          />
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
