"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getUserById, type User } from "@/lib/data"
import { Star, ThumbsUp, ThumbsDown, Calendar, MapPin, CheckCircle } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewVotes, setReviewVotes] = useState<Record<string, "up" | "down" | null>>({})
  const [activeTab, setActiveTab] = useState<"reviews" | "saved">("reviews")

  useEffect(() => {
    // Simulate API fetch
    const fetchUser = () => {
      setLoading(true)
      setTimeout(() => {
        const foundUser = getUserById(params.id)
        setUser(foundUser || null)
        setLoading(false)
      }, 500)
    }

    fetchUser()
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

  return (
    <ProtectedRoute>
      {loading ? (
        <div className="container mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        </div>
      ) : !user ? (
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
            <p className="text-gray-400">The user you are looking for does not exist.</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto py-8 px-4">
          {/* User Profile Header */}
          <section className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4">
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  width={200}
                  height={200}
                  className="rounded-lg w-full h-auto"
                />
              </div>

              <div className="md:w-3/4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h1 className="text-3xl font-bold flex items-center">
                      {user.name}
                      {user.isVerified && <CheckCircle size={20} className="text-accent ml-2" />}
                    </h1>
                    <p className="text-gray-400">@{user.username}</p>
                  </div>

                  <Link
                    href="/settings"
                    className="mt-2 md:mt-0 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </Link>
                </div>

                <p className="text-gray-300 mb-6">{user.bio}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-400">
                    <MapPin size={18} className="mr-2" />
                    <span>{user.location}</span>
                  </div>

                  <div className="flex items-center text-gray-400">
                    <Calendar size={18} className="mr-2" />
                    <span>
                      Joined{" "}
                      {new Date(user.joinDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="flex border-b border-gray-800 mb-6">
            <button
              className={`py-3 px-6 font-medium ${activeTab === "reviews" ? "text-accent border-b-2 border-accent" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({user.reviews.length})
            </button>
            <button
              className={`py-3 px-6 font-medium ${activeTab === "saved" ? "text-accent border-b-2 border-accent" : "text-gray-400 hover:text-white"}`}
              onClick={() => setActiveTab("saved")}
            >
              Saved Profiles ({user.savedProfiles.length})
            </button>
          </div>

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <section>
              <h2 className="text-2xl font-bold mb-6">User Reviews</h2>

              {user.reviews.length > 0 ? (
                <div className="space-y-6">
                  {user.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                      <div className="flex justify-between items-start mb-4">
                        <Link
                          href={`/profile/${review.profileId}`}
                          className="font-bold text-xl hover:text-accent transition-colors"
                        >
                          {review.profileName}
                        </Link>
                        <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                          <Star size={16} className="text-yellow-500 mr-1" />
                          <span className="font-medium">{review.rating}/10</span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{review.comment}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">{new Date(review.date).toLocaleDateString()}</div>

                        <div className="flex items-center space-x-4">
                          <button
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                              reviewVotes[review.id] === "up"
                                ? "bg-green-900/50 text-green-400"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                            onClick={() => handleVote(review.id, "down")}
                          >
                            <ThumbsDown size={14} />
                            <span>{review.downvotes + (reviewVotes[review.id] === "down" ? 1 : 0)}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800">
                  <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
                  <p className="text-gray-400 mb-4">This user hasn't written any reviews yet.</p>
                </div>
              )}
            </section>
          )}

          {/* Saved Profiles Tab */}
          {activeTab === "saved" && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Saved Profiles</h2>

              {user.savedProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.savedProfiles.map((profileId) => (
                    <Link
                      key={profileId}
                      href={`/profile/${profileId}`}
                      className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-accent transition-colors"
                    >
                      <div className="font-bold mb-2">
                        {profileId
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </div>
                      <div className="text-gray-400 text-sm">View profile</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800">
                  <h3 className="text-xl font-bold mb-2">No saved profiles</h3>
                  <p className="text-gray-400 mb-4">This user hasn't saved any profiles yet.</p>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </ProtectedRoute>
  )
}

