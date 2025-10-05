'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NeoData } from '@/types/asteroid';

interface AsteroidProps {
  neoData: NeoData;
  position?: [number, number, number];
  scale?: number;
}

export default function Asteroid({
  neoData,
  position = [0, 0, 0],
  scale = 1,
}: AsteroidProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Get asteroid size
  const diameter =
    (neoData.estimated_diameter?.kilometers?.estimated_diameter_min +
      neoData.estimated_diameter?.kilometers?.estimated_diameter_max) /
    2;

  // Animate rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[diameter * 100, 32, 32]} />
      <meshStandardMaterial
        color={neoData.is_potentially_hazardous_asteroid ? '#ff4444' : '#888888'}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}
