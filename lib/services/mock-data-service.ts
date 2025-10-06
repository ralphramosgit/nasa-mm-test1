import { NeoData } from '@/types/asteroid';

export const mockAsteroidData: NeoData[] = [
  {
    id: "2054",
    name: "54 Alexandra",
    absolute_magnitude_h: 7.57,
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 147.3404906829,
        estimated_diameter_max: 329.4445142292
      }
    },
    is_potentially_hazardous_asteroid: true,
    close_approach_data: [
      {
        close_approach_date: "2025-03-15",
        relative_velocity: {
          kilometers_per_second: "15.7434821043"
        },
        miss_distance: {
          kilometers: "7458963.485738643"
        },
        orbiting_body: "Earth"
      }
    ],
    orbital_data: {
      orbit_determination_date: "2021-04-11",
      orbital_period: "1681.76",
      perihelion_distance: "1.644",
      aphelion_distance: "4.367",
      eccentricity: "0.4539",
      inclination: "11.85"
    }
  },
  {
    id: "3122",
    name: "3122 Florence",
    absolute_magnitude_h: 14.1,
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 4.35,
        estimated_diameter_max: 9.73
      }
    },
    is_potentially_hazardous_asteroid: true,
    close_approach_data: [
      {
        close_approach_date: "2025-09-01",
        relative_velocity: {
          kilometers_per_second: "13.5221"
        },
        miss_distance: {
          kilometers: "7035095.385738643"
        },
        orbiting_body: "Earth"
      }
    ],
    orbital_data: {
      orbit_determination_date: "2021-05-30",
      orbital_period: "859.50",
      perihelion_distance: "1.017",
      aphelion_distance: "2.521",
      eccentricity: "0.4227",
      inclination: "22.15"
    }
  },
  {
    id: "99942",
    name: "99942 Apophis",
    absolute_magnitude_h: 19.7,
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 0.31,
        estimated_diameter_max: 0.68
      }
    },
    is_potentially_hazardous_asteroid: true,
    close_approach_data: [
      {
        close_approach_date: "2029-04-13",
        relative_velocity: {
          kilometers_per_second: "7.42"
        },
        miss_distance: {
          kilometers: "31895.377"
        },
        orbiting_body: "Earth"
      }
    ],
    orbital_data: {
      orbit_determination_date: "2021-04-11",
      orbital_period: "323.60",
      perihelion_distance: "0.746",
      aphelion_distance: "1.099",
      eccentricity: "0.191",
      inclination: "3.34"
    }
  },
  {
    id: "1566",
    name: "1566 Icarus",
    absolute_magnitude_h: 16.9,
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 1.0,
        estimated_diameter_max: 2.3
      }
    },
    is_potentially_hazardous_asteroid: false,
    close_approach_data: [
      {
        close_approach_date: "2025-06-16",
        relative_velocity: {
          kilometers_per_second: "27.71"
        },
        miss_distance: {
          kilometers: "16726695.23"
        },
        orbiting_body: "Earth"
      }
    ],
    orbital_data: {
      orbit_determination_date: "2021-04-11",
      orbital_period: "408.78",
      perihelion_distance: "0.187",
      aphelion_distance: "1.078",
      eccentricity: "0.827",
      inclination: "22.83"
    }
  },
  {
    id: "2101",
    name: "2101 Adonis",
    absolute_magnitude_h: 18.7,
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 0.5,
        estimated_diameter_max: 1.1
      }
    },
    is_potentially_hazardous_asteroid: false,
    close_approach_data: [
      {
        close_approach_date: "2025-07-10",
        relative_velocity: {
          kilometers_per_second: "12.84"
        },
        miss_distance: {
          kilometers: "3284759.12"
        },
        orbiting_body: "Earth"
      }
    ],
    orbital_data: {
      orbit_determination_date: "2021-04-11",
      orbital_period: "930.95",
      perihelion_distance: "0.441",
      aphelion_distance: "3.302",
      eccentricity: "0.764",
      inclination: "1.33"
    }
  },
  {
    id: "4179",
    name: "4179 Toutatis",
    absolute_magnitude_h: 15.3,
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: 2.44,
        estimated_diameter_max: 5.46
      }
    },
    is_potentially_hazardous_asteroid: true,
    close_approach_data: [
      {
        close_approach_date: "2025-11-29",
        relative_velocity: {
          kilometers_per_second: "11.02"
        },
        miss_distance: {
          kilometers: "7053662.477"
        },
        orbiting_body: "Earth"
      }
    ],
    orbital_data: {
      orbit_determination_date: "2021-04-11",
      orbital_period: "1470.09",
      perihelion_distance: "0.924",
      aphelion_distance: "4.132",
      eccentricity: "0.635",
      inclination: "0.47"
    }
  }
];

export class MockDataService {
  static async getAsteroids(page: number = 0, size: number = 20) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const asteroids = mockAsteroidData.slice(startIndex, endIndex);
    
    return {
      asteroids,
      totalPages: Math.ceil(mockAsteroidData.length / size),
      currentPage: page,
    };
  }
  
  static async getAsteroidById(id: string): Promise<NeoData | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return mockAsteroidData.find(asteroid => asteroid.id === id) || null;
  }
}