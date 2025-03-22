"use client"

import { useState, useEffect } from "react"
import { profiles, industries, regions } from "@/lib/data"
import WikipediaImage from "@/components/wikipedia-image"
import { Sliders, ChevronDown, X } from "lucide-react"

export default function TrendingPage() {
  const [trendingProfiles, setTrendingProfiles] = useState(profiles)
  const [filteredProfiles, setFilteredProfiles] = useState(profiles)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [selectedIndustry, setSelectedIndustry] = useState<string>("")
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [minEngagement, setMinEngagement] = useState<number | undefined>(undefined)
  const [sortBy, setSortBy] = useState<"overall" | "credibility" | "longevity" | "engagement">("overall")

  useEffect(() => {
    // Simulate API call to get trending profiles
    setLoading(true)
    setTimeout(() => {
      // Sort by overall score as default
      const sorted = [...profiles].sort((a, b) => b.score.overall - a.score.overall)
      setTrendingProfiles(sorted)
      setFilteredProfiles(sorted)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (trendingProfiles.length > 0) {
      let filtered = [...trendingProfiles]

      if (selectedIndustry) {
        filtered = filtered.filter((p) => p.industry === selectedIndustry)
      }

      if (selectedRegion) {
        filtered = filtered.filter((p) => p.region === selectedRegion)
      }

      if (minEngagement !== undefined) {
        filtered = filtered.filter((p) => p.score.engagement >= minEngagement)
      }

      // Sort by selected criteria
      filtered.sort((a, b) => b.score[sortBy] - a.score[sortBy])

      setFilteredProfiles(filtered)
    }
  }, [selectedIndustry, selectedRegion, minEngagement, sortBy, trendingProfiles])

  const clearFilters = () => {
    setSelectedIndustry("")
    setSelectedRegion("")
    setMinEngagement(undefined)
    setSortBy("overall")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Trending Figures</h1>
        <p className="text-gray-400">Discover the most influential public figures trending right now.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Mobile Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between bg-gray-800 p-3 rounded-lg"
          >
            <div className="flex items-center">
              <Sliders size={18} className="mr-2" />
              <span>Filters</span>
            </div>
            <ChevronDown size={18} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Filters Sidebar */}
        <div className={`md:w-1/4 ${showFilters ? "block" : "hidden md:block"}`}>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 sticky top-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={clearFilters} className="text-sm text-accent hover:underline flex items-center">
                <X size={14} className="mr-1" /> Clear All
              </button>
            </div>

            {/* Industry Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Industry</h3>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              >
                <option value="">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Region</h3>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              >
                <option value="">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Engagement Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Min. Engagement Score</h3>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minEngagement || 0}
                onChange={(e) => setMinEngagement(Number.parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>0</span>
                <span>{minEngagement || 0}</span>
                <span>10</span>
              </div>
            </div>

            {/* Sort By Filter */}
            <div>
              <h3 className="font-medium mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
              >
                <option value="overall">Overall Score</option>
                <option value="credibility">Credibility</option>
                <option value="longevity">Longevity</option>
                <option value="engagement">Engagement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trending Profiles */}
        <div className="md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : filteredProfiles.length > 0 ? (
            <div className="space-y-6">
              {filteredProfiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 card-hover"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <WikipediaImage
                        name={profile.name}
                        fallbackSrc={profile.image}
                        width={400}
                        height={400}
                        className="w-full h-64 md:h-full object-cover"
                        alt={profile.name}
                      />
                    </div>

                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                          <span className="text-lg font-bold">{profile.score.overall.toFixed(1)}</span>
                          <span className="text-gray-400 ml-1">/10</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="text-accent">{profile.profession}</span>
                        {profile.industry && <span className="text-gray-400 ml-2">• {profile.industry}</span>}
                        {profile.region && <span className="text-gray-400 ml-2">• {profile.region}</span>}
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-2">{profile.bio}</p>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="text-sm text-gray-400 mb-1">Credibility</div>
                          <div className="flex items-center">
                            <div className="h-2 bg-gray-700 rounded-full flex-grow mr-2">
                              <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{ width: `${profile.score.credibility * 10}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{profile.score.credibility.toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="text-sm text-gray-400 mb-1">Longevity</div>
                          <div className="flex items-center">
                            <div className="h-2 bg-gray-700 rounded-full flex-grow mr-2">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${profile.score.longevity * 10}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{profile.score.longevity.toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="text-sm text-gray-400 mb-1">Engagement</div>
                          <div className="flex items-center">
                            <div className="h-2 bg-gray-700 rounded-full flex-grow mr-2">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${profile.score.engagement * 10}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{profile.score.engagement.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={`/profile/${profile.id}`}
                        className="inline-block bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800">
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-gray-400 mb-4">We couldn't find any profiles matching your filter criteria.</p>
              <button onClick={clearFilters} className="text-accent hover:underline">
                Clear filters and try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

