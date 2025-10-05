'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NeoData } from '@/types/asteroid';

interface OrbitalPathProps {
  neoData: NeoData;
  color?: string;
}

export default function OrbitalPath({ neoData, color = '#00ffff' }: OrbitalPathProps) {
  const lineRef = useRef<THREE.Line>(null);

  // Calculate orbital path points
  const pathPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const numPoints = 128;

    // Parse orbital data
    const perihelion = parseFloat(neoData.orbital_data?.perihelion_distance || '1.0');
    const aphelion = parseFloat(neoData.orbital_data?.aphelion_distance || '2.0');
    const eccentricity = parseFloat(neoData.orbital_data?.eccentricity || '0.1');
    const inclination = parseFloat(neoData.orbital_data?.inclination || '5.0');

    // Semi-major axis
    const a = (perihelion + aphelion) / 2;
    // Semi-minor axis
    const b = a * Math.sqrt(1 - eccentricity * eccentricity);

    // Generate elliptical orbit points
    for (let i = 0; i <= numPoints; i++) {
      const theta = (i / numPoints) * Math.PI * 2;
      const x = a * Math.cos(theta);
      const z = b * Math.sin(theta);
      const y = x * Math.sin((inclination * Math.PI) / 180) * 0.1;

      points.push(new THREE.Vector3(x * 5, y, z * 5));
    }

    return points;
  }, [neoData]);

  // Create line geometry
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    return geometry;
  }, [pathPoints]);

  // Create material
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ color, linewidth: 2 });
  }, [color]);

  // Animate orbit
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />;
}
