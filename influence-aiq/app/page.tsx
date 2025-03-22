import SearchBar from "@/components/search-bar"
import ProfileCard from "@/components/profile-card"
import { getTopProfiles, trendingProfiles } from "@/lib/data"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function Home() {
  const topProfiles = getTopProfiles(10)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover the <span className="text-accent">Real Influence</span> Behind Public Figures
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            InfluenceIQ ranks public figures based on credibility, longevity, and engagement.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Top 10 Influencers This Week</h2>
            <Link href="/leaderboard" className="text-accent flex items-center hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {topProfiles.map((profile, index) => (
              <ProfileCard
                key={profile.id}
                id={profile.id}
                name={profile.name}
                image={profile.image}
                profession={profile.profession}
                score={profile.score.overall}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <Link href="/trending" className="text-accent flex items-center hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                id={profile.id}
                name={profile.name}
                image={profile.image}
                profession={profile.profession}
                score={profile.score}
                trending={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Profiles Carousel */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Profiles</h2>
          </div>

          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide pb-4">
              <div className="flex space-x-6 w-max">
                {topProfiles.slice(0, 6).map((profile) => (
                  <div key={profile.id} className="w-72 flex-shrink-0">
                    <ProfileCard
                      id={profile.id}
                      name={profile.name}
                      image={profile.image}
                      profession={profile.profession}
                      score={profile.score.overall}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join as Brand CTA */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Brand?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join InfluenceIQ to connect with influential figures and boost your brand's presence.
          </p>
          <Link
            href="/join-brand"
            className="inline-block bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Join as Brand
          </Link>
        </div>
      </section>
    </div>
  )
}

