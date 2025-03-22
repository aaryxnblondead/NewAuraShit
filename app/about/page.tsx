import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About InfluenceIQ</h1>
          <p className="text-xl text-gray-300">Measuring real influence in a world full of noise</p>
        </section>

        <section className="mb-16">
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              At InfluenceIQ, our mission is to cut through the noise and provide accurate, data-driven rankings of
              public figures based on real influence—not just follower counts or viral moments.
            </p>
            <p className="text-gray-300 mb-6">
              We believe that true influence is measured through a combination of credibility, longevity, and meaningful
              engagement. Our platform helps audiences, brands, and researchers identify authentic influence in an
              increasingly crowded digital landscape.
            </p>
            <div className="rounded-lg overflow-hidden mb-6">
              <Image
                src="/placeholder.svg?height=400&width=800"
                alt="InfluenceIQ team"
                width={800}
                height={400}
                className="w-full"
              />
            </div>
            <p className="text-gray-300">
              Founded in 2023, InfluenceIQ is committed to transparency, accuracy, and building a community that values
              authentic influence over fleeting popularity.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">How We Measure Influence</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Credibility</h3>
              <p className="text-gray-300">
                We analyze accuracy of information shared, professional credentials, consistency in messaging, and
                public trust factors.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Longevity</h3>
              <p className="text-gray-300">
                We evaluate sustained relevance over time, resilience through industry changes, and consistent growth
                rather than viral spikes.
              </p>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Engagement</h3>
              <p className="text-gray-300">
                We measure meaningful community interaction, conversation quality, audience loyalty, and impact beyond
                vanity metrics.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Alex Morgan", role: "Founder & CEO", image: "/placeholder.svg?height=300&width=300" },
              { name: "Jordan Lee", role: "Chief Data Scientist", image: "/placeholder.svg?height=300&width=300" },
              { name: "Taylor Reed", role: "Head of Research", image: "/placeholder.svg?height=300&width=300" },
              { name: "Morgan Chen", role: "Lead Engineer", image: "/placeholder.svg?height=300&width=300" },
              { name: "Jamie Wilson", role: "UX Director", image: "/placeholder.svg?height=300&width=300" },
              { name: "Casey Johnson", role: "Community Manager", image: "/placeholder.svg?height=300&width=300" },
            ].map((member, index) => (
              <div key={index} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-gray-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-6">Join Us in Redefining Influence</h2>
          <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
            Whether you're an individual looking to discover authentic voices, a brand seeking meaningful partnerships,
            or a researcher studying influence patterns, InfluenceIQ provides the data and insights you need.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/contact"
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

