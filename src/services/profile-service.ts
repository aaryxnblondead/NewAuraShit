import { 
  publicFigures, 
  platformData, 
  scoreHistory, 
  createFigureSchema, 
  CreateFigureInput, 
  PublicFigure, 
  PlatformData, 
  ScoreHistory 
} from '../lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import * as apiIntegration from './api-integration';
import { ScoreCalculatorService } from '../rating-system/services/score-calculator.service';
import { google } from 'googleapis';
import { LongevityAnalysisService } from '../rating-system/services/longevity-analysis.service';
import { TrendAnalysisService } from '../rating-system/services/trend-analysis.service';

const TWITTER_API_KEY = 'HNy7Uy2xIYh8cokV2vYassk7V';
const GOOGLE_API_KEY = 'AIzaSyDjWEV2YyIESmkDVdOZJVGov9YDp7gJD1Q';
const GITHUB_API_KEY = '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';
const GOOGLE_TRENDS_API_KEY = GOOGLE_API_KEY;
const GOOGLE_NEWS_API_KEY = GOOGLE_API_KEY;

interface TwitterMetrics {
  followers_count: number;
}

interface TwitterUser {
  verified: boolean;
  public_metrics: TwitterMetrics;
  created_at: string;
}

interface TwitterData {
  data: TwitterUser;
}

interface YouTubeStatistics {
  subscriberCount: string;
}

interface YouTubeChannel {
  snippet: {
    isVerified: boolean;
    publishedAt: string;
  };
  statistics: YouTubeStatistics;
}

interface YouTubeData {
  items: YouTubeChannel[];
}

interface GitHubData {
  followers: number;
  created_at: string;
  public_repos: number;
}

interface Score {
  overall: number;
  credibility: number;
  longevity: number;
  engagement: number;
}

const people = google.people({ version: 'v1', auth: GOOGLE_API_KEY });
const longevityAnalyzer = new LongevityAnalysisService();
const scoreCalculator = new ScoreCalculatorService();
const trendAnalysisService = new TrendAnalysisService(GOOGLE_TRENDS_API_KEY, GOOGLE_NEWS_API_KEY);

function processTwitterData(data: TwitterData) {
  return {
    followers: data.data.public_metrics.followers_count,
    verified: data.data.verified,
    createdAt: new Date(data.data.created_at)
  };
}

function processYouTubeData(data: YouTubeData) {
  const channel = data.items[0];
  return {
    subscribers: parseInt(channel.statistics.subscriberCount),
    verified: channel.snippet.isVerified,
    createdAt: new Date(channel.snippet.publishedAt)
  };
}

function processGitHubData(data: GitHubData) {
  return {
    followers: data.followers,
    repositories: data.public_repos,
    createdAt: new Date(data.created_at)
  };
}

async function getGooglePeopleData(name: string) {
  try {
    const response = await people.people.searchDirectoryPeople({
      query: name,
      readMask: 'names,biographies,locations,organizations',
      sources: ['DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE']
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Google People data:', error);
    return null;
  }
}

export async function updateProfileData(id: string) {
  const profile = {
    id: id,
    name: "Example User",
    profession: ["Example Profession"],
    platforms: [
      { 
        id: "1", 
        platform: "twitter", 
        handle: "@example",
        verified: false,
        metrics: { 
          rawData: {},
          longevity: 0,
          engagement: 0,
          contentQuality: 0,
          consistency: 0,
          influenceScore: 0
        },
        lastUpdated: new Date()
      },
      { 
        id: "3", 
        platform: "youtube", 
        handle: "example",
        verified: false,
        metrics: { 
          rawData: {},
          longevity: 0,
          engagement: 0,
          contentQuality: 0,
          consistency: 0,
          influenceScore: 0
        },
        lastUpdated: new Date()
      },
      { 
        id: "4", 
        platform: "github", 
        handle: "example",
        verified: false,
        metrics: { 
          rawData: {},
          longevity: 0,
          engagement: 0,
          contentQuality: 0,
          consistency: 0,
          influenceScore: 0
        },
        lastUpdated: new Date()
      }
    ],
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
  
  if (!profile) {
    throw new Error(`Profile with ID ${id} not found`);
  }
  
  let biography = '';
  let location = '';
  let organization = '';

  const googleData = await getGooglePeopleData(profile.name);
  if (googleData && googleData.people && googleData.people.length > 0) {
    const person = googleData.people[0];
    biography = person.biographies?.[0]?.value || '';
    location = person.locations?.[0]?.value || '';
    organization = person.organizations?.[0]?.name || '';
  }
  
  const updatedPlatformData = [];
  
  for (const platform of profile.platforms) {
    let platformMetrics = null;
    
    switch (platform.platform) {
      case 'twitter':
        const twitterData = await apiIntegration.fetchTwitterData(platform.handle);
        if (twitterData) {
          platformMetrics = processTwitterData(twitterData);
        }
        break;
      case 'youtube':
        const youtubeData = await apiIntegration.fetchYouTubeData(platform.handle);
        if (youtubeData) {
          platformMetrics = processYouTubeData(youtubeData);
        }
        break;
      case 'github':
        const githubData = await apiIntegration.fetchGitHubData(platform.handle);
        if (githubData) {
          platformMetrics = processGitHubData(githubData);
        }
        break;
    }
          if (platformMetrics) {
            const updatedPlatform = {
              ...platform,
              url: `https://${platform.platform}.com/${platform.handle}`,
              verified: 'verified' in platformMetrics ? platformMetrics.verified : false,
              metrics: {
                ...platform.metrics,
                longevity: platformMetrics.createdAt ? 
                  Math.floor((new Date().getTime() - platformMetrics.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0,
                engagement: platform.platform === 'twitter' ? ('followers' in platformMetrics ? platformMetrics.followers * 0.01 : 0) : 
                     platform.platform === 'youtube' ? ('subscribers' in platformMetrics ? platformMetrics.subscribers * 0.005 : 0) : 
                     ('followers' in platformMetrics ? platformMetrics.followers * 0.02 : 0),
                rawData: platformMetrics
              },
              lastUpdated: new Date()
            };
            updatedPlatformData.push(updatedPlatform);
          } else {
            updatedPlatformData.push({
              ...platform,
              url: `https://${platform.platform}.com/${platform.handle}`
            });
          }
        }
  
        // Update the profile with the new platform data
        profile.platforms = updatedPlatformData;
        // Calculate scores using the rating system services
      // Calculate new scores based on updated profile data
      const newScores = scoreCalculator.calculateScores(profile);
      const longevityAnalysis = longevityAnalyzer.analyzeLongevity(profile);
  
      // Get trend analysis using updated profile data
      const trendAnalysis = await trendAnalysisService.analyzeTrends(profile);  
        // Calculate career longevity in years, ensuring valid numbers
        const careerLongevityInYears = Math.max(
          0,
          ...profile.platforms
            .filter(p => p.metrics && typeof p.metrics.longevity === 'number')
            .map(p => p.metrics.longevity / 365)
        );
  
        // Determine trend direction
        let trendDirection: 'up' | 'down' | 'stable' = 'stable';
        if (trendAnalysis.trendingScore > 55) trendDirection = 'up';
        else if (trendAnalysis.trendingScore < 45) trendDirection = 'down';
  
        const updatedProfile = {
          ...profile,
          biography,
          location,
          organization,
          overallScore: newScores,
          credibilityScore: newScores.credibility,
          longevityScore: longevityAnalysis.longevityScore,
          engagementScore: newScores.engagement,
          trendingScore: trendAnalysis.trendingScore,
          trendDirection: trendDirection,
          careerLongevity: careerLongevityInYears,
          lastUpdated: new Date(),
          platforms: updatedPlatformData
        };
  const newScoreHistory = {
    figureId: id,
    overallScore: newScores.overall,
    credibilityScore: newScores.credibility,
    longevityScore: longevityAnalysis.longevityScore,
    engagementScore: newScores.engagement,
    createdAt: new Date()
  };
  
  return updatedProfile;
}