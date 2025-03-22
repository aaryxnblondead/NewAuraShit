import axios from 'axios';
import { SupportedPlatform, PlatformMetrics } from '../types';

export class ApiIntegrationService {
  private apiKeys: Record<SupportedPlatform, string>;
  
  constructor(apiKeys: Record<SupportedPlatform, string>) {
    this.apiKeys = apiKeys;
  }
  
  async fetchPlatformData(platform: SupportedPlatform, handle: string): Promise<any> {
    switch (platform) {
      case SupportedPlatform.INSTAGRAM:
        return this.fetchInstagramData(handle);
      case SupportedPlatform.TWITTER:
        return this.fetchTwitterData(handle);
      case SupportedPlatform.FACEBOOK:
        return this.fetchFacebookData(handle);
      case SupportedPlatform.YOUTUBE:
        return this.fetchYouTubeData(handle);
      case SupportedPlatform.LINKEDIN:
        return this.fetchLinkedInData(handle);
      case SupportedPlatform.GITHUB:
        return this.fetchGitHubData(handle);
      // Implement other platforms similarly
      default:
        throw new Error(`Platform ${platform} not supported`);
    }
  }
  
  private async fetchInstagramData(handle: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/me?fields=id,username,media_count,account_type&access_token=${this.apiKeys[SupportedPlatform.INSTAGRAM]}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching Instagram data for ${handle}:`, error);
      throw error;
    }
  }
  
  private async fetchTwitterData(handle: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.twitter.com/2/users/by/username/${handle}?user.fields=public_metrics,created_at,verified`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKeys[SupportedPlatform.TWITTER]}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching Twitter data for ${handle}:`, error);
      throw error;
    }
  }
  
  // Implement other platform methods similarly
  private async fetchFacebookData(handle: string): Promise<any> {
    // Facebook Graph API implementation
    return {};
  }
  
  private async fetchYouTubeData(handle: string): Promise<any> {
    // YouTube API implementation
    return {};
  }
  
  private async fetchLinkedInData(handle: string): Promise<any> {
    // LinkedIn API implementation
    return {};
  }
  
  private async fetchGitHubData(handle: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${handle}`,
        {
          headers: {
            Authorization: `token ${this.apiKeys[SupportedPlatform.GITHUB]}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching GitHub data for ${handle}:`, error);
      throw error;
    }
  }
}
