import { PublicFigure } from '../types';
import axios from 'axios';

export class TrendAnalysisService {
  private readonly googleTrendsApiKey: string;
  private readonly googleNewsApiKey: string;
  
  constructor(googleTrendsApiKey: string, googleNewsApiKey: string) {
    this.googleTrendsApiKey = googleTrendsApiKey;
    this.googleNewsApiKey = googleNewsApiKey;
  }
  
  /**
   * Analyzes current trends related to a public figure
   */
  async analyzeTrends(figure: PublicFigure): Promise<{
    trendingScore: number;
    sentimentScore: number;
    recentEvents: any[];
    contextualRelevance: number;
  }> {
    // Fetch Google Trends data
    const trendsData = await this.fetchGoogleTrendsData(figure.name);
    
    // Fetch recent news
    const newsData = await this.fetchGoogleNewsData(figure.name);
    
    // Calculate trending score based on search interest
    const trendingScore = this.calculateTrendingScore(trendsData);
    
    // Analyze sentiment from news and social media
    const sentimentScore = this.analyzeSentiment(newsData);
    
    // Extract significant recent events
    const recentEvents = this.extractSignificantEvents(newsData);
    
    // Calculate contextual relevance (how relevant the figure is to current events)
    const contextualRelevance = this.calculateContextualRelevance(figure, trendsData, newsData);
    
    return {
      trendingScore,
      sentimentScore,
      recentEvents,
      contextualRelevance
    };
  }
  
  /**
   * Adjusts figure scores based on trend analysis
   */
  adjustScoresBasedOnTrends(figure: PublicFigure & { metadata?: Record<string, any> }, trendAnalysis: {
    trendingScore: number;
    sentimentScore: number;
    recentEvents: any[];
    contextualRelevance: number;
  }): PublicFigure & { metadata?: Record<string, any> } {
    // Create a deep copy to avoid mutating the original
    const adjustedFigure = JSON.parse(JSON.stringify(figure)) as PublicFigure & { metadata?: Record<string, any> };
    
    // Adjust engagement score based on trending score
    // But don't let short-term trends completely override long-term metrics
    const trendingAdjustment = (trendAnalysis.trendingScore - 50) / 200; // Range: -0.25 to +0.25
    adjustedFigure.overallScore.engagement = Math.min(100, Math.max(0, 
      adjustedFigure.overallScore.engagement * (1 + trendingAdjustment)
    ));
    
    // Adjust credibility based on sentiment
    // Negative sentiment might indicate controversies affecting credibility
    const sentimentAdjustment = (trendAnalysis.sentimentScore - 50) / 400; // Range: -0.125 to +0.125
    adjustedFigure.overallScore.credibility = Math.min(100, Math.max(0, 
      adjustedFigure.overallScore.credibility * (1 + sentimentAdjustment)
    ));
    
    // Contextual relevance can slightly boost overall score
    const relevanceBoost = trendAnalysis.contextualRelevance / 500; // Max 0.2 boost for high relevance
    adjustedFigure.overallScore.overall = Math.min(100, 
      adjustedFigure.overallScore.overall * (1 + relevanceBoost)
    );
    
    // Recalculate overall score
    adjustedFigure.overallScore.overall = (
      adjustedFigure.overallScore.credibility * 0.5 + 
      adjustedFigure.overallScore.longevity * 0.3 + 
      adjustedFigure.overallScore.engagement * 0.2
    );
    
    // Add trend data to metadata
    if (!adjustedFigure.metadata) {
      adjustedFigure.metadata = {};
    }
    adjustedFigure.metadata.trendAnalysis = {
      date: new Date(),
      trendingScore: trendAnalysis.trendingScore,
      sentimentScore: trendAnalysis.sentimentScore,
      recentEvents: trendAnalysis.recentEvents.map(e => e.title),
      contextualRelevance: trendAnalysis.contextualRelevance
    };
    
    return adjustedFigure;
  }
  
  private async fetchGoogleTrendsData(query: string): Promise<any> {
    try {
      // This would use the Google Trends API in a real implementation
      // Using a simplified mock response for demonstration
      return {
        interestOverTime: {
          timelineData: [
            { time: '2023-01', value: [75] },
            { time: '2023-02', value: [82] },
            { time: '2023-03', value: [68] }
          ]
        },
        relatedQueries: {
          rankedList: [
            { query: 'recent news about ' + query, value: 100 },
            { query: query + ' controversy', value: 75 },
            { query: query + ' achievements', value: 50 }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching Google Trends data:', error);
      return null;
    }
  }
  
  private async fetchGoogleNewsData(query: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${this.googleNewsApiKey}&sortBy=publishedAt&language=en`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching Google News data:', error);
      return { articles: [] };
    }
  }

private calculateTrendingScore(trendsData: any): number {
    if (!trendsData || !trendsData.interestOverTime) return 50; // Default neutral score
    
    // Calculate average interest over the last period
    const recentInterest = trendsData.interestOverTime.timelineData
      .slice(-3) // Last 3 time periods
      .reduce((sum: number, item: any) => sum + item.value[0], 0) / 3;
    
    // Compare with previous periods to determine if trending up or down
    const olderInterest = trendsData.interestOverTime.timelineData
      .slice(-6, -3) // 3 periods before the last 3
      .reduce((sum: number, item: any) => sum + item.value[0], 0) / 3;
    
    // Calculate trending score (50 is neutral, >50 is trending up, <50 is trending down)
    const trendingScore = 50 + (recentInterest - olderInterest);
    
    // Normalize to 0-100 range
    return Math.min(100, Math.max(0, trendingScore));
  }
  
  private analyzeSentiment(newsData: any): number {
    if (!newsData || !newsData.articles || newsData.articles.length === 0) {
      return 50; // Neutral sentiment if no data
    }
    
    // In a real implementation, this would use a sentiment analysis API or library
    // For demonstration, we'll use a simplified approach
    
    // Keywords that might indicate positive sentiment
    const positiveKeywords = ['success', 'achievement', 'award', 'positive', 'breakthrough', 'innovation'];
    
    // Keywords that might indicate negative sentiment
    const negativeKeywords = ['controversy', 'scandal', 'criticism', 'negative', 'problem', 'issue', 'fail'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    // Count occurrences of positive and negative keywords in article titles and descriptions
    for (const article of newsData.articles) {
      const text = (article.title + ' ' + (article.description || '')).toLowerCase();
      
      for (const keyword of positiveKeywords) {
        if (text.includes(keyword)) positiveCount++;
      }
      
      for (const keyword of negativeKeywords) {
        if (text.includes(keyword)) negativeCount++;
      }
    }
    
    // Calculate sentiment score (50 is neutral)
    const totalMentions = positiveCount + negativeCount;
    if (totalMentions === 0) return 50;
    
    const sentimentScore = 50 + ((positiveCount - negativeCount) / totalMentions) * 50;
    
    // Normalize to 0-100 range
    return Math.min(100, Math.max(0, sentimentScore));
  }
  
  private extractSignificantEvents(newsData: any): any[] {
    if (!newsData || !newsData.articles) return [];
    
    // Sort articles by relevance (assuming the API returns relevance score)
    const sortedArticles = [...newsData.articles].sort((a, b) => {
      // If no relevance score is available, sort by recency
      if (!a.relevanceScore && !b.relevanceScore) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return (b.relevanceScore || 0) - (a.relevanceScore || 0);
    });
    
    // Return top 5 most significant events
    return sortedArticles.slice(0, 5).map(article => ({
      title: article.title,
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt,
      summary: article.description
    }));
  }
  
  private calculateContextualRelevance(figure: PublicFigure, trendsData: any, newsData: any): number {
    // Calculate how relevant the figure is to current events and trends
    
    // Factors to consider:
    // 1. Volume of recent news
    const newsVolume = newsData?.articles?.length || 0;
    const newsScore = Math.min(100, newsVolume * 5); // 20 articles would give max score
    
    // 2. Trend intensity
    let trendScore = 50;
    if (trendsData && trendsData.interestOverTime) {
      const recentValues = trendsData.interestOverTime.timelineData.slice(-3).map((item: any) => item.value[0]);
      trendScore = recentValues.reduce((sum: number, val: number) => sum + val, 0) / recentValues.length;
    }
    
    // 3. Related queries relevance
    let queryRelevance = 0;
    if (trendsData && trendsData.relatedQueries) {
      queryRelevance = Math.min(100, trendsData.relatedQueries.rankedList.length * 10);
    }
    
    // Weighted average of factors
    return (newsScore * 0.5) + (trendScore * 0.3) + (queryRelevance * 0.2);
  }
}