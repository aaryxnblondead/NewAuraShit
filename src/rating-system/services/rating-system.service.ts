import { PublicFigure, PlatformPresence, SupportedPlatform } from '../types';
import { ApiIntegrationService } from './api-integration.service';
import { MetricsProcessorService } from './metrics-processor.service';
import { ScoreCalculatorService } from './score-calculator.service';
import { AntiManipulationService } from './anti-manipulation.service';
import { TrendAnalysisService } from './trend-analysis.service';
import { LongevityAnalysisService } from './longevity-analysis.service';

export class RatingSystemService {
  private apiIntegrationService: ApiIntegrationService;
  private metricsProcessorService: MetricsProcessorService;
  private scoreCalculatorService: ScoreCalculatorService;
  private antiManipulationService: AntiManipulationService;
  private trendAnalysisService: TrendAnalysisService;
  private longevityAnalysisService: LongevityAnalysisService;
  
  constructor(
    apiKeys: Record<SupportedPlatform, string>,
    googleTrendsApiKey: string,
    googleNewsApiKey: string
  ) {
    this.apiIntegrationService = new ApiIntegrationService(apiKeys);
    this.metricsProcessorService = new MetricsProcessorService();
    this.scoreCalculatorService = new ScoreCalculatorService();
    this.antiManipulationService = new AntiManipulationService();
    this.trendAnalysisService = new TrendAnalysisService(googleTrendsApiKey, googleNewsApiKey);
    this.longevityAnalysisService = new LongevityAnalysisService();
  }
  
  /**
   * Evaluates or updates a public figure's rating
   */
  async evaluateFigure(figure: PublicFigure): Promise<PublicFigure> {
    // Store the previous state for comparison
    const previousState = JSON.parse(JSON.stringify(figure));
    
    // 1. Fetch latest data from all platforms
    const updatedFigure = await this.fetchLatestData(figure);
    
    // 2. Calculate base scores
    updatedFigure.overallScore = this.scoreCalculatorService.calculateScores(updatedFigure);
    
    // 3. Detect potential manipulation
    const manipulationData = this.antiManipulationService.detectManipulation(updatedFigure, previousState);
    
    // 4. Adjust scores if manipulation detected
    let adjustedFigure = updatedFigure;
    if (manipulationData.isManipulated) {
      adjustedFigure = this.antiManipulationService.adjustScoresForManipulation(
        updatedFigure, 
        manipulationData
      );
    }
    
    // 5. Analyze trends and current relevance
    const trendAnalysis = await this.trendAnalysisService.analyzeTrends(adjustedFigure);
    
    // 6. Adjust scores based on trends
    adjustedFigure = this.trendAnalysisService.adjustScoresBasedOnTrends(
      adjustedFigure,
      trendAnalysis
    );
    
    // 7. Analyze longevity
    const longevityAnalysis = this.longevityAnalysisService.analyzeLongevity(adjustedFigure);
    
    // 8. Update longevity score
    adjustedFigure.overallScore.longevity = longevityAnalysis.longevityScore;
    
    // 9. Recalculate overall score
    adjustedFigure.overallScore.overall = (
      adjustedFigure.overallScore.credibility * 0.5 + 
      adjustedFigure.overallScore.longevity * 0.3 + 
      adjustedFigure.overallScore.engagement * 0.2
    );
    
    // 10. Update timestamps
    adjustedFigure.updatedAt = new Date();
    
    return adjustedFigure;
  }
  
  /**
   * Creates a new public figure profile
   */
  async createFigure(name: string, profession: string[], platforms: {
    platform: SupportedPlatform;
    handle: string;
    url: string;
  }[]): Promise<PublicFigure> {
    // Create basic figure object
    const figure: PublicFigure = {
      id: this.generateId(),
      name,
      profession,
      platforms: platforms.map(p => ({
        ...p,
        verified: false,
        metrics: { rawData: {} },
        lastUpdated: new Date()
      })),
      overallScore: {
        credibility: 50,
        longevity: 50,
        engagement: 50,
        overall: 50,
        lastCalculated: new Date(),
        history: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Evaluate the figure to populate all metrics and scores
    return this.evaluateFigure(figure);
  }
  
  /**
   * Fetches latest data for all platforms
   */
  private async fetchLatestData(figure: PublicFigure): Promise<PublicFigure> {
    const updatedFigure = { ...figure, platforms: [...figure.platforms] };
    
    // Fetch data for each platform in parallel
    const platformPromises = updatedFigure.platforms.map(async (platform, index) => {
      try {
        // Fetch raw data from API
        const rawData = await this.apiIntegrationService.fetchPlatformData(
          platform.platform,
          platform.handle
        );
        
        // Process raw data into metrics
        const metrics = this.metricsProcessorService.processPlatformData(
          platform.platform,
          rawData
        );
        
        // Update platform with new metrics
        updatedFigure.platforms[index] = {
          ...platform,
          metrics,
          lastUpdated: new Date()
        };
        
        // Check if verification status has changed
        if (rawData.verified !== undefined) {
          updatedFigure.platforms[index].verified = rawData.verified;
        }
      } catch (error) {
        console.error(`Error updating data for ${platform.platform}:`, error);
        // Keep existing data if fetch fails
      }
    });
    
    // Wait for all platform updates to complete
    await Promise.all(platformPromises);
    
    return updatedFigure;
  }
  
  /**
   * Generates a unique ID for a new figure
   */
  private generateId(): string {
    return 'fig_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }
  
  /**
   * Gets top rated figures based on specified criteria
   */
  async getTopRatedFigures(
    category?: string,
    limit: number = 10,
    sortBy: 'overall' | 'credibility' | 'longevity' | 'engagement' = 'overall'
  ): Promise<PublicFigure[]> {
    // This would typically fetch from a database
    // For demonstration, we'll return a mock implementation
    
    // In a real implementation, this would query the database with:
    // - Filter by category/profession if specified
    // - Sort by the specified score type
    // - Limit to the specified number of results
    
    return []; // Placeholder
  }
  
  /**
   * Searches for public figures by name or other criteria
   */
  async searchFigures(
    query: string,
    filters?: {
      profession?: string[];
      minScore?: number;
      platform?: SupportedPlatform;
    }
  ): Promise<PublicFigure[]> {
    // This would typically search in a database
    // For demonstration, we'll return a mock implementation
    
    return []; // Placeholder
  }
}