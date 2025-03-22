"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { fetchTwitterTweets } from "@/lib/api-services"
import { Heart, Repeat, Calendar } from "lucide-react"

interface TwitterFeedProps {
  username: string
  count?: number
}

export default function TwitterFeed({ username, count = 5 }: TwitterFeedProps) {
  const [tweets, setTweets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadTweets = async () => {
      try {
        setLoading(true)
        const fetchedTweets = await fetchTwitterTweets(username, count)
        setTweets(fetchedTweets)
        setError("")
      } catch (err) {
        setError("Failed to load tweets")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadTweets()
  }, [username, count])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded w-24 animate-pulse"></div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4 pb-4 border-b border-gray-800">
            <div className="h-4 bg-gray-800 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <h3 className="font-bold">Recent Tweets</h3>
        <a
          href={`https://twitter.com/${username.toLowerCase().replace(/\s/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent text-sm hover:underline"
        >
          @{username.toLowerCase().replace(/\s/g, "")}
        </a>
      </div>

      <div className="divide-y divide-gray-800">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="p-4">
            <div className="flex items-start mb-2">
              <Image
                src={tweet.user.profile_image_url || "/placeholder.svg"}
                alt={tweet.user.name}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div>
                <div className="flex items-center">
                  <span className="font-bold">{tweet.user.name}</span>
                  <span className="text-gray-400 text-sm ml-2">@{tweet.user.screen_name}</span>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <Calendar size={12} className="mr-1" />
                  <span>{formatDate(tweet.created_at)}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-3">{tweet.text}</p>

            <div className="flex items-center text-gray-400 text-sm">
              <div className="flex items-center mr-4">
                <Heart size={14} className="mr-1" />
                <span>{tweet.favorite_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <Repeat size={14} className="mr-1" />
                <span>{tweet.retweet_count.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

