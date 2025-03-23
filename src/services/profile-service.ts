import { PublicFigure, PlatformPresence, SupportedPlatform, Score } from '../rating-system/types';
import { RatingSystemService } from '../rating-system/services/rating-system.service';
import { ScoreCalculatorService } from '../rating-system/services/score-calculator.service';
import { TrendAnalysisService } from '../rating-system/services/trend-analysis.service';
import { LongevityAnalysisService } from '../rating-system/services/longevity-analysis.service';
import { AntiManipulationService } from '../rating-system/services/anti-manipulation.service';
import { MetricsProcessorService } from '../rating-system/services/metrics-processor.service';
import { prisma } from '../lib/prisma';
import { ApiIntegrationService } from '../rating-system/services/api-integration.service';

// Environment variables for API keys
const API_KEYS: Record<SupportedPlatform, string> = {
  [SupportedPlatform.INSTAGRAM]: process.env.INSTAGRAM_API_KEY || '',
  [SupportedPlatform.TWITTER]: process.env.TWITTER_API_KEY || '',
  // Add other platform API keys as needed
};

const GOOGLE_TRENDS_API_KEY = process.env.GOOGLE_TRENDS_API_KEY || '';
const GOOGLE_NEWS_API_KEY = process.env.GOOGLE_NEWS_API_KEY || '';

export interface ProfileWithMetrics {
  id: string;
  name: string;
  image: string;
  profession: string[];
  biography?: string;
  location?: string;
  organization?: string;
  overallScore: number;
  credibilityScore: number;
  longevityScore: number;
  engagementScore: number;
  trendingScore: number;
  trendDirection: 'up' | 'down' | 'stable';
  careerLongevity: number;
  createdAt: Date;
  updatedAt: Date;
  platforms: {
    id: string;
    figureId: string;
    platform: string;
    handle: string;
    url: string;
    verified?: boolean;
    followers?: number;
    engagement?: number;
    contentQuality?: number;
    consistency?: number;
    longevity?: number;
    influenceScore?: number;
    lastUpdated?: Date;
  }[];
  scoreHistory: {
    id: string;
    figureId: string;
    date: Date;
    overallScore: number;
    credibilityScore: number;
    longevityScore: number;
    engagementScore: number;
  }[];
  googleData?: {
    organizations: any[];
    locations: any[];
    biography: string;
    skills: any[];
    urls: any[];
  };
  metadata?: Record<string, any>;
}

export class ProfileService {
  private ratingSystemService: RatingSystemService;
  private scoreCalculatorService: ScoreCalculatorService;
  private trendAnalysisService: TrendAnalysisService;
  private longevityAnalysisService: LongevityAnalysisService;
  private antiManipulationService: AntiManipulationService;
  private metricsProcessorService: MetricsProcessorService;

  constructor() {
    this.ratingSystemService = new RatingSystemService(
      API_KEYS,
      GOOGLE_TRENDS_API_KEY,
      GOOGLE_NEWS_API_KEY
    );
    this.scoreCalculatorService = new ScoreCalculatorService();
    this.trendAnalysisService = new TrendAnalysisService(
      GOOGLE_TRENDS_API_KEY,
      GOOGLE_NEWS_API_KEY
    );
    this.longevityAnalysisService = new LongevityAnalysisService();
    this.antiManipulationService = new AntiManipulationService();
    this.metricsProcessorService = new MetricsProcessorService();
  }

  /**
   * Get a profile by ID with all metrics and analysis
   */
  async getProfileById(id: string): Promise<ProfileWithMetrics | null> {
    try {
      // Fetch the base profile data from the database
      const dbProfile = await prisma.publicFigure.findUnique({
        where: { id },
        include: {
          platforms: true,
          scoreHistory: {
            orderBy: { date: 'desc' },
            take: 10
          }
        }
      });

      if (!dbProfile) {
        return null;
      }

      // Convert database model to PublicFigure type for rating system
      const figure = this.convertDbProfileToPublicFigure(dbProfile);

      // Evaluate the figure to get the latest metrics and scores
      const evaluatedFigure = await this.ratingSystemService.evaluateFigure(figure);

      // Get trend analysis
      const trendAnalysis = await this.trendAnalysisService.analyzeTrends(evaluatedFigure);

      // Get longevity analysis
      const longevityAnalysis = this.longevityAnalysisService.analyzeLongevity(evaluatedFigure);

      // Determine trend direction
      const trendDirection = this.determineTrendDirection(evaluatedFigure);

      // Convert the evaluated figure back to ProfileWithMetrics
      return this.convertToProfileWithMetrics(
        evaluatedFigure,
        trendAnalysis,
        longevityAnalysis,
        trendDirection
      );
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Get all profiles with metrics
   */
  async getAllProfiles(
    limit: number = 20,
    offset: number = 0,
    sortBy: 'overall' | 'credibility' | 'longevity' | 'engagement' = 'overall',
    sortOrder: 'asc' | 'desc' = 'desc',
    filter?: { profession?: string; minScore?: number }
  ): Promise<ProfileWithMetrics[]> {
    try {
      // Build the query
      const where: any = {};
      
      if (filter?.profession) {
        where.profession = {
          has: filter.profession
        };
      }
      
      if (filter?.minScore) {
        where.overallScore = {
          gte: filter.minScore
        };
      }

      // Fetch profiles from database
      const dbProfiles = await prisma.publicFigure.findMany({
        where,
        include: {
          platforms: true,
          scoreHistory: {
            orderBy: { date: 'desc' },
            take: 1
          }
        },
        orderBy: {
          [sortBy === 'overall' ? 'overallScore' : `${sortBy}Score`]: sortOrder
        },
        skip: offset,
        take: limit
      });

      // Process each profile to add metrics
      const profilePromises = dbProfiles.map(async (dbProfile) => {
        const figure = this.convertDbProfileToPublicFigure(dbProfile);
        
        // For listing, we don't need to re-evaluate each figure, just use stored data
        // But we do need to get trend direction and other derived metrics
        const trendDirection = this.determineTrendDirection(figure);
        
        // Get the latest trend and longevity data from metadata if available
        const trendAnalysis = figure.metadata?.trendAnalysis || {
          trendingScore: 0,
          sentimentScore: 50,
          recentEvents: [],
          contextualRelevance: 50
        };
        
        const longevityAnalysis = figure.metadata?.longevityAnalysis || {
          careerLongevity: 0,
          relevanceSustainability: 50,
          consistencyScore: 50,
          longevityScore: figure.overallScore.longevity
        };

        return this.convertToProfileWithMetrics(
          figure,
          trendAnalysis,
          longevityAnalysis,
          trendDirection
        );
      });

      return Promise.all(profilePromises);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  }

  /**
   * Create a new public figure profile
   */
  async createProfile(profileData: {
    name: string;
    profession: string[];
    platforms: {
      platform: SupportedPlatform;
      handle: string;
      url: string;
    }[];
    image?: string;
    biography?: string;
    location?: string;
    organization?: string;
  }): Promise<ProfileWithMetrics> {
    try {
      // Create the figure using the rating system service
      const figure = await this.ratingSystemService.createFigure(
        profileData.name,
        profileData.profession,
        profileData.platforms
      );

      // Add additional profile data
      figure.image = profileData.image || '';
      figure.biography = profileData.biography;
      figure.location = profileData.location;
      figure.organization = profileData.organization;

      // Save to database
      const dbProfile = await this.saveProfileToDatabase(figure);

      // Get trend analysis
      const trendAnalysis = await this.trendAnalysisService.analyzeTrends(figure);

      // Get longevity analysis
      const longevityAnalysis = this.longevityAnalysisService.analyzeLongevity(figure);

      // Determine trend direction
      const trendDirection = this.determineTrendDirection(figure);

      return this.convertToProfileWithMetrics(
        figure,
        trendAnalysis,
        longevityAnalysis,
        trendDirection
      );
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Update a public figure profile
   */
  async updateProfile(id: string, profileData: {
    name?: string;
    profession?: string[];
    image?: string;
    biography?: string;
    location?: string;
    organization?: string;
    platforms?: {
      platform: SupportedPlatform;
      handle: string;
      url: string;
    }[];
  }): Promise<ProfileWithMetrics> {
    try {
      // Get existing profile
      const existingProfile = await this.getProfileById(id);
      
      if (!existingProfile) {
        throw new Error('Profile not found');
      }

      // Convert to PublicFigure type
      const figure = this.convertProfileWithMetricsToPublicFigure(existingProfile);

      // Update fields
      if (profileData.name) figure.name = profileData.name;
      if (profileData.profession) figure.profession = profileData.profession;
      if (profileData.image) figure.image = profileData.image;
      if (profileData.biography) figure.biography = profileData.biography;
      if (profileData.location) figure.location = profileData.location;
      if (profileData.organization) figure.organization = profileData.organization;

      // Update platforms if provided
      if (profileData.platforms) {
        // Keep existing platforms that aren't being updated
        const existingPlatforms = figure.platforms.filter(
          ep => !profileData.platforms!.some(np => np.platform === ep.platform)
        );

        // Add new platforms
        const newPlatforms = profileData.platforms.map(p => ({
          platform: p.platform,
          handle: p.handle,
          url: p.url,
          verified: false,
          metrics: { rawData: {} },
          lastUpdated: new Date()
        }));

        figure.platforms = [...existingPlatforms, ...newPlatforms];
      }

      // Re-evaluate the figure
      const evaluatedFigure = await this.ratingSystemService.evaluateFigure(figure);

      // Save updated profile to database
      const dbProfile = await this.saveProfileToDatabase(evaluatedFigure);

      // Get trend analysis
      const trendAnalysis = await this.trendAnalysisService.analyzeTrends(evaluatedFigure);

      // Get longevity analysis
      const longevityAnalysis = this.longevityAnalysisService.analyzeLongevity(evaluatedFigure);

      // Determine trend direction
      const trendDirection = this.determineTrendDirection(evaluatedFigure);

      return this.convertToProfileWithMetrics(
        evaluatedFigure,
        trendAnalysis,
        longevityAnalysis,
        trendDirection
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Search for profiles
   */
  async searchProfiles(query: string, limit: number = 20): Promise<ProfileWithMetrics[]> {
    try {
      // Search in database
      const dbProfiles = await prisma.publicFigure.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { profession: { has: query } }
          ]
        },
        include: {
          platforms: true,
          scoreHistory: {
            orderBy: { date: 'desc' },
            take: 1
          }
        },
        take: limit
      });

      // Process each profile to add metrics
      const profilePromises = dbProfiles.map(async (dbProfile) => {
        const figure = this.convertDbProfileToPublicFigure(dbProfile);
        const trendDirection = this.determineTrendDirection(figure);
        
        // Use stored metadata for efficiency in search results
        const trendAnalysis = figure.metadata?.trendAnalysis || {
          trendingScore: 0,
          sentimentScore: 50,
          recentEvents: [],
          contextualRelevance: 50
        };
        
        const longevityAnalysis = figure.metadata?.longevityAnalysis || {
          careerLongevity: 0,
          relevanceSustainability: 50,
          consistencyScore: 50,
          longevityScore: figure.overallScore.longevity
        };

        return this.convertToProfileWithMetrics(
          figure,
          trendAnalysis,
          longevityAnalysis,
          trendDirection
        );
      });

      return Promise.all(profilePromises);
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  }

  /**
   * Get trending profiles
   */
  async getTrendingProfiles(limit: number = 10): Promise<ProfileWithMetrics[]> {
    try {
      // Get profiles with high trending scores from metadata
      const dbProfiles = await prisma.publicFigure.findMany({
        where: {
          metadata: {
            path: ['trendAnalysis', 'trendingScore'],
            gte: 70 // Profiles with trending score >= 70
          }
        },
        include: {
          platforms: true,
          scoreHistory: {
            orderBy: { date: 'desc' },
            take: 1
          }
        },
        orderBy: {
          metadata: {
            path: ['trendAnalysis', 'trendingScore'],
            sort: 'desc'
          }
        },
        take: limit
      });

      // Process each profile
      const profilePromises = dbProfiles.map(async (dbProfile) => {
        const figure = this.convertDbProfileToPublicFigure(dbProfile);
        const trendDirection = this.determineTrendDirection(figure);
        
        const trendAnalysis = figure.metadata?.trendAnalysis || {
          trendingScore: 0,
          sentimentScore: 50,
          recentEvents: [],
          contextualRelevance: 50
        };
        
        const longevityAnalysis = figure.metadata?.longevityAnalysis || {
          careerLongevity: 0,
          relevanceSustainability: 50,
          consistencyScore: 50,
          longevityScore: figure.overallScore.longevity
        };

        return this.convertToProfileWithMetrics(
          figure,
          trendAnalysis,
          longevityAnalysis,
          trendDirection
        );
      });

      return Promise.all(profilePromises);
    } catch (error) {
      console.error('Error getting trending profiles:', error);
      throw error;
    }
  }

  /**
   * Get profiles by profession
   */
  async getProfilesByProfession(profession: string, limit: number = 20): Promise<ProfileWithMetrics[]> {
    try {
      const dbProfiles = await prisma.publicFigure.findMany({
        where: {
          profession: {
            has: profession
          }
        },
        include: {
          platforms: true,
          scoreHistory: {
            orderBy: { date: 'desc' },
            take: 1
          }
        },
        orderBy: {
          overallScore: 'desc'
        },
        take: limit
      });

      // Process each profile
      const profilePromises = dbProfiles.map(async (dbProfile) => {
        const figure = this.convertDbProfileToPublicFigure(dbProfile);
        const trendDirection = this.determineTrendDirection(figure);
        
        const trendAnalysis = figure.metadata?.trendAnalysis || {
          trendingScore: 0,
          sentimentScore: 50,
          recentEvents: [],
          contextualRelevance: 50
        };
        
        const longevityAnalysis = figure.metadata?.longevityAnalysis || {
          careerLongevity: 0,
          relevanceSustainability: 50,
          consistencyScore: 50,
          longevityScore: figure.overallScore.longevity
        };

        return this.convertToProfileWithMetrics(
          figure,
          trendAnalysis,
          longevityAnalysis,
          trendDirection
        );
      });

      return Promise.all(profilePromises);
    } catch (error) {
      console.error('Error getting profiles by profession:', error);
      throw error;
    }
  }

  /**
   * Refresh a profile's metrics and scores
   */
  async refreshProfile(id: string): Promise<ProfileWithMetrics> {
    try {
      // Get existing profile
      const existingProfile = await this.getProfileById(id);
      
      if (!existingProfile) {
        throw new Error('Profile not found');
      }

      // Convert to PublicFigure type
      const figure = this.convertProfileWithMetricsToPublicFigure(existingProfile);

      // Re-evaluate the figure with fresh data
      const evaluatedFigure = await this.ratingSystemService.evaluateFigure(figure);

      // Save updated profile to database
      const dbProfile = await this.saveProfileToDatabase(evaluatedFigure);

      // Get fresh trend analysis
      const trendAnalysis = await this.trendAnalysisService.analyzeTrends(evaluatedFigure);

      // Get fresh longevity analysis
      const longevityAnalysis = this.longevityAnalysisService.analyzeLongevity(evaluatedFigure);

      // Determine trend direction
      const trendDirection = this.determineTrendDirection(evaluatedFigure);

      return this.convertToProfileWithMetrics(
        evaluatedFigure,
        trendAnalysis,
        longevityAnalysis,
        trendDirection
      );
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  }

  /**
   * Get detailed score history for a profile
   */
  async getProfileScoreHistory(id: string): Promise<{
    dates: string[];
    overall: number[];
    credibility: number[];
    longevity: number[];
    engagement: number[];
  }> {
    try {
      const scoreHistory = await prisma.scoreHistory.findMany({
        where: { figureId: id },
        orderBy: { date: 'asc' }
      });

      return {
        dates: scoreHistory.map(entry => entry.date.toISOString()),
        overall: scoreHistory.map(entry => entry.overallScore),
        credibility: scoreHistory.map(entry => entry.credibilityScore),
        longevity: scoreHistory.map(entry => entry.longevityScore),
        engagement: scoreHistory.map(entry => entry.engagementScore)
      };
    } catch (error) {
      console.error('Error getting profile score history:', error);
      throw error;
    }
  }

  /**
   * Get manipulation analysis for a profile
   */
  async getManipulationAnalysis(id: string): Promise<{
    isManipulated: boolean;
    confidenceScore: number;
    flags: string[];
    history: {
      date: string;
      score: number;
      flags: string[];
    }[];
  }> {
    try {
      // Get profile
      const profile = await this.getProfileById(id);
      
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Convert to PublicFigure type
      const figure = this.convertProfileWithMetricsToPublicFigure(profile);

      // Get previous state from history if available
      const previousState = figure.overallScore.history.length > 1 
        ? this.reconstructPreviousState(figure) 
        : undefined;

      // Perform manipulation detection
      const manipulationData = this.antiManipulationService.detectManipulation(figure, previousState);

      // Get manipulation history from metadata
      const manipulationHistory = figure.metadata?.manipulationHistory || [];

      return {
        isManipulated: manipulationData.isManipulated,
        confidenceScore: manipulationData.confidenceScore,
        flags: manipulationData.flags,
        history: manipulationHistory
      };
    } catch (error) {
      console.error('Error getting manipulation analysis:', error);
      throw error;
    }
  }

  // Helper methods

  /**
   * Convert database profile to PublicFigure type
   */
  private convertDbProfileToPublicFigure(dbProfile: any): PublicFigure {
    // Convert platforms
    const platforms: PlatformPresence[] = dbProfile.platforms.map((p: any) => ({
      platform: p.platform as SupportedPlatform,
      handle: p.handle,
      url: p.url,
      verified: p.verified || false,
      metrics: {
        followers: p.followers,
        engagement: p.engagement,
        contentQuality: p.contentQuality,
        consistency: p.consistency,
        longevity: p.longevity,
        influenceScore: p.influenceScore,
        rawData: p.rawData || {}
      },
      lastUpdated: p.lastUpdated || new Date()
    }));

    // Convert score history
    const scoreHistory = dbProfile.scoreHistory.map((h: any) => ({
      date: h.date,
      credibility: h.credibilityScore,
      longevity: h.longevityScore,
      engagement: h.engagementScore,
      overall: h.overallScore
    }));

    // Create PublicFigure object
    return {
      id: dbProfile.id,
      name: dbProfile.name,
      profession: dbProfile.profession,
      image: dbProfile.image,
      biography: dbProfile.biography,
      location: dbProfile.location,
      organization: dbProfile.organization,
      platforms,
      overallScore: {
        credibility: dbProfile.credibilityScore,
        longevity: dbProfile.longevityScore,
        engagement: dbProfile.engagementScore,
        overall: dbProfile.overallScore,
        lastCalculated: dbProfile.lastCalculated || new Date(),
        history: scoreHistory
      },
      createdAt: dbProfile.createdAt,
      updatedAt: dbProfile.updatedAt,
      metadata: dbProfile.metadata || {}
    };
  }

  /**
   * Convert PublicFigure to ProfileWithMetrics
   */
  private convertToProfileWithMetrics(
    figure: PublicFigure,
    trendAnalysis: any,
    longevityAnalysis: any,
    trendDirection: 'up' | 'down' | 'stable'
  ): ProfileWithMetrics {
    // Convert platforms
    const platforms = figure.platforms.map(p => ({
      id: p.id || `platform_${p.platform}_${p.handle}`,
      figureId: figure.id,
      platform: p.platform,
      handle: p.handle,
      url: p.url,
      verified: p.verified,
      followers: p.metrics.followers,
      engagement: p.metrics.engagement,
      contentQuality: p.metrics.contentQuality,
      consistency: p.metrics.consistency,
      longevity: p.metrics.longevity,
      influenceScore: p.metrics.influenceScore,
      lastUpdated: p.lastUpdated
    }));

    // Convert score history
    const scoreHistory = figure.overallScore.history.map((h, index) => ({
      id: `history_${figure.id}_${index}`,
      figureId: figure.id,
      date: h.date,
      overallScore: h.overall,
      credibilityScore: h.credibility,
      longevityScore: h.longevity,
      engagementScore: h.engagement
    }));

    // Create ProfileWithMetrics
    return {
      id: figure.id,
      name: figure.name,
      image: figure.image || '',
      profession: figure.profession,
      biography: figure.biography,
      location: figure.location,
      organization: figure.organization,
      overallScore: figure.overallScore.overall,
      credibilityScore: figure.overallScore.credibility,
      longevityScore: figure.overallScore.longevity,
      engagementScore: figure.overallScore.engagement,
      trendingScore: trendAnalysis.trendingScore,
      trendDirection,
      careerLongevity: longevityAnalysis.careerLongevity,
      createdAt: figure.createdAt,
      updatedAt: figure.updatedAt,
      platforms,
      scoreHistory,
      googleData: figure.metadata?.googleData,
      metadata: figure.metadata
    };
  }

  /**
   * Convert ProfileWithMetrics back to PublicFigure
   */
  private convertProfileWithMetricsToPublicFigure(profile: ProfileWithMetrics): PublicFigure {
    // Convert platforms
    const platforms: PlatformPresence[] = profile.platforms.map(p => ({
      platform: p.platform as SupportedPlatform,
      handle: p.handle,
      url: p.url,
      verified: p.verified || false,
      metrics: {
        followers: p.followers,
        engagement: p.engagement,
        contentQuality: p.contentQuality,
        consistency: p.consistency,
        longevity: p.longevity,
        influenceScore: p.influenceScore,
        rawData: {}
      },
      lastUpdated: p.lastUpdated || new Date()
    }));

    // Convert score history
    const scoreHistory = profile.scoreHistory.map(h => ({
      date: new Date(h.date),
      credibility: h.credibilityScore,
      longevity: h.longevityScore,
      engagement: h.engagementScore,
      overall: h.overallScore
    }));

    // Create PublicFigure object
    return {
      id: profile.id,
      name: profile.name,
      profession: profile.profession,
      image: profile.image,
      biography: profile.biography,
      location: profile.location,
      organization: profile.organization,
      platforms,
      overallScore: {
        credibility: profile.credibilityScore,
        longevity: profile.longevityScore,
        engagement: profile.engagementScore,
        overall: profile.overallScore,
        lastCalculated: new Date(),
        history: scoreHistory
      },
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      metadata: profile.metadata || {}
    };
  }

  /**
   * Save profile to database
   */
  private async saveProfileToDatabase(figure: PublicFigure): Promise<any> {
    try {
      // Save the main figure record
      const dbProfile = await prisma.publicFigure.upsert({
        where: { id: figure.id },
        update: {
          name: figure.name,
          profession: figure.profession,
          image: figure.image,
          biography: figure.biography,
          location: figure.location,
          organization: figure.organization,
          overallScore: figure.overallScore.overall,
          credibilityScore: figure.overallScore.credibility,
          longevityScore: figure.overallScore.longevity,
          engagementScore: figure.overallScore.engagement,
          lastCalculated: figure.overallScore.lastCalculated,
          updatedAt: new Date(),
          metadata: figure.metadata || {}
        },
        create: {
          id: figure.id,
          name: figure.name,
          profession: figure.profession,
          image: figure.image || '',
          biography: figure.biography,
          location: figure.location,
          organization: figure.organization,
          overallScore: figure.overallScore.overall,
          credibilityScore: figure.overallScore.credibility,
          longevityScore: figure.overallScore.longevity,
          engagementScore: figure.overallScore.engagement,
          lastCalculated: figure.overallScore.lastCalculated,
          createdAt: figure.createdAt,
          updatedAt: new Date(),
          metadata: figure.metadata || {}
        }
      });

      // Save platforms
      for (const platform of figure.platforms) {
        await prisma.platform.upsert({
          where: {
            figureId_platform: {
              figureId: figure.id,
              platform: platform.platform
            }
          },
          update: {
            handle: platform.handle,
            url: platform.url,
            verified: platform.verified,
            followers: platform.metrics.followers,
            engagement: platform.metrics.engagement,
            contentQuality: platform.metrics.contentQuality,
            consistency: platform.metrics.consistency,
            longevity: platform.metrics.longevity,
            influenceScore: platform.metrics.influenceScore,
            rawData: platform.metrics.rawData || {},
            lastUpdated: platform.lastUpdated
          },
          create: {
            figureId: figure.id,
            platform: platform.platform,
            handle: platform.handle,
            url: platform.url,
            verified: platform.verified,
            followers: platform.metrics.followers,
            engagement: platform.metrics.engagement,
            contentQuality: platform.metrics.contentQuality,
            consistency: platform.metrics.consistency,
            longevity: platform.metrics.longevity,
            influenceScore: platform.metrics.influenceScore,
            rawData: platform.metrics.rawData || {},
            lastUpdated: platform.lastUpdated
          }
        });
      }
      if (figure.overallScore.history.length > 0) {
        const latestHistory = figure.overallScore.history[figure.overallScore.history.length - 1];
        
        await prisma.scoreHistory.create({
          data: {
            figureId: figure.id,
            date: latestHistory.date,
            overallScore: latestHistory.overall,
            credibilityScore: latestHistory.credibility,
            longevityScore: latestHistory.longevity,
            engagementScore: latestHistory.engagement
          }
        });
      }

      return dbProfile;
    } catch (error) {
      console.error('Error saving profile to database:', error);
      throw error;
    }
  }

  /**
   * Determine trend direction based on score history
   */
  private determineTrendDirection(figure: PublicFigure): 'up' | 'down' | 'stable' {
    const history = figure.overallScore.history;
    
    if (history.length < 2) {
      return 'stable';
    }

    // Sort history by date (newest first)
    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Compare the most recent two scores
    const latestScore = sortedHistory[0].overall;
    const previousScore = sortedHistory[1].overall;
    
    // Calculate percentage change
    const percentChange = ((latestScore - previousScore) / previousScore) * 100;
    
    // Determine direction based on percentage change
    if (percentChange >= 2) {
      return 'up';
    } else if (percentChange <= -2) {
      return 'down';
    } else {
      return 'stable';
    }
  }

  /**
   * Reconstruct previous state from history
   */
  private reconstructPreviousState(figure: PublicFigure): PublicFigure {
    // Create a deep copy
    const previousState = JSON.parse(JSON.stringify(figure)) as PublicFigure;
    
    // Sort history by date (newest first)
    const sortedHistory = [...figure.overallScore.history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    if (sortedHistory.length < 2) {
      return previousState;
    }
    
    // Use the second most recent score entry
    const previousScore = sortedHistory[1];
    
    // Update the overall score with previous values
    previousState.overallScore = {
      ...previousState.overallScore,
      overall: previousScore.overall,
      credibility: previousScore.credibility,
      longevity: previousScore.longevity,
      engagement: previousScore.engagement,
      lastCalculated: previousScore.date
    };
    
    return previousState;
  }

  /**
   * Get top rated figures by category
   */
  async getTopRatedFigures(
    category?: string,
    limit: number = 10,
    sortBy: 'overall' | 'credibility' | 'longevity' | 'engagement' = 'overall'
  ): Promise<ProfileWithMetrics[]> {
    try {
      // Build the query
      const where: any = {};
      
      if (category) {
        where.profession = {
          has: category
        };
      }

      // Determine the sort field
      const sortField = sortBy === 'overall' 
        ? 'overallScore' 
        : `${sortBy}Score`;

      // Fetch profiles from database
      const dbProfiles = await prisma.publicFigure.findMany({
        where,
        include: {
          platforms: true,
          scoreHistory: {
            orderBy: { date: 'desc' },
            take: 1
          }
        },
        orderBy: {
          [sortField]: 'desc'
        },
        take: limit
      });

      // Process each profile
      const profilePromises = dbProfiles.map(async (dbProfile) => {
        const figure = this.convertDbProfileToPublicFigure(dbProfile);
        const trendDirection = this.determineTrendDirection(figure);
        
        const trendAnalysis = figure.metadata?.trendAnalysis || {
          trendingScore: 0,
          sentimentScore: 50,
          recentEvents: [],
          contextualRelevance: 50
        };
        
        const longevityAnalysis = figure.metadata?.longevityAnalysis || {
          careerLongevity: 0,
          relevanceSustainability: 50,
          consistencyScore: 50,
          longevityScore: figure.overallScore.longevity
        };

        return this.convertToProfileWithMetrics(
          figure,
          trendAnalysis,
          longevityAnalysis,
          trendDirection
        );
      });

      return Promise.all(profilePromises);
    } catch (error) {
      console.error('Error getting top rated figures:', error);
      throw error;
    }
  }

  /**
   * Get recent news and events for a profile
   */
  async getProfileNews(id: string, limit: number = 5): Promise<{
    title: string;
    source: string;
    url: string;
    publishedAt: string;
    summary: string;
  }[]> {
    try {
      // Get profile
      const profile = await this.getProfileById(id);
      
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Check if we have recent events in metadata
      if (profile.metadata?.trendAnalysis?.recentEvents) {
        return profile.metadata.trendAnalysis.recentEvents.slice(0, limit);
      }

      // If not, fetch fresh news data
      const figure = this.convertProfileWithMetricsToPublicFigure(profile);
      const trendAnalysis = await this.trendAnalysisService.analyzeTrends(figure);
      
      // Update metadata with new trend analysis
      figure.metadata = {
        ...figure.metadata,
        trendAnalysis
      };
      
      // Save updated metadata
      await prisma.publicFigure.update({
        where: { id: figure.id },
        data: {
          metadata: figure.metadata
        }
      });

      return trendAnalysis.recentEvents.slice(0, limit);
    } catch (error) {
      console.error('Error getting profile news:', error);
      throw error;
    }
  }

  /**
   * Get platform-specific metrics for a profile
   */
  async getPlatformMetrics(id: string, platform: SupportedPlatform): Promise<{
    followers: number;
    engagement: number;
    contentQuality: number;
    consistency: number;
    longevity: number;
    influenceScore: number;
    postsPerWeek?: number;
    averageLikes?: number;
    averageComments?: number;
    topContent?: any[];
  }> {
    try {
      // Get profile
      const profile = await this.getProfileById(id);
      
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Find the requested platform
      const platformData = profile.platforms.find(p => p.platform === platform);
      
      if (!platformData) {
        throw new Error(`Platform ${platform} not found for this profile`);
      }

      // Get raw data from the platform
      const rawData = await this.apiIntegrationService.fetchPlatformData(
        platform as SupportedPlatform,
        platformData.handle
      );

      // Process the raw data to get detailed metrics
      const metrics = this.metricsProcessorService.processPlatformData(
        platform as SupportedPlatform,
        rawData
      );

      // Extract additional platform-specific metrics
      let postsPerWeek, averageLikes, averageComments, topContent;
      
      if (platform === SupportedPlatform.INSTAGRAM || platform === SupportedPlatform.TWITTER) {
        // Calculate posts per week
        postsPerWeek = this.calculatePostsPerWeek(rawData);
        
        // Calculate average engagement metrics
        averageLikes = this.calculateAverageLikes(rawData);
        averageComments = this.calculateAverageComments(rawData);
        
        // Get top performing content
        topContent = this.getTopContent(rawData);
      }

      return {
        followers: metrics.followers || 0,
        engagement: metrics.engagement || 0,
        contentQuality: metrics.contentQuality || 0,
        consistency: metrics.consistency || 0,
        longevity: metrics.longevity || 0,
        influenceScore: metrics.influenceScore || 0,
        postsPerWeek,
        averageLikes,
        averageComments,
        topContent
      };
    } catch (error) {
      console.error('Error getting platform metrics:', error);
      throw error;
    }
  }

  // Additional helper methods for platform-specific metrics
  
  private calculatePostsPerWeek(rawData: any): number {
    // Implementation would depend on the structure of rawData
    // This is a placeholder
    return 0;
  }
  
  private calculateAverageLikes(rawData: any): number {
    // Implementation would depend on the structure of rawData
    // This is a placeholder
    return 0;
  }
  
  private calculateAverageComments(rawData: any): number {
    // Implementation would depend on the structure of rawData
    // This is a placeholder
    return 0;
  }
  
  private getTopContent(rawData: any): any[] {
    // Implementation would depend on the structure of rawData
    // This is a placeholder
    return [];
  }
}
