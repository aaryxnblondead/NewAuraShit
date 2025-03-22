import axios from 'axios';
import { PublicFigure, SupportedPlatform } from '../rating-system/types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export class RatingApiClient {
  /**
   * Fetches a public figure by ID
   */
  static async getFigure(id: string): Promise<PublicFigure> {
    const response = await axios.get(`${API_BASE_URL}/figures/${id}`);
    return response.data;
  }
  
  /**
   * Searches for public figures
   */
  static async searchFigures(query: string, filters?: any): Promise<PublicFigure[]> {
    const response = await axios.get(`${API_BASE_URL}/figures/search`, {
      params: {
        q: query,
        ...filters
      }
    });
    return response.data;
  }
  
  /**
   * Gets top rated figures
   */
  static async getTopRatedFigures(
    category?: string,
    limit: number = 10,
    sortBy: string = 'overall'
  ): Promise<PublicFigure[]> {
    const response = await axios.get(`${API_BASE_URL}/figures/top`, {
      params: {
        category,
        limit,
        sortBy
      }
    });
    return response.data;
  }
  
  /**
   * Creates a new public figure
   */
  static async createFigure(
    name: string,
    profession: string[],
    platforms: {
      platform: SupportedPlatform;
      handle: string;
      url: string;
    }[]
  ): Promise<PublicFigure> {
    const response = await axios.post(`${API_BASE_URL}/figures`, {
      name,
      profession,
      platforms
    });
    return response.data;
  }
  
  /**
   * Updates a public figure
   */
  static async updateFigure(figure: Partial<PublicFigure> & { id: string }): Promise<PublicFigure> {
    const response = await axios.put(`${API_BASE_URL}/figures/${figure.id}`, figure);
    return response.data;
  }
}
