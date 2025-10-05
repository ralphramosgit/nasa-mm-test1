'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ImpactZone } from '@/types/asteroid';

interface ImpactAsteroidProps {
  impactZone?: ImpactZone;
  animate?: boolean;
  asteroidSize?: number;
}

export default function ImpactAsteroid({
  impactZone,
  animate = false,
  asteroidSize = 0.3,
}: ImpactAsteroidProps) {
  const asteroidRef = useRef<THREE.Mesh>(null);
  const animationProgress = useRef(0);

  // Convert lat/lon to 3D coordinates on Earth's surface
  const targetPosition = useMemo(() => {
    if (!impactZone) return [0, 0, 0];

    const radius = 6;
    const phi = (90 - impactZone.latitude) * (Math.PI / 180);
    const theta = (impactZone.longitude + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return [x, y, z];
  }, [impactZone]);

  // Starting position for the asteroid (far from Earth, at an angle)
  const startPosition = useMemo(() => {
    const [x, y, z] = targetPosition;
    const distance = 30; // Start 30 units away from Earth
    const direction = new THREE.Vector3(x, y, z).normalize();
    
    // Add some angle variation to make it more interesting
    return [
      direction.x * distance - 5,
      direction.y * distance + 10,
      direction.z * distance - 5,
    ];
  }, [targetPosition]);

  // Animate asteroid approaching Earth
  useFrame(() => {
    if (!asteroidRef.current || !animate) return;

    // Increase animation progress
    if (animationProgress.current < 1) {
      animationProgress.current += 0.005; // Speed of approach
    } else {
      animationProgress.current = 0; // Loop animation
    }

    const t = animationProgress.current;
    
    // Interpolate position from start to target
    const [sx, sy, sz] = startPosition;
    const [tx, ty, tz] = targetPosition;
    
    asteroidRef.current.position.x = sx + (tx - sx) * t;
    asteroidRef.current.position.y = sy + (ty - sy) * t;
    asteroidRef.current.position.z = sz + (tz - sz) * t;
    
    // Add rotation for realism
    asteroidRef.current.rotation.x += 0.02;
    asteroidRef.current.rotation.y += 0.03;
    
    // Scale down as it approaches (perspective effect)
    const scale = asteroidSize * (1 + (1 - t) * 2);
    asteroidRef.current.scale.set(scale, scale, scale);
  });

  if (!impactZone || !animate) return null;

  return (
    <mesh ref={asteroidRef} position={startPosition as [number, number, number]}>
      <dodecahedronGeometry args={[asteroidSize, 1]} />
      <meshStandardMaterial
        color="#8b7355"
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}
