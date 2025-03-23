import { db } from '@/lib/schema';
import { publicFigures, platformData, scoreHistory, CreateFigureInput } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import * as apiIntegration from './api-integration';
import { calculateScores } from 'src\rating-system\services\score-calculator.service.ts';
import { google } from 'googleapis';

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

interface InstagramData {
  is_verified: boolean;
  followers_count: number;
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

const people = google.people('v1');

function measureGitHubConsistency(data: GitHubData): number {
  return 50; // Placeholder implementation
}

function assessGitHubContentQuality(data: GitHubData): number {
  return 50; // Placeholder implementation
}

function calculateGitHubEngagement(data: GitHubData): number {
  return 50; // Placeholder implementation
}

function calculateYouTubeInfluence(statistics: YouTubeStatistics): number {
  return 50; // Placeholder implementation
}

function calculateYouTubeLongevity(publishedAt: string): number {
  return 365; // Placeholder implementation
}

function calculateYouTubeEngagement(statistics: YouTubeStatistics): number {
  return 50; // Placeholder implementation
}

function calculateInstagramEngagement(data: InstagramData): number {
  return 50; // Placeholder implementation
}

function calculateTwitterInfluence(metrics: TwitterMetrics): number {
  return 50; // Placeholder implementation
}

function calculateAccountAge(createdAt: string): number {
  return 365; // Placeholder implementation
}

function measureTwitterPostConsistency(data: TwitterData): number {
  return 50; // Placeholder implementation
}

function assessTwitterContentQuality(data: TwitterData): number {
  return 50; // Placeholder implementation
}

function calculateTwitterEngagement(metrics: TwitterMetrics): number {
  return 50; // Placeholder implementation
}

async function getGooglePeopleData(name: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      key: 'AIzaSyDjWEV2YyIESmkDVdOZJVGov9YDp7gJD1Q',
      scopes: ['https://www.googleapis.com/auth/contacts.readonly']
    });

    const response = await people.people.searchDirectoryPeople({
      auth,
      query: name,
      readMask: 'names,emailAddresses,photos,organizations,locations,biographies,urls,skills',
      sources: ['DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE']
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Google People data:', error);
    return null;
  }
}

export async function getTopProfiles(limit = 10) {
  const profiles = await db.query.publicFigures.findMany({
    orderBy: [desc(publicFigures.overallScore)],
    limit,
    with: {
      platforms: true
    }
  });

  // Enrich with Google People data
  for (const profile of profiles) {
    const googleData = await getGooglePeopleData(profile.name);
    if (googleData && googleData.people && googleData.people.length > 0) {
      const person = googleData.people[0];
      profile.googleData = {
        organizations: person.organizations || [],
        locations: person.locations || [],
        biography: person.biographies?.[0]?.value || '',
        skills: person.skills || [],
        urls: person.urls || []
      };
    }
  }

  return profiles;
}

export async function getProfileById(id: string) {
  const profile = await db.query.publicFigures.findFirst({
    where: eq(publicFigures.id, id),
    with: {
      platforms: true,
      scoreHistory: {
        orderBy: [desc(scoreHistory.date)],
        limit: 10
      }
    }
  });

  if (profile) {
    const googleData = await getGooglePeopleData(profile.name);
    if (googleData && googleData.people && googleData.people.length > 0) {
      const person = googleData.people[0];
      profile.googleData = {
        organizations: person.organizations || [],
        locations: person.locations || [],
        biography: person.biographies?.[0]?.value || '',
        skills: person.skills || [],
        urls: person.urls || []
      };
    }
  }

  return profile;
}

export async function searchProfiles(query: string, limit = 20) {
  const profiles = await db.query.publicFigures.findMany({
    where: (publicFigures) => {
      return eq(publicFigures.name, `%${query}%`);
    },
    orderBy: [desc(publicFigures.overallScore)],
    limit,
  });

  // Enrich with Google People data
  for (const profile of profiles) {
    const googleData = await getGooglePeopleData(profile.name);
    if (googleData && googleData.people && googleData.people.length > 0) {
      const person = googleData.people[0];
      profile.googleData = {
        organizations: person.organizations || [],
        locations: person.locations || [],
        biography: person.biographies?.[0]?.value || '',
        skills: person.skills || [],
        urls: person.urls || []
      };
    }
  }

  return profiles;
}

export async function createProfile(input: CreateFigureInput) {
  return db.transaction(async (tx: any) => {
    // Get Google People data first
    const googleData = await getGooglePeopleData(input.name);
    let additionalData = {};
    
    if (googleData && googleData.people && googleData.people.length > 0) {
      const person = googleData.people[0];
      additionalData = {
        biography: person.biographies?.[0]?.value,
        location: person.locations?.[0]?.value,
        organization: person.organizations?.[0]?.name,
      };
    }

    const [figure] = await tx.insert(publicFigures).values({
      name: input.name,
      image: input.image || '/placeholder.svg',
      profession: input.profession,
      ...additionalData
    }).returning();
    
    for (const platform of input.platforms) {
      await tx.insert(platformData).values({
        figureId: figure.id,
        platform: platform.platform,
        handle: platform.handle,
        url: platform.url,
      });
    }
    
    return figure;
  });
}

export async function updateProfileData(id: string) {
  const profile = await db.query.publicFigures.findFirst({
    where: eq(publicFigures.id, id),
    with: {
      platforms: true
    }
  });
  
  if (!profile) {
    throw new Error(`Profile with ID ${id} not found`);
  }
  
  // Update Google People data
  const googleData = await getGooglePeopleData(profile.name);
  if (googleData && googleData.people && googleData.people.length > 0) {
    const person = googleData.people[0];
    await db.update(publicFigures)
      .set({
        biography: person.biographies?.[0]?.value,
        location: person.locations?.[0]?.value,
        organization: person.organizations?.[0]?.name,
      })
      .where(eq(publicFigures.id, id));
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
      case 'instagram':
        const instagramData = await apiIntegration.fetchInstagramData(platform.handle);
        if (instagramData) {
          platformMetrics = processInstagramData(instagramData);
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
      await db.update(platformData)
        .set({
          ...platformMetrics,
          lastUpdated: new Date()
        })
        .where(eq(platformData.id, platform.id));
      
      updatedPlatformData.push({
        ...platform,
        ...platformMetrics
      });
    } else {
      updatedPlatformData.push(platform);
    }
  }
  
  const newScores = calculateScores(profile, updatedPlatformData);
  
  await db.update(publicFigures)
    .set({
      overallScore: newScores.overall,
      credibilityScore: newScores.credibility,
      longevityScore: newScores.longevity,
      engagementScore: newScores.engagement,
      trendingScore: newScores.trending,
      trendDirection: newScores.trendDirection,
      careerLongevity: newScores.careerLongevity,
      updatedAt: new Date()
    })
    .where(eq(publicFigures.id, id));
  
  await db.insert(scoreHistory).values({
    figureId: id,
    overallScore: newScores.overall,
    credibilityScore: newScores.credibility,
    longevityScore: newScores.longevity,
    engagementScore: newScores.engagement,
  });
  
  return getProfileById(id);
}

function processTwitterData(data: TwitterData) {
  const user = data.data;
  const metrics = user.public_metrics;
  
  return {
    verified: user.verified || false,
    followers: metrics.followers_count || 0,
    engagement: calculateTwitterEngagement(metrics),
    contentQuality: assessTwitterContentQuality(data),
    consistency: measureTwitterPostConsistency(data),
    longevity: calculateAccountAge(user.created_at),
    influenceScore: calculateTwitterInfluence(metrics),
  };
}

function processInstagramData(data: InstagramData) {
  return {
    verified: data.is_verified || false,
    followers: data.followers_count || 0,
    engagement: calculateInstagramEngagement(data),
    contentQuality: 50,
    consistency: 50,
    longevity: 365,
    influenceScore: 50,
  };
}

function processYouTubeData(data: YouTubeData) {
  const channel = data.items[0];
  const statistics = channel.statistics;
  
  return {
    verified: channel.snippet.isVerified || false,
    followers: parseInt(statistics.subscriberCount) || 0,
    engagement: calculateYouTubeEngagement(statistics),
    contentQuality: 50,
    consistency: 50,
    longevity: calculateYouTubeLongevity(channel.snippet.publishedAt),
    influenceScore: calculateYouTubeInfluence(statistics),
  };
}

function processGitHubData(data: GitHubData) {
  return {
    verified: false,
    followers: data.followers || 0,
    engagement: calculateGitHubEngagement(data),
    contentQuality: assessGitHubContentQuality(data),
    consistency: measureGitHubConsistency(data),
    longevity: calculateAccountAge(data.created_at),
    influenceScore: data.public_repos || 0,
  };
}