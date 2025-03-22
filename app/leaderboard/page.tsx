"use client"

import { useState, useEffect } from "react"
import { getTopProfiles, type Profile } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { ArrowUp, ArrowDown, Minus, Star } from "lucide-react"

export default function LeaderboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly" | "allTime">("weekly")

  useEffect(() => {
    // Simulating API fetch with different data based on filter
    setLoading(true)
    setTimeout(() => {
      // In a real app, you would fetch different data based on the timeFilter
      const topProfiles = getTopProfiles(20)

      // Simulate rank changes for weekly/monthly views
      const enrichedProfiles = topProfiles.map((profile, index) => {
        return {
          ...profile,
          prevRank: Math.max(
            1,
            index + 1 + (Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : -Math.floor(Math.random() * 5)),
          ),
        }
      })

      setProfiles(enrichedProfiles as any)
      setLoading(false)
    }, 800)
  }, [timeFilter])

  // Helper function to render rank change indicator
  const renderRankChange = (current: number, previous: number) => {
    const diff = previous - current // Positive means improved rank

    if (diff > 0) {
      return (
        <div className="flex items-center text-green-500">
          <ArrowUp size={14} className="mr-1" />
          {diff}
        </div>
      )
    } else if (diff < 0) {
      return (
        <div className="flex items-center text-red-500">
          <ArrowDown size={14} className="mr-1" />
          {Math.abs(diff)}
        </div>
      )
    } else {
      return (
        <div className="flex items-center text-gray-400">
          <Minus size={14} className="mr-1" />0
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">InfluenceIQ Leaderboard</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover the top-ranked public figures based on credibility, longevity, and engagement scores.
        </p>
      </div>

      {/* Time Filter */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-800 rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeFilter === "weekly" ? "bg-accent text-white" : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setTimeFilter("weekly")}
          >
            This Week
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeFilter === "monthly" ? "bg-accent text-white" : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setTimeFilter("monthly")}
          >
            This Month
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeFilter === "allTime" ? "bg-accent text-white" : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setTimeFilter("allTime")}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-800 font-medium text-sm uppercase tracking-wider">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-5 md:col-span-4">Name</div>
          <div className="col-span-2 text-center hidden md:block">Industry</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-4 md:col-span-3 text-center">Change</div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {profiles.map((profile: any, index) => (
              <div key={profile.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800/50 transition-colors">
                <div className="col-span-1 flex justify-center items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index < 3 ? "bg-accent text-white" : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
                <div className="col-span-5 md:col-span-4 flex items-center">
                  <Image
                    src={profile.image || "/placeholder.svg"}
                    alt={profile.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <Link href={`/profile/${profile.id}`} className="font-bold hover:text-accent transition-colors">
                      {profile.name}
                    </Link>
                    <p className="text-sm text-gray-400">{profile.profession}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-center hidden md:flex">
                  <span className="text-sm text-gray-300">{profile.industry || "General"}</span>
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span className="font-bold">{profile.score.overall.toFixed(1)}</span>
                  </div>
                </div>
                <div className="col-span-4 md:col-span-3 flex items-center justify-center">
                  {timeFilter !== "allTime" && renderRankChange(index + 1, profile.prevRank)}
                  {timeFilter === "allTime" && <span className="text-gray-400">-</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

