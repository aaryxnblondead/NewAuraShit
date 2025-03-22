import { PublicFigure, PlatformPresence } from '../types';

export class LongevityAnalysisService {
  /**
   * Analyzes the longevity and sustained relevance of a public figure
   */
  analyzeLongevity(figure: PublicFigure): {
    careerLongevity: number;
    relevanceSustainability: number;
    consistencyScore: number;
    longevityScore: number;
  } {
    // Calculate career longevity (how long they've been active)
    const careerLongevity = this.calculateCareerLongevity(figure);
    
    // Calculate relevance sustainability (how well they've maintained relevance)
    const relevanceSustainability = this.calculateRelevanceSustainability(figure);
    
    // Calculate consistency score (how consistent their presence has been)
    const consistencyScore = this.calculateConsistencyScore(figure);
    
    // Calculate overall longevity score
    const longevityScore = this.calculateOverallLongevityScore(
      careerLongevity, 
      relevanceSustainability, 
      consistencyScore
    );
    
    return {
      careerLongevity,
      relevanceSustainability,
      consistencyScore,
      longevityScore
    };
  }
  
  private calculateCareerLongevity(figure: PublicFigure): number {
    // Find the oldest account/presence
    const platformAges = figure.platforms
      .map(platform => platform.metrics.longevity || 0)
      .filter(age => age > 0);
    
    if (platformAges.length === 0) return 0;
    
    const maxAge = Math.max(...platformAges);
    
    // Normalize to 0-100 scale (10 years = 3650 days is considered maximum)
    return Math.min(100, (maxAge / 3650) * 100);
  }
  
  private calculateRelevanceSustainability(figure: PublicFigure): number {
    // Check if we have historical score data
    if (!figure.overallScore || !figure.overallScore.history || figure.overallScore.history.length < 2) {
      return 50; // Default score if not enough history
    }
    
    const history = figure.overallScore.history;
    
    // Calculate standard deviation of overall scores over time
    // Lower standard deviation means more consistent relevance
    const avgScore = history.reduce((sum, entry) => sum + entry.overall, 0) / history.length;
    const variance = history.reduce((sum, entry) => sum + Math.pow(entry.overall - avgScore, 2), 0) / history.length;
    const stdDev = Math.sqrt(variance);
    
    // Normalize: lower standard deviation = higher sustainability score
    // Max expected stdDev is 25 (on a 0-100 scale)
    const normalizedStdDev = Math.min(25, stdDev);
    
    // Convert to 0-100 scale (inverted, since lower stdDev is better)
    return 100 - ((normalizedStdDev / 25) * 100);
  }
  
  private calculateConsistencyScore(figure: PublicFigure): number {
    // Calculate consistency based on platform activity patterns
    const consistencyScores = figure.platforms
      .map(platform => platform.metrics.consistency || 0)
      .filter(score => score > 0);
    
    if (consistencyScores.length === 0) return 50; // Default if no data
    
    // Average consistency across platforms
    return consistencyScores.reduce((sum, score) => sum + score, 0) / consistencyScores.length;
  }
  
  private calculateOverallLongevityScore(
    careerLongevity: number,
    relevanceSustainability: number,
    consistencyScore: number
  ): number {
    // Weighted average of factors
    return (careerLongevity * 0.4) + (relevanceSustainability * 0.4) + (consistencyScore * 0.2);
  }
}
