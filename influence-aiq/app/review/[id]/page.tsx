"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getProfileById } from "@/lib/data"
import Image from "next/image"
import ProtectedRoute from "@/components/protected-route"

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const profile = getProfileById(params.id)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  if (!profile) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The profile you are trying to review does not exist.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    if (comment.trim().length < 10) {
      setError("Please write a review with at least 10 characters")
      return
    }

    setError("")
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to profile page
      router.push(`/profile/${profile.id}`)
    }, 1500)
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Write a Review</h1>

        <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
          <div className="flex items-center mb-6">
            <Image
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              width={60}
              height={60}
              className="rounded-full mr-4"
            />
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-400">{profile.profession}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-3">Your Rating</label>
              <div className="flex items-center">
                {[...Array(10)].map((_, i) => {
                  const ratingValue = i + 1
                  return (
                    <button
                      type="button"
                      key={ratingValue}
                      className={`w-8 h-8 mr-1 rounded-full flex items-center justify-center ${
                        ratingValue <= (hoverRating || rating)
                          ? "bg-yellow-500 text-gray-900"
                          : "bg-gray-800 text-gray-400"
                      }`}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHoverRating(ratingValue)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {ratingValue}
                    </button>
                  )
                })}
                <span className="ml-3 text-gray-300">{rating > 0 ? `${rating}/10` : "Select a rating"}</span>
              </div>
            </div>

            {/* Review Comment */}
            <div className="mb-6">
              <label htmlFor="comment" className="block text-lg font-medium mb-3">
                Your Review
              </label>
              <textarea
                id="comment"
                rows={6}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this public figure..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              ></textarea>
            </div>

            {/* CAPTCHA - Simplified version */}
            <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Verification</h3>
                <div className="text-xs bg-gray-700 px-2 py-1 rounded">CAPTCHA</div>
              </div>
              <div className="bg-gray-700 p-3 rounded flex items-center justify-center mb-3">
                <div className="text-lg font-mono tracking-widest text-gray-300 select-none">4 + 3 = ?</div>
              </div>
              <input
                type="text"
                placeholder="Enter the answer"
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-200">{error}</div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}

