"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Star, ThumbsUp, ThumbsDown, Calendar, Users, BarChart3 } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import WikipediaImage from "@/components/wikipedia-image"

// Define the profile type based on the backend data structure
interface Platform {
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
  lastUpdated?: string;
}

interface ScoreHistoryItem {
  id: string;
  figureId: string;
  date: string;
  overallScore: number;
  credibilityScore: number;
  longevityScore: number;
  engagementScore: number;
}

interface Profile {
  id: string;
  name: string;
  image: string;
  profession: string;
  biography?: string;
  location?: string;
  organization?: string;
  overallScore: number;
  credibilityScore: number;
  longevityScore: number;
  engagementScore: number;
  trendingScore: number;
  trendDirection: string;
  careerLongevity: number;
  createdAt: string;
  updatedAt: string;
  platforms: Platform[];
  scoreHistory: ScoreHistoryItem[];
  googleData?: {
    organizations: any[];
    locations: any[];
    biography: string;
    skills: any[];
    urls: any[];
  };
}

// Mock data for reviews and activity until we implement those endpoints
const mockReviews = [
  {
    id: "1",
    userName: "User 1",
    userImage: "/placeholder.svg",
    date: new Date().toISOString(),
    rating: 8,
    comment: "Great public figure with consistent engagement."
  }
];

const mockActivity = [
  {
    id: "1",
    type: "post",
    platform: "Twitter",
    title: "Recent Tweet",
    content: "This is a sample tweet content",
    date: new Date().toISOString(),
    link: "https://twitter.com"
  }
];

export default function ProfilePage({ params }: { params: { id: string } }) {
  const id = React.use(Promise.resolve(params)).id
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewVotes, setReviewVotes] = useState<Record<string, "up" | "down" | null>>({})

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/profiles/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  useEffect(() => {
    // Load Twitter widget if we have a Twitter platform
    if (profile?.platforms) {
      const twitterPlatform = profile.platforms.find(p => p.platform === 'twitter')
      
      if (twitterPlatform?.handle) {
        const script = document.createElement("script")
        script.src = "https://platform.twitter.com/widgets.js"
        script.setAttribute('data-chrome', 'noheader nofooter noborders transparent')
        script.setAttribute('data-tweet-limit', '5')
        script.async = true
        document.body.appendChild(script)

        return () => {
          document.body.removeChild(script)
        }
      }
    }
  }, [profile?.platforms])
/*************  ✨ Codeium Command ⭐  *************/
/******  42b3e753-487f-4a7a-871a-23b03db4a704  *******/
  const handleVote = (reviewId: string, voteType: "up" | "down") => {
    setReviewVotes((prev) => {
      if (prev[reviewId] === voteType) {
        const newVotes = { ...prev }
/**
 * Updates the vote type for a given review.
 * 
 * If the user has already voted with the same type, the vote is removed.
 * Otherwise, the vote is set to the specified type.
 * 
 * @param reviewId - The ID of the review being voted on.
 * @param voteType - The type of vote, either "up" or "down".
 */

        delete newVotes[reviewId]
        return newVotes
      }
      return { ...prev, [reviewId]: voteType }
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400">{error || "The profile you are looking for does not exist."}</p>
        </div>
      </div>
    )
  }

  // Find Twitter handle if available
  const twitterPlatform = profile.platforms.find(p => p.platform === 'twitter')
  const twitterHandle = twitterPlatform?.handle

  // Calculate total followers across all platforms
  const totalFollowers = profile.platforms.reduce((sum, platform) => sum + (platform.followers || 0), 0)
  
  // Calculate average engagement
  const platformsWithEngagement = profile.platforms.filter(p => p.engagement !== undefined)
  const avgEngagement = platformsWithEngagement.length > 0 
    ? platformsWithEngagement.reduce((sum, p) => sum + (p.engagement || 0), 0) / platformsWithEngagement.length
    : 0

  const scoreData = [
    { name: "Credibility", value: profile.credibilityScore, fill: "#f59e0b" },
    { name: "Longevity", value: profile.longevityScore, fill: "#3b82f6" },
    { name: "Engagement", value: profile.engagementScore, fill: "#10b981" },
  ]

  // Format score history for the chart
  const activityData = profile.scoreHistory.map((history) => ({
    date: new Date(history.date).toLocaleDateString(),
    engagement: history.engagementScore,
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Profile Overview */}
      <section className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <WikipediaImage
              name={profile.name}
              fallbackSrc={profile.image}
              width={400}
              height={400}
              className="rounded-lg w-full h-auto"
              alt={profile.name}
            />
          </div>

          <div className="md:w-2/3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 mt-2 md:mt-0">
                <Star size={20} className="text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">{profile.overallScore.toFixed(1)}</span>
                <span className="text-gray-400 ml-1">/10</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-accent font-medium">{profile.profession}</span>
            </div>

            <p className="text-gray-300 mb-6">{profile.biography || profile.googleData?.biography || "No biography available."}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <Calendar size={20} className="text-accent mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Active Since</p>
                  <p className="font-medium">{new Date(profile.createdAt).getFullYear()}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <Users size={20} className="text-accent mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Followers</p>
                  <p className="font-medium">{totalFollowers.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <BarChart3 size={20} className="text-accent mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Engagement Rate</p>
                  <p className="font-medium">{avgEngagement.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Score Breakdown */}
      <section className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Score Breakdown</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="space-y-6">
              {scoreData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className="font-bold">{item.value.toFixed(1)}/10</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.value * 10}%`,
                        backgroundColor: item.fill,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-80">
            <ChartContainer
              config={{
                credibility: {
                  label: "Credibility",
                  color: "hsl(var(--chart-1))",
                },
                longevity: {
                  label: "Longevity",
                  color: "hsl(var(--chart-2))",
                },
                engagement: {
                  label: "Engagement",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: profile.name,
                      credibility: profile.credibilityScore,
                      longevity: profile.longevityScore,
                      engagement: profile.engagementScore,
                    },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="credibility" fill="var(--color-credibility)" />
                  <Bar dataKey="longevity" fill="var(--color-longevity)" />
                  <Bar dataKey="engagement" fill="var(--color-engagement)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </section>

      {/* Recent Activity - Using Score History */}
      <section className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Score History</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {profile.scoreHistory.map((history) => (
              <div key={history.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      Score Update
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{new Date(history.date).toLocaleDateString()}</span>
                </div>

                <h3 className="font-bold mb-2">Overall Score: {history.overallScore.toFixed(1)}</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Credibility</p>
                    <p className="font-medium">{history.credibilityScore.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Longevity</p>
                    <p className="font-medium">{history.longevityScore.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Engagement</p>
                    <p className="font-medium">{history.engagementScore.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}