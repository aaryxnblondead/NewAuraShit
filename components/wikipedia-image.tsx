"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { fetchWikipediaImage } from "@/lib/api-services"

interface WikipediaImageProps {
  name: string
  fallbackSrc: string
  width: number
  height: number
  className?: string
  alt?: string
}

export default function WikipediaImage({
  name,
  fallbackSrc,
  width,
  height,
  className = "",
  alt = "",
}: WikipediaImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true)
        const wikiImage = await fetchWikipediaImage(name)
        if (wikiImage) {
          setImageSrc(wikiImage)
        }
      } catch (error) {
        console.error("Error loading Wikipedia image:", error)
      } finally {
        setLoading(false)
      }
    }

    loadImage()
  }, [name])

  return (
    <div className={`relative ${className}`}>
      {loading && <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg"></div>}
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt || name}
        width={width}
        height={height}
        className={`${className} ${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onError={() => setImageSrc(fallbackSrc)}
      />
    </div>
  )
}

