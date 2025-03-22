import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { 
  MongoClient, 
  Collection 
} from 'mongodb';

// Define the schema for public figures
export const publicFigures = {
  id: String,
  name: String,
  image: String,
  profession: String,
  overallScore: Number,
  credibilityScore: Number,
  longevityScore: Number,
  engagementScore: Number,
  trendingScore: Number,
  trendDirection: String,
  careerLongevity: Number,
  createdAt: Date,
  updatedAt: Date
};

// Define the schema for platform data
export const platformData = {
  id: String,
  figureId: String,
  platform: String,
  handle: String,
  url: String,
  verified: Boolean,
  followers: Number,
  engagement: Number,
  contentQuality: Number,
  consistency: Number,
  longevity: Number,
  influenceScore: Number,
  lastUpdated: Date
};

// Define the schema for score history
export const scoreHistory = {
  id: String,
  figureId: String,
  date: Date,
  overallScore: Number,
  credibilityScore: Number,
  longevityScore: Number,
  engagementScore: Number
};

// Define validation schemas
export const createFigureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
  profession: z.string().min(1, "Profession is required"),
  platforms: z.array(z.object({
    platform: z.string().min(1, "Platform is required"),
    handle: z.string().min(1, "Handle is required"),
    url: z.string().url("Must be a valid URL"),
  })).min(1, "At least one platform is required"),
});

export type CreateFigureInput = z.infer<typeof createFigureSchema>;
export type PublicFigure = typeof publicFigures;
export type PlatformData = typeof platformData;
export type ScoreHistory = typeof scoreHistory;