import { PublicFigure, PlatformPresence, Score, ScoreHistory } from '../types';

export class ScoreCalculatorService {
  calculateScores(figure: PublicFigure): Score {
    // Calculate individual scores
    const credibilityScore = this.calculateCredibilityScore(figure);
    const longevityScore = this.calculateLongevityScore(figure);
    const engagementScore = this.calculateEngagementScore(figure);
    
    // Calculate overall score (weighted average)
    const overall = this.calculateOverallScore(credibilityScore, longevityScore, engagementScore);
    
    // Create new score history entry
    const newScoreEntry: ScoreHistory = {
      date: new Date(),
      credibility: credibilityScore,
      longevity: longevityScore,
      engagement: engagementScore,
      overall
    };
    
    // Update score history
    const history = figure.overallScore?.history || [];
    history.push(newScoreEntry);
    
    // Return updated score object
    return {
      credibility: credibilityScore,
      longevity: longevityScore,
      engagement: engagementScore,
      overall,
      lastCalculated: new Date(),
      history
    };
  }
  
  private calculateCredibilityScore(figure: PublicFigure): number {
    // Factors that contribute to credibility:
    // 1. Verification status across platforms
    // 2. Content quality scores
    // 3. Professional achievements
    // 4. Consistency of messaging
    // 5. External citations/references
    
    let verificationScore = this.calculateVerificationScore(figure.platforms);
    let contentQualityScore = this.calculateContentQualityScore(figure.platforms);
    let consistencyScore = this.calculateConsistencyScore(figure.platforms);
    
    // Weighted average of credibility factors
    return (verificationScore * 0.3) + (contentQualityScore * 0.4) + (consistencyScore * 0.3);
  }
  
  private calculateLongevityScore(figure: PublicFigure): number {
    // Factors that contribute to longevity:
    // 1. Account age across platforms
    // 2. Consistency of activity over time
    // 3. Sustained relevance (not just flash-in-the-pan)
    
    const platformLongevities = figure.platforms.map(platform => platform.metrics.longevity || 0);
    
    if (platformLongevities.length === 0) return 0;
    
    // Calculate weighted average based on platform importance
    const totalLongevity = platformLongevities.reduce((sum, longevity) => sum + longevity, 0);
    const avgLongevity = totalLongevity / platformLongevities.length;
    
    // Normalize to 0-100 scale (max longevity considered is 10 years = 3650 days)
    return Math.min(100, (avgLongevity / 3650) * 100);
  }
  
  private calculateEngagementScore(figure: PublicFigure): number {
    // Factors that contribute to engagement:
    // 1. Engagement rates across platforms
    // 2. Quality of engagement (not just quantity)
    // 3. Influence and impact metrics
    
    const platformEngagements = figure.platforms.map(platform => platform.metrics.engagement || 0);
    const platformInfluences = figure.platforms.map(platform => platform.metrics.influenceScore || 0);
    
    if (platformEngagements.length === 0) return 0;
    
    // Calculate weighted average
    const avgEngagement = platformEngagements.reduce((sum, eng) => sum + eng, 0) / platformEngagements.length;
    const avgInfluence = platformInfluences.reduce((sum, inf) => sum + inf, 0) / platformInfluences.length;
    
    // Combine engagement and influence (weighted)
    return (avgEngagement * 0.6) + (avgInfluence * 0.4);
  }
  
  private calculateOverallScore(credibility: number, longevity: number, engagement: number): number {
    // Weighted average of all scores
    // Credibility is weighted highest as it's most important for our system
    return (credibility * 0.5) + (longevity * 0.3) + (engagement * 0.2);
  }
  
  private calculateVerificationScore(platforms: PlatformPresence[]): number {
    if (platforms.length === 0) return 0;
    
    const verifiedCount = platforms.filter(p => p.verified).length;
    return (verifiedCount / platforms.length) * 100;
  }
  
  private calculateContentQualityScore(platforms: PlatformPresence[]): number {
    const qualityScores = platforms
      .map(p => p.metrics.contentQuality)
      .filter(score => score !== undefined) as number[];
      
    if (qualityScores.length === 0) return 0;
    
    return qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
  }
  
  private calculateConsistencyScore(platforms: PlatformPresence[]): number {
    const consistencyScores = platforms
      .map(p => p.metrics.consistency)
      .filter(score => score !== undefined) as number[];
      
    if (consistencyScores.length === 0) return 0;
    
    return consistencyScores.reduce((sum, score) => sum + score, 0) / consistencyScores.length;
  }
}
