export interface PublicFigure {
  id: string;
  name: string;
  profession: string[];
  platforms: PlatformPresence[];
  overallScore: Score;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformPresence {
  platform: SupportedPlatform;
  handle: string;
  url: string;
  verified: boolean;
  metrics: PlatformMetrics;
  lastUpdated: Date;
}

export enum SupportedPlatform {
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  YOUTUBE = 'youtube',
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
  HACKER_NEWS = 'hacker_news',
  SPOTIFY = 'spotify',
  BILLBOARD = 'billboard',
  LETTERBOXD = 'letterboxd',
  IMDB = 'imdb',
  TWITCH = 'twitch',
  KICK = 'kick',
  REDDIT = 'reddit',
  GOOGLE_TRENDS = 'google_trends',
  GOOGLE_NEWS = 'google_news'
}

export interface PlatformMetrics {
  followers?: number;
  engagement?: number;
  contentQuality?: number;
  consistency?: number;
  longevity?: number; // in days
  influenceScore?: number;
  rawData: any; // Platform-specific raw data
}

export interface Score {
  credibility: number; // 0-100
  longevity: number; // 0-100
  engagement: number; // 0-100
  overall: number; // 0-100
  lastCalculated: Date;
  history: ScoreHistory[];
}

export interface ScoreHistory {
  date: Date;
  credibility: number;
  longevity: number;
  engagement: number;
  overall: number;
}
