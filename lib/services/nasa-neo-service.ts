import axios from 'axios';
import { NeoData } from '@/types/asteroid';

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
const NASA_NEO_API_BASE = 'https://api.nasa.gov/neo/rest/v1';

export class NasaNeoService {
  /**
   * Fetch Near-Earth Objects for a specific date range
   */
  static async getNeoFeed(startDate: string, endDate: string): Promise<NeoData[]> {
    try {
      const response = await axios.get(`${NASA_NEO_API_BASE}/feed`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          api_key: NASA_API_KEY,
        },
      });

      const neoData: NeoData[] = [];
      const nearEarthObjects = response.data.near_earth_objects;

      // Flatten the date-grouped data
      Object.keys(nearEarthObjects).forEach((date) => {
        neoData.push(...nearEarthObjects[date]);
      });

      return neoData;
    } catch (error) {
      console.error('Error fetching NEO feed:', error);
      return [];
    }
  }

  /**
   * Fetch a specific asteroid by ID
   */
  static async getAsteroidById(asteroidId: string): Promise<NeoData | null> {
    try {
      const response = await axios.get(
        `${NASA_NEO_API_BASE}/neo/${asteroidId}`,
        {
          params: {
            api_key: NASA_API_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching asteroid ${asteroidId}:`, error);
      return null;
    }
  }

  /**
   * Browse all asteroids with pagination
   */
  static async browseAsteroids(page: number = 0, size: number = 20): Promise<{
    asteroids: NeoData[];
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const response = await axios.get(`${NASA_NEO_API_BASE}/neo/browse`, {
        params: {
          page,
          size,
          api_key: NASA_API_KEY,
        },
      });

      return {
        asteroids: response.data.near_earth_objects,
        totalPages: response.data.page.total_pages,
        currentPage: response.data.page.number,
      };
    } catch (error) {
      console.error('Error browsing asteroids:', error);
      return {
        asteroids: [],
        totalPages: 0,
        currentPage: 0,
      };
    }
  }

  /**
   * Get potentially hazardous asteroids
   */
  static async getHazardousAsteroids(limit: number = 10): Promise<NeoData[]> {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);

    const allAsteroids = await this.getNeoFeed(
      today.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    return allAsteroids
      .filter((neo) => neo.is_potentially_hazardous_asteroid)
      .slice(0, limit);
  }
}
