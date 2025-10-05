import axios from 'axios';
import { GeologicalData } from '@/types/asteroid';

const USGS_EARTHQUAKE_API = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

export class UsgsService {
  /**
   * Fetch earthquake history for a specific location
   */
  static async getEarthquakeHistory(
    latitude: number,
    longitude: number,
    radiusKm: number = 100,
    startTime?: string,
    endTime?: string
  ): Promise<Record<string, unknown>[]> {
    try {
      const params: Record<string, string | number> = {
        format: 'geojson',
        latitude,
        longitude,
        maxradiuskm: radiusKm,
        orderby: 'time',
      };

      if (startTime) params.starttime = startTime;
      if (endTime) params.endtime = endTime;

      const response = await axios.get(USGS_EARTHQUAKE_API, { params });

      return response.data.features || [];
    } catch (error) {
      console.error('Error fetching earthquake history:', error);
      return [];
    }
  }

  /**
   * Get geological data for impact zone assessment
   */
  static async getGeologicalData(
    latitude: number,
    longitude: number
  ): Promise<GeologicalData> {
    // Get earthquake history for the location
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 10);

    const earthquakeHistory = await this.getEarthquakeHistory(
      latitude,
      longitude,
      200,
      oneYearAgo.toISOString(),
      new Date().toISOString()
    );

    // Estimate population density based on location
    // This is a simplified model - in production, use a proper population density API
    const populationDensity = this.estimatePopulationDensity(
      latitude,
      longitude
    );

    return {
      location: { latitude, longitude },
      rockType: this.estimateRockType(latitude, longitude),
      soilComposition: this.estimateSoilComposition(latitude, longitude),
      earthquakeHistory,
      populationDensity,
    };
  }

  /**
   * Estimate rock type based on location (simplified model)
   */
  private static estimateRockType(
    latitude: number,
    longitude: number
  ): string {
    // This is a simplified estimation
    // In production, integrate with actual geological databases
    const types = ['Granite', 'Basalt', 'Limestone', 'Sandstone', 'Shale'];
    const index = Math.abs(Math.floor(latitude + longitude)) % types.length;
    return types[index];
  }

  /**
   * Estimate soil composition based on location (simplified model)
   */
  private static estimateSoilComposition(
    latitude: number,
    longitude: number
  ): string {
    const types = ['Clay', 'Sand', 'Loam', 'Silt', 'Rocky'];
    const index = Math.abs(Math.floor(latitude * 2 + longitude)) % types.length;
    return types[index];
  }

  /**
   * Estimate population density (simplified model)
   */
  private static estimatePopulationDensity(
    latitude: number,
    longitude: number
  ): number {
    // Simplified model - higher density near major city coordinates
    // In production, use a proper population density API or database
    const majorCities = [
      { lat: 40.7128, lon: -74.006, density: 10000 }, // NYC
      { lat: 34.0522, lon: -118.2437, density: 8000 }, // LA
      { lat: 51.5074, lon: -0.1278, density: 5500 }, // London
      { lat: 35.6762, lon: 139.6503, density: 6000 }, // Tokyo
    ];

    let closestDistance = Infinity;
    let estimatedDensity = 100; // Base rural density

    majorCities.forEach((city) => {
      const distance = Math.sqrt(
        Math.pow(latitude - city.lat, 2) + Math.pow(longitude - city.lon, 2)
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        estimatedDensity = city.density * Math.exp(-distance);
      }
    });

    return Math.max(estimatedDensity, 100);
  }
}
