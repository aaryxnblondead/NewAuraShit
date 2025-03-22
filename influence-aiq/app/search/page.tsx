"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import SearchBar from "@/components/search-bar"
import ProfileCard from "@/components/profile-card"
import { searchProfiles, filterProfiles, type Profile } from "@/lib/data"
import { Sliders, ChevronDown, X } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [results, setResults] = useState<Profile[]>([])
  const [filteredResults, setFilteredResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [profession, setProfession] = useState("")
  const [minScore, setMinScore] = useState<number | undefined>(undefined)
  const [maxScore, setMaxScore] = useState<number | undefined>(undefined)
  const [sortBy, setSortBy] = useState<"overall" | "credibility" | "longevity" | "engagement">("overall")

  useEffect(() => {
    if (query) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const searchResults = searchProfiles(query)
        setResults(searchResults)
        setFilteredResults(searchResults)
        setLoading(false)
      }, 500)
    } else {
      setResults([])
      setFilteredResults([])
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    if (results.length > 0) {
      const filtered = filterProfiles(results, {
        profession,
        minScore,
        maxScore,
        sortBy,
      })
      setFilteredResults(filtered)
    }
  }, [profession, minScore, maxScore, sortBy, results])

  const clearFilters = () => {
    setProfession("")
    setMinScore(undefined)
    setMaxScore(undefined)
    setSortBy("overall")
  }

  const professionOptions = ["Entrepreneur", "Musician", "Athlete", "Actor", "Politician", "Media Personality"]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        <SearchBar className="max-w-2xl" />

        {query && (
          <p className="mt-4 text-gray-400">
            {loading ? "Searching..." : `Found ${filteredResults.length} results for "${query}"`}
          </p>
        )}
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

            {/* Profession Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Profession</h3>
              <div className="space-y-2">
                {professionOptions.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      id={option}
                      name="profession"
                      checked={profession === option}
                      onChange={() => setProfession(option)}
                      className="mr-2 accent-accent"
                    />
                    <label htmlFor={option} className="text-gray-300">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Range Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Score Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="min-score" className="text-sm text-gray-400 block mb-1">
                    Min
                  </label>
                  <input
                    type="number"
                    id="min-score"
                    min="0"
                    max="10"
                    step="0.1"
                    value={minScore || ""}
                    onChange={(e) => setMinScore(e.target.value ? Number.parseFloat(e.target.value) : undefined)}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="max-score" className="text-sm text-gray-400 block mb-1">
                    Max
                  </label>
                  <input
                    type="number"
                    id="max-score"
                    min="0"
                    max="10"
                    step="0.1"
                    value={maxScore || ""}
                    onChange={(e) => setMaxScore(e.target.value ? Number.parseFloat(e.target.value) : undefined)}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                  />
                </div>
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

        {/* Search Results */}
        <div className="md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  id={profile.id}
                  name={profile.name}
                  image={profile.image}
                  profession={profile.profession}
                  score={profile.score.overall}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800">
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-gray-400 mb-4">We couldn't find any profiles matching your search criteria.</p>
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

