'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ImpactZone, SecondaryEffects } from '@/types/asteroid';

interface EnhancedEarthProps {
  impactZone?: ImpactZone;
  showImpact?: boolean;
  secondaryEffects?: SecondaryEffects;
  animateImpact?: boolean;
}

export default function EnhancedEarth({
  impactZone,
  showImpact = false,
  secondaryEffects,
  animateImpact = false,
}: EnhancedEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const craterRef = useRef<THREE.Mesh>(null);
  const [impactAnimation, setImpactAnimation] = useState(0);
  const [showCrater, setShowCrater] = useState(false);

  // Earth textures (using procedural generation since we don't have actual texture files)
  const earthTexture = useMemo(() => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create ocean base
      const oceanGradient = ctx.createLinearGradient(0, 0, 0, size);
      oceanGradient.addColorStop(0, '#1a4d7a');
      oceanGradient.addColorStop(0.5, '#2255aa');
      oceanGradient.addColorStop(1, '#1a4d7a');
      ctx.fillStyle = oceanGradient;
      ctx.fillRect(0, 0, size, size);
      
      // Add land masses (simplified continents)
      ctx.fillStyle = '#2d5016';
      
      // North America
      ctx.beginPath();
      ctx.ellipse(200, 300, 150, 180, 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // South America
      ctx.beginPath();
      ctx.ellipse(250, 550, 100, 150, 0.2, 0, Math.PI * 2);
      ctx.fill();
      
      // Europe/Africa
      ctx.beginPath();
      ctx.ellipse(550, 350, 120, 200, -0.1, 0, Math.PI * 2);
      ctx.fill();
      
      // Asia
      ctx.beginPath();
      ctx.ellipse(750, 300, 200, 150, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Australia
      ctx.beginPath();
      ctx.ellipse(850, 600, 80, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Add some terrain variation
      for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#3d6d26' : '#448833';
        ctx.fillRect(
          Math.random() * size,
          Math.random() * size,
          Math.random() * 3 + 1,
          Math.random() * 3 + 1
        );
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Normal map for surface details
  const normalMap = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#8080ff';
      ctx.fillRect(0, 0, size, size);
      
      // Add noise for surface details
      for (let i = 0; i < 2000; i++) {
        const brightness = Math.floor(Math.random() * 100 + 100);
        ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${255})`;
        ctx.fillRect(
          Math.random() * size,
          Math.random() * size,
          Math.random() * 2 + 1,
          Math.random() * 2 + 1
        );
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);



  // Animate Earth rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    
    // Impact animation
    if (animateImpact && impactAnimation < 1) {
      setImpactAnimation((prev) => Math.min(prev + 0.02, 1));
      if (impactAnimation > 0.3 && !showCrater) {
        setShowCrater(true);
      }
    }
    
    // Animate crater formation
    if (craterRef.current && showCrater) {
      const scale = Math.min(impactAnimation * 2, 1);
      craterRef.current.scale.set(scale, scale, scale);
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

  // Calculate crater size based on impact energy
  const craterSize = useMemo(() => {
    if (!secondaryEffects?.environmentalImpact?.craterSize) return 0.3;
    // Scale crater size appropriately (in 3D units)
    return Math.min((secondaryEffects.environmentalImpact.craterSize / 100) * 0.5, 1);
  }, [secondaryEffects]);

  // Reset animation when impact changes
  useEffect(() => {
    if (animateImpact) {
      setImpactAnimation(0);
      setShowCrater(false);
    }
  }, [animateImpact, impactZone]);

  return (
    <group>
      {/* Main Earth sphere with realistic textures */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[6, 128, 128]} />
        <meshStandardMaterial
          map={earthTexture}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[6, 64, 64]} />
        <meshBasicMaterial
          color="#4499ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Impact effects */}
      {showImpact && impactZone && (
        <group>
          {/* Impact point marker */}
          <mesh position={impactPosition as [number, number, number]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={2}
            />
          </mesh>

          {/* Crater visualization */}
          {showCrater && (
            <mesh
              ref={craterRef}
              position={impactPosition as [number, number, number]}
            >
              <sphereGeometry args={[craterSize, 32, 32]} />
              <meshStandardMaterial
                color="#3d2415"
                roughness={1}
                metalness={0}
                opacity={0.8}
                transparent
              />
            </mesh>
          )}

          {/* Impact blast radius */}
          <mesh
            position={impactPosition as [number, number, number]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <ringGeometry
              args={[
                (impactZone.radius / 6371) * 6,
                (impactZone.radius / 6371) * 6 + 0.15,
                64,
              ]}
            />
            <meshBasicMaterial
              color="#ff4400"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Seismic wave visualization */}
          {secondaryEffects?.environmentalImpact?.earthquakes && (
            <>
              <mesh
                position={impactPosition as [number, number, number]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <ringGeometry
                  args={[
                    (secondaryEffects.environmentalImpact.earthquakes.propagationRadius / 6371) * 6,
                    (secondaryEffects.environmentalImpact.earthquakes.propagationRadius / 6371) * 6 + 0.1,
                    64,
                  ]}
                />
                <meshBasicMaterial
                  color="#ffaa00"
                  transparent
                  opacity={0.3}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </>
          )}

          {/* Tsunami wave visualization */}
          {secondaryEffects?.environmentalImpact?.tsunamiWaves && (
            <>
              {/* Inner tsunami wave */}
              <mesh
                position={impactPosition as [number, number, number]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <ringGeometry
                  args={[
                    (secondaryEffects.environmentalImpact.tsunamiWaves.propagationRadius * 0.5 / 6371) * 6,
                    (secondaryEffects.environmentalImpact.tsunamiWaves.propagationRadius * 0.5 / 6371) * 6 + 0.08,
                    64,
                  ]}
                />
                <meshBasicMaterial
                  color="#00aaff"
                  transparent
                  opacity={0.6}
                  side={THREE.DoubleSide}
                />
              </mesh>
              
              {/* Outer tsunami wave */}
              <mesh
                position={impactPosition as [number, number, number]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <ringGeometry
                  args={[
                    (secondaryEffects.environmentalImpact.tsunamiWaves.propagationRadius / 6371) * 6,
                    (secondaryEffects.environmentalImpact.tsunamiWaves.propagationRadius / 6371) * 6 + 0.08,
                    64,
                  ]}
                />
                <meshBasicMaterial
                  color="#0088dd"
                  transparent
                  opacity={0.4}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </>
          )}

          {/* Dust cloud visualization */}
          {secondaryEffects?.environmentalImpact?.dustCloudRadius && (
            <mesh
              position={impactPosition as [number, number, number]}
              scale={[
                (secondaryEffects.environmentalImpact.dustCloudRadius / 6371) * 6,
                (secondaryEffects.environmentalImpact.dustCloudRadius / 6371) * 6,
                (secondaryEffects.environmentalImpact.dustCloudRadius / 6371) * 6,
              ]}
            >
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshBasicMaterial
                color="#886644"
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Impact flash (animated) */}
          {animateImpact && impactAnimation < 0.3 && (
            <mesh position={impactPosition as [number, number, number]}>
              <sphereGeometry args={[0.5 + impactAnimation * 2, 16, 16]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={1 - impactAnimation * 3}
              />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
}
