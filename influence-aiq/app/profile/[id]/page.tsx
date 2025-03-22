"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getProfileById, type Profile } from "@/lib/data"
import { Star, ThumbsUp, ThumbsDown, Calendar, Users, BarChart3 } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// Import the TwitterFeed component
import TwitterFeed from "@/components/twitter-feed"
import WikipediaImage from "@/components/wikipedia-image"

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewVotes, setReviewVotes] = useState<Record<string, "up" | "down" | null>>({})

  useEffect(() => {
    // Simulate API fetch
    const fetchProfile = () => {
      setLoading(true)
      setTimeout(() => {
        const foundProfile = getProfileById(params.id)
        setProfile(foundProfile || null)
        setLoading(false)
      }, 500)
    }

    fetchProfile()
  }, [params.id])

  const handleVote = (reviewId: string, voteType: "up" | "down") => {
    setReviewVotes((prev) => {
      // If already voted the same way, remove vote
      if (prev[reviewId] === voteType) {
        const newVotes = { ...prev }
        delete newVotes[reviewId]
        return newVotes
      }

      // Otherwise set the vote
      return { ...prev, [reviewId]: voteType }
    })

    // In a real app, you would send this to the server
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

  if (!profile) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The profile you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  const scoreData = [
    { name: "Credibility", value: profile.score.credibility, fill: "#f59e0b" },
    { name: "Longevity", value: profile.score.longevity, fill: "#3b82f6" },
    { name: "Engagement", value: profile.score.engagement, fill: "#10b981" },
  ]

  const activityData = profile.recentActivity.map((activity) => ({
    date: new Date(activity.date).toLocaleDateString(),
    engagement: Math.random() * 100, // Simulated data
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
                <span className="text-2xl font-bold">{profile.score.overall.toFixed(1)}</span>
                <span className="text-gray-400 ml-1">/10</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-accent font-medium">{profile.profession}</span>
            </div>

            <p className="text-gray-300 mb-6">{profile.bio}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <Calendar size={20} className="text-accent mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Active Since</p>
                  <p className="font-medium">2010</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <Users size={20} className="text-accent mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Followers</p>
                  <p className="font-medium">{profile.socialStats.followers.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center">
                <BarChart3 size={20} className="text-accent mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Engagement Rate</p>
                  <p className="font-medium">{profile.socialStats.engagement}%</p>
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
                      credibility: profile.score.credibility,
                      longevity: profile.score.longevity,
                      engagement: profile.score.engagement,
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

      {/* Recent Activity */}
      <section className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {profile.recentActivity.map((activity) => (
              <div key={activity.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      {activity.platform && ` • ${activity.platform}`}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{new Date(activity.date).toLocaleDateString()}</span>
                </div>

                <h3 className="font-bold mb-2">{activity.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{activity.content}</p>

                {activity.image && (
                  <div className="mt-3">
                    <Image
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.title}
                      width={500}
                      height={300}
                      className="rounded-lg w-full h-auto"
                    />
                  </div>
                )}

                {activity.link && (
                  <a
                    href={activity.link}
                    className="text-accent hover:underline text-sm inline-block mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read more
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="h-80">
            <ChartContainer
              config={{
                engagement: {
                  label: "Engagement",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="engagement" stroke="var(--color-engagement)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </section>

      {profile.twitterHandle && (
        <section className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6">Twitter Feed</h2>
          <TwitterFeed username={profile.name} count={5} />
        </section>
      )}

      {/* Reviews Section */}
      <section className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Reviews</h2>
          <a
            href={`/review/${profile.id}`}
            className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Write a Review
          </a>
        </div>

        <div className="space-y-6">
          {profile.reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Image
                    src={review.userImage || "/placeholder.svg"}
                    alt={review.userName}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{review.userName}</h4>
                    <span className="text-sm text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center bg-gray-700 rounded-full px-2 py-1">
                  <Star size={14} className="text-yellow-500 mr-1" />
                  <span className="font-medium">{review.rating}/10</span>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{review.comment}</p>

              <div className="flex items-center space-x-4">
                <button
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                    reviewVotes[review.id] === "up"
                      ? "bg-green-900/50 text-green-400"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => handleVote(review.id, "up")}
                >
                  <ThumbsUp size={14} />
                  <span>{review.upvotes + (reviewVotes[review.id] === "up" ? 1 : 0)}</span>
                </button>

                <button
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                    reviewVotes[review.id] === "down"
                      ? "bg-red-900/50 text-red-400"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => handleVote(review.id, "down")}
                >
                  <ThumbsDown size={14} />
                  <span>{review.downvotes + (reviewVotes[review.id] === "down" ? 1 : 0)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

