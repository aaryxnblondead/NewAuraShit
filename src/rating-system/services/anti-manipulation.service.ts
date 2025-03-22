import { PublicFigure, PlatformPresence } from '../types';

export interface PublicFigureWithMetadata extends PublicFigure {
  metadata?: {
    manipulationFlags?: string[];
    manipulationScore?: number;
  };
}

export class AntiManipulationService {
  // Threshold for suspicious activity detection
  private readonly FOLLOWER_GROWTH_THRESHOLD = 20; // 20% growth in a day is suspicious
  private readonly ENGAGEMENT_SPIKE_THRESHOLD = 300; // 300% spike in engagement is suspicious
  private readonly BOT_ENGAGEMENT_PATTERN_THRESHOLD = 0.85; // 85% similarity to known bot patterns
  
  /**
   * Detects potential manipulation in a public figure's metrics
   * @returns An object containing manipulation flags and confidence scores
   */
  detectManipulation(figure: PublicFigure, previousData?: PublicFigure): {
    isManipulated: boolean;
    confidenceScore: number;
    flags: string[];
  } {
    const flags: string[] = [];
    let manipulationScore = 0;
    
    // Check for suspicious follower growth
    const followerGrowthFlag = this.checkFollowerGrowth(figure, previousData);
    if (followerGrowthFlag) {
      flags.push(followerGrowthFlag);
      manipulationScore += 25;
    }
    
    // Check for engagement anomalies
    const engagementFlags = this.checkEngagementAnomalies(figure, previousData);
    flags.push(...engagementFlags);
    manipulationScore += engagementFlags.length * 15;
    
    // Check for bot-like engagement patterns
    const botPatternFlags = this.checkBotPatterns(figure);
    flags.push(...botPatternFlags);
    manipulationScore += botPatternFlags.length * 20;
    
    // Check for cross-platform inconsistencies
    const inconsistencyFlags = this.checkCrossPlatformInconsistencies(figure);
    flags.push(...inconsistencyFlags);
    manipulationScore += inconsistencyFlags.length * 10;
    
    // Normalize manipulation score to 0-100
    const normalizedScore = Math.min(100, manipulationScore);
    
    return {
      isManipulated: normalizedScore > 50,
      confidenceScore: normalizedScore,
      flags
    };
  }
  
  /**
   * Applies anti-manipulation adjustments to scores
   */
  adjustScoresForManipulation(figure: PublicFigure, manipulationData: {
    isManipulated: boolean;
    confidenceScore: number;
    flags: string[];
  }): PublicFigureWithMetadata {
    if (!manipulationData.isManipulated) {
      return figure as PublicFigureWithMetadata;
    }
    
    // Create a deep copy to avoid mutating the original
    const adjustedFigure = JSON.parse(JSON.stringify(figure)) as PublicFigureWithMetadata;
    
    // Apply penalty to overall score based on manipulation confidence
    const penaltyFactor = manipulationData.confidenceScore / 100;
    adjustedFigure.overallScore.credibility *= (1 - (penaltyFactor * 0.5));
    adjustedFigure.overallScore.engagement *= (1 - (penaltyFactor * 0.7));
    adjustedFigure.overallScore.overall *= (1 - (penaltyFactor * 0.6));
    
    // Add manipulation flags to the figure metadata
    if (!adjustedFigure.metadata) {
      adjustedFigure.metadata = {};
    }
    adjustedFigure.metadata.manipulationFlags = manipulationData.flags;
    adjustedFigure.metadata.manipulationScore = manipulationData.confidenceScore;
    
    return adjustedFigure;
  }
  
  private checkFollowerGrowth(figure: PublicFigure, previousData?: PublicFigure): string | null {
    if (!previousData) return null;
    
    for (let i = 0; i < figure.platforms.length; i++) {
      const currentPlatform = figure.platforms[i];
      const previousPlatform = previousData.platforms.find(p => 
        p.platform === currentPlatform.platform && p.handle === currentPlatform.handle
      );
      
      if (!previousPlatform || !currentPlatform.metrics.followers || !previousPlatform.metrics.followers) {
        continue;
      }
      
      const growthRate = ((currentPlatform.metrics.followers - previousPlatform.metrics.followers) / 
                          previousPlatform.metrics.followers) * 100;
      
      if (growthRate > this.FOLLOWER_GROWTH_THRESHOLD) {
        return `Suspicious follower growth of ${growthRate.toFixed(2)}% on ${currentPlatform.platform}`;
      }
    }
    
    return null;
  }
  
  private checkEngagementAnomalies(figure: PublicFigure, previousData?: PublicFigure): string[] {
    const flags: string[] = [];
    
    // Check for engagement spikes compared to previous data
    if (previousData) {
      for (let i = 0; i < figure.platforms.length; i++) {
        const currentPlatform = figure.platforms[i];
        const previousPlatform = previousData.platforms.find(p => 
          p.platform === currentPlatform.platform && p.handle === currentPlatform.handle
        );
        
        if (!previousPlatform || !currentPlatform.metrics.engagement || !previousPlatform.metrics.engagement) {
          continue;
        }
        
        const engagementGrowth = ((currentPlatform.metrics.engagement - previousPlatform.metrics.engagement) / 
                                 previousPlatform.metrics.engagement) * 100;
        
        if (engagementGrowth > this.ENGAGEMENT_SPIKE_THRESHOLD) {
          flags.push(`Abnormal engagement spike of ${engagementGrowth.toFixed(2)}% on ${currentPlatform.platform}`);
        }
      }
    }
    
    // Check for engagement-to-follower ratio anomalies
    for (const platform of figure.platforms) {
      if (!platform.metrics.engagement || !platform.metrics.followers) continue;
      
      const engagementRatio = platform.metrics.engagement / platform.metrics.followers;
      
      // Extremely high engagement rates can be suspicious
      if (engagementRatio > 0.5) { // More than 50% of followers engaging is unusual
        flags.push(`Suspiciously high engagement-to-follower ratio (${(engagementRatio * 100).toFixed(2)}%) on ${platform.platform}`);
      }
    }
    
    return flags;
  }
  
  private checkBotPatterns(figure: PublicFigure): string[] {
    const flags: string[] = [];
    
    // This would involve more complex pattern recognition
    // For example, analyzing comment patterns, timing of engagements, etc.
    // Simplified implementation for demonstration:
    
    for (const platform of figure.platforms) {
      if (platform.metrics.rawData) {
        // Check for repetitive engagement patterns
        if (this.detectRepetitivePatterns(platform.metrics.rawData)) {
          flags.push(`Bot-like engagement patterns detected on ${platform.platform}`);
        }
        
        // Check for unusual timing patterns (e.g., consistent 24/7 activity)
        if (this.detectUnusualTimingPatterns(platform.metrics.rawData)) {
          flags.push(`Unusual activity timing patterns on ${platform.platform}`);
        }
      }
    }
    
    return flags;
  }
  
  private checkCrossPlatformInconsistencies(figure: PublicFigure): string[] {
    const flags: string[] = [];
    
    // Check for major inconsistencies across platforms
    // E.g., very high engagement on one platform but almost none on others
    
    if (figure.platforms.length < 2) return flags;
    
    const engagementScores = figure.platforms
      .filter(p => p.metrics.engagement !== undefined)
      .map(p => ({ platform: p.platform, engagement: p.metrics.engagement as number }));
    
    if (engagementScores.length < 2) return flags;
    
    // Calculate standard deviation of engagement across platforms
    const avgEngagement = engagementScores.reduce((sum, p) => sum + p.engagement, 0) / engagementScores.length;
    const variance = engagementScores.reduce((sum, p) => sum + Math.pow(p.engagement - avgEngagement, 2), 0) / engagementScores.length;
    const stdDev = Math.sqrt(variance);
    
    // High standard deviation indicates inconsistent engagement across platforms
    if (stdDev > avgEngagement * 2) {
      flags.push(`Significant engagement inconsistencies across platforms`);
    }
    
    return flags;
  }
  
  private detectRepetitivePatterns(rawData: any): boolean {
    // Simplified implementation - would use more sophisticated pattern recognition in production
    return false;
  }
  
  private detectUnusualTimingPatterns(rawData: any): boolean {
    // Simplified implementation - would analyze posting/engagement timestamps in production
    return false;
  }
}