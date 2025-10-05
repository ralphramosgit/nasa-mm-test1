// Type definitions for asteroid data and impact simulation

export interface NeoData {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  orbital_data: OrbitalData;
}

export interface CloseApproachData {
  close_approach_date: string;
  relative_velocity: {
    kilometers_per_second: string;
  };
  miss_distance: {
    kilometers: string;
  };
  orbiting_body: string;
}

export interface OrbitalData {
  orbit_determination_date: string;
  orbital_period: string;
  perihelion_distance: string;
  aphelion_distance: string;
  eccentricity: string;
  inclination: string;
}

export interface ImpactZone {
  latitude: number;
  longitude: number;
  radius: number; // in km
  estimatedCasualties: number;
  economicDamage: number; // in USD
  populationDisplacement: number;
}

export interface ImpactPrediction {
  asteroidId: string;
  impactProbability: number;
  kinecticEnergy: number; // in megatons TNT
  impactZone: ImpactZone;
  secondaryEffects: SecondaryEffects;
  mitigationScenarios: MitigationScenario[];
}

export interface SecondaryEffects {
  infrastructureDamage: {
    roads: number;
    buildings: number;
    utilities: number;
  };
  economicImpact: {
    directDamage: number;
    indirectDamage: number;
    recoveryYears: number;
  };
  populationImpact: {
    displacement: number;
    casualties: number;
    affectedArea: number;
  };
  environmentalImpact: {
    craterSize: number;
    dustCloudRadius: number;
    seismicActivity: number;
    tsunamiWaves?: TsunamiData;
    earthquakes?: EarthquakeData;
  };
}

export interface TsunamiData {
  maxWaveHeight: number; // in meters
  propagationRadius: number; // in km
  affectedCoastlines: number;
  waveSpeed: number; // in km/h
}

export interface EarthquakeData {
  magnitude: number; // Richter scale
  epicenterDepth: number; // in km
  propagationRadius: number; // in km
  shakeIntensity: number; // 0-1 scale
}

export interface MitigationScenario {
  id: string;
  name: string;
  description: string;
  successProbability: number;
  cost: number;
  timeRequired: number; // in years
  effectivenessScore: number;
}

export interface GeologicalData {
  location: {
    latitude: number;
    longitude: number;
  };
  rockType: string;
  soilComposition: string;
  earthquakeHistory: Record<string, unknown>[];
  populationDensity: number;
}

export interface SimulationParams {
  asteroidDiameter: number; // in km
  velocity: number; // in km/s
  angle: number; // in degrees
  targetLocation: {
    latitude: number;
    longitude: number;
  };
}
