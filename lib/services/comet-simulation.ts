import { CometData, ImpactLocation, ImpactSimulation, DamageZone } from '@/types/comet';

// Test comet data - various sizes and compositions
export const TEST_COMETS: CometData[] = [
  {
    id: 'small-rocky',
    name: 'Small Rocky Asteroid',
    diameter: 50, // 50 meters - like Chelyabinsk meteor
    velocity: 18,
    composition: 'rocky',
    density: 2500
  },
  {
    id: 'medium-metallic',
    name: 'Medium Metallic Asteroid',
    diameter: 200, // 200 meters
    velocity: 25,
    composition: 'metallic',
    density: 7800
  },
  {
    id: 'large-rocky',
    name: 'Large Rocky Asteroid',
    diameter: 1000, // 1 km - like the one that killed dinosaurs was 10km
    velocity: 20,
    composition: 'rocky',
    density: 2200
  },
  {
    id: 'giant-icy',
    name: 'Giant Icy Comet',
    diameter: 5000, // 5 km - civilization threat
    velocity: 30,
    composition: 'icy',
    density: 1000
  },
  {
    id: 'extinction-level',
    name: 'Extinction Level Asteroid',
    diameter: 10000, // 10 km - like Chicxulub impactor
    velocity: 25,
    composition: 'rocky',
    density: 2500
  }
];

// Calculate impact energy using kinetic energy formula: KE = 0.5 * m * v²
function calculateImpactEnergy(comet: CometData): number {
  const radius = comet.diameter / 2;
  const volume = (4/3) * Math.PI * Math.pow(radius, 3); // m³
  const mass = volume * comet.density; // kg
  const velocityMs = comet.velocity * 1000; // convert km/s to m/s
  const energyJoules = 0.5 * mass * Math.pow(velocityMs, 2);
  
  // Convert to megatons TNT (1 megaton = 4.184 × 10^15 joules)
  const megatons = energyJoules / (4.184e15);
  return Math.round(megatons * 100) / 100;
}

// Calculate crater diameter using scaling laws
function calculateCraterDiameter(comet: CometData, energy: number): number {
  // Simplified crater scaling: D = k * (E/ρ)^0.25
  // Where D is diameter, E is energy, ρ is target density
  const targetDensity = 2600; // typical rock density kg/m³
  const scalingConstant = 1.8; // empirical constant
  
  const energyJoules = energy * 4.184e15; // convert back to joules
  const diameter = scalingConstant * Math.pow(energyJoules / targetDensity, 0.25);
  
  return Math.round(diameter);
}

// Calculate damage zones based on impact energy
function calculateDamageZones(energy: number): DamageZone[] {
  // Damage zones based on overpressure and thermal effects
  const zones: DamageZone[] = [];
  
  // Scale factor based on energy (roughly proportional to cube root)
  const scaleFactor = Math.pow(energy, 1/3);
  
  zones.push({
    type: 'total_destruction',
    radius: Math.round(scaleFactor * 2 * 100) / 100,
    description: 'Total destruction - nothing survives',
    color: '#ff0000'
  });
  
  zones.push({
    type: 'severe_damage',
    radius: Math.round(scaleFactor * 5 * 100) / 100,
    description: 'Severe structural damage, high casualties',
    color: '#ff6600'
  });
  
  zones.push({
    type: 'moderate_damage',
    radius: Math.round(scaleFactor * 12 * 100) / 100,
    description: 'Moderate damage, broken windows, injuries',
    color: '#ffaa00'
  });
  
  zones.push({
    type: 'light_damage',
    radius: Math.round(scaleFactor * 25 * 100) / 100,
    description: 'Light damage, felt strongly',
    color: '#ffdd00'
  });
  
  return zones;
}

// Estimate casualties based on population density and damage zones
function estimateCasualties(location: ImpactLocation, damageZones: DamageZone[]): number {
  // Simplified population density estimates by region
  const populationDensities = {
    'high': 5000, // people per km² - major cities
    'medium': 500, // suburban areas
    'low': 50, // rural areas
  };
  
  // For simulation, assume medium density
  const density = populationDensities.medium;
  
  let casualties = 0;
  damageZones.forEach(zone => {
    const area = Math.PI * Math.pow(zone.radius, 2);
    const population = area * density;
    
    let casualtyRate = 0;
    switch(zone.type) {
      case 'total_destruction': casualtyRate = 0.95; break;
      case 'severe_damage': casualtyRate = 0.5; break;
      case 'moderate_damage': casualtyRate = 0.1; break;
      case 'light_damage': casualtyRate = 0.01; break;
    }
    
    casualties += population * casualtyRate;
  });
  
  return Math.round(casualties);
}

// Estimate economic damage
function estimateEconomicDamage(damageZones: DamageZone[]): number {
  const gdpPerKm2 = 1.5; // billion USD per km² (rough global average)
  
  let totalDamage = 0;
  damageZones.forEach(zone => {
    const area = Math.PI * Math.pow(zone.radius, 2);
    let damageRate = 0;
    
    switch(zone.type) {
      case 'total_destruction': damageRate = 1.0; break;
      case 'severe_damage': damageRate = 0.7; break;
      case 'moderate_damage': damageRate = 0.3; break;
      case 'light_damage': damageRate = 0.05; break;
    }
    
    totalDamage += area * gdpPerKm2 * damageRate;
  });
  
  return Math.round(totalDamage * 100) / 100;
}

export function simulateImpact(comet: CometData, location: ImpactLocation): ImpactSimulation {
  const impactEnergy = calculateImpactEnergy(comet);
  const craterDiameter = calculateCraterDiameter(comet, impactEnergy);
  const damageZones = calculateDamageZones(impactEnergy);
  const casualties = estimateCasualties(location, damageZones);
  const economicDamage = estimateEconomicDamage(damageZones);
  
  return {
    comet,
    location,
    impactEnergy,
    craterDiameter,
    damageRadius: damageZones[damageZones.length - 1]?.radius || 0,
    casualties,
    economicDamage
  };
}

export function getDamageZones(simulation: ImpactSimulation): DamageZone[] {
  return calculateDamageZones(simulation.impactEnergy);
}