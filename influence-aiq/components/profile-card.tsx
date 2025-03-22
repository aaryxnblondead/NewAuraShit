import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

interface ProfileCardProps {
  id: string
  name: string
  image: string
  profession: string
  score: number
  rank?: number
  trending?: boolean
}

export default function ProfileCard({ id, name, image, profession, score, rank, trending }: ProfileCardProps) {
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
            <div className="absolute top-2 right-2 bg-accent/90 text-white text-xs px-2 py-1 rounded-full">
              Trending
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-2 gradient-overlay">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold truncate">{name}</h3>
              <div className="flex items-center bg-gray-900/80 rounded-full px-2 py-1">
                <Star size={14} className="text-yellow-500 mr-1" />
                <span className="text-white text-sm font-medium">{score.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm truncate">{profession}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

