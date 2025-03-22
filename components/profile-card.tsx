import Image from "next/image"
import Link from "next/link"
import { Star, TrendingUp, Clock, Shield, Users } from "lucide-react"

interface ProfileCardProps {
  id: string
  name: string
  image: string
  profession: string
  score: number
  rank?: number
  trending?: boolean
  // New rating system properties
  credibilityScore?: number
  longevityScore?: number
  engagementScore?: number
  trendingScore?: number
  trendDirection?: 'up' | 'down' | 'stable'
  careerLongevity?: number // in years
  lastUpdated?: Date
}

export default function ProfileCard({ 
  id, 
  name, 
  image, 
  profession, 
  score, 
  rank, 
  trending,
  credibilityScore = 0,
  longevityScore = 0,
  engagementScore = 0,
  trendingScore = 0,
  trendDirection = 'stable',
  careerLongevity = 0,
  lastUpdated
}: ProfileCardProps) {
  
  // Format scores to one decimal place
  const formatScore = (score: number) => score.toFixed(1)
  
  // Determine trend color
  const getTrendColor = () => {
    if (trendDirection === 'up') return 'text-green-500'
    if (trendDirection === 'down') return 'text-red-500'
    return 'text-gray-400'
  }
  
  return (
    <Link href={`/profile/${id}`}>
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 card-hover">
        <div className="relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={400}
            height={400}
            className="w-full h-48 object-cover"
          />

          {rank && (
            <div className="absolute top-2 left-2 bg-gray-900/80 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {rank}
            </div>
          )}

          {trending && (
            <div className="absolute top-2 right-2 bg-accent/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <TrendingUp size={12} className="mr-1" />
              Trending
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-2 gradient-overlay">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold truncate">{name}</h3>
              <div className="flex items-center bg-gray-900/80 rounded-full px-2 py-1">
                <Star size={14} className="text-yellow-500 mr-1" />
                <span className="text-white text-sm font-medium">{formatScore(score)}</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm truncate">{profession}</p>
          </div>
        </div>
        
        {/* Rating System Details Section */}
        <div className="p-3 border-t border-gray-800">
          {/* Rating Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Shield size={12} className="text-blue-400 mr-1" />
                <span className="text-xs text-gray-400">Credibility</span>
              </div>
              <span className="text-white font-medium">{formatScore(credibilityScore)}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Clock size={12} className="text-purple-400 mr-1" />
                <span className="text-xs text-gray-400">Longevity</span>
              </div>
              <span className="text-white font-medium">{formatScore(longevityScore)}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Users size={12} className="text-green-400 mr-1" />
                <span className="text-xs text-gray-400">Engagement</span>
              </div>
              <span className="text-white font-medium">{formatScore(engagementScore)}</span>
            </div>
          </div>
          
          {/* Trend and Longevity Info */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center">
              <TrendingUp size={12} className={`${getTrendColor()} mr-1`} />
              <span className={`${getTrendColor()} font-medium`}>
                {trendingScore > 0 ? `+${trendingScore.toFixed(1)}%` : `${trendingScore.toFixed(1)}%`}
              </span>
            </div>
            
            <div className="text-gray-400">
              {careerLongevity > 0 ? `${careerLongevity} years in industry` : 'New to industry'}
            </div>
          </div>
          
          {/* Last Updated */}
          {lastUpdated && (
            <div className="mt-2 text-xs text-gray-500 text-right">
              Updated: {lastUpdated.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
