'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ImpactZone } from '@/types/asteroid';

interface EarthWithImpactZoneProps {
  impactZone?: ImpactZone;
  showImpact?: boolean;
}

export default function EarthWithImpactZone({
  impactZone,
  showImpact = false,
}: EarthWithImpactZoneProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const impactRef = useRef<THREE.Mesh>(null);

  // Animate Earth rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  // Convert lat/lon to 3D coordinates
  const impactPosition = useMemo(() => {
    if (!impactZone) return [0, 0, 0];

    const radius = 6;
    const phi = (90 - impactZone.latitude) * (Math.PI / 180);
    const theta = (impactZone.longitude + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return [x, y, z];
  }, [impactZone]);

  return (
    <group>
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[6, 64, 64]} />
        <meshStandardMaterial
          color="#2255ff"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Continents (simplified) */}
      <mesh>
        <sphereGeometry args={[6.01, 64, 64]} />
        <meshStandardMaterial
          color="#44ff44"
          roughness={0.9}
          metalness={0.0}
          opacity={0.5}
          transparent
        />
      </mesh>

      {/* Impact zone indicator */}
      {showImpact && impactZone && (
        <group>
          {/* Impact point */}
          <mesh position={impactPosition as [number, number, number]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={1}
            />
          </mesh>

          {/* Impact radius ring */}
          <mesh
            ref={impactRef}
            position={impactPosition as [number, number, number]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ringGeometry
              args={[
                (impactZone.radius / 6371) * 6,
                (impactZone.radius / 6371) * 6 + 0.1,
                32,
              ]}
            />
            <meshBasicMaterial
              color="#ff0000"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
