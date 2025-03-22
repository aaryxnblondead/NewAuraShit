"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const faqItems: FaqItem[] = [
    {
      question: "What is InfluenceIQ?",
      answer:
        "InfluenceIQ is a platform that ranks public figures based on their credibility, longevity, and engagement. Our goal is to provide objective measurements of real influence beyond just popularity metrics.",
    },
    {
      question: "How do you calculate influence scores?",
      answer:
        "Our proprietary algorithm analyzes multiple factors across three key pillars: Credibility (accuracy of information, professional credentials, etc.), Longevity (sustained relevance over time), and Engagement (meaningful community interaction, audience loyalty, etc.).",
    },
    {
      question: "How often are rankings updated?",
      answer:
        "We update our rankings weekly for trending figures and monthly for the overall leaderboard. Some metrics are tracked in real-time, while others require more comprehensive analysis.",
    },
    {
      question: "Who can submit reviews for public figures?",
      answer:
        "Any registered user can submit reviews. To ensure quality and prevent manipulation, we verify accounts and moderate reviews according to our community guidelines.",
    },
    {
      question: "Can public figures request changes to their profiles?",
      answer:
        "Yes, verified public figures can claim their profiles and submit correction requests. Our team reviews these requests to maintain accuracy while ensuring objectivity.",
    },
    {
      question: "How do I report inaccurate information?",
      answer:
        "You can report inaccurate information by clicking the 'Report' button on any profile. Our content team reviews all reports and makes corrections as necessary.",
    },
    {
      question: "Can I suggest a public figure to be added to the platform?",
      answer:
        "Yes! We welcome suggestions for new profiles. Please use our Contact form and include as much information as possible about the individual you're recommending.",
    },
    {
      question: "What data sources do you use?",
      answer:
        "We use a combination of public data sources, including verified social media profiles, official publications, reputable news sources, and proprietary research. We do not use private or protected information.",
    },
    {
      question: "Is there a cost to use InfluenceIQ?",
      answer:
        "Basic access to InfluenceIQ is free. We offer premium subscriptions for additional features like detailed analytics, trend reports, and API access. Check our pricing page for more information.",
    },
    {
      question: "How can brands partner with InfluenceIQ?",
      answer:
        "Brands can register on our platform for access to our database of influential figures. We offer tools to identify potential partnerships based on alignment with your brand values and audience. Visit our 'Join as Brand' page to learn more.",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300">Find answers to common questions about InfluenceIQ</p>
        </div>

        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 mb-12">
          <div className="divide-y divide-gray-800">
            {faqItems.map((item, index) => (
              <div key={index} className="border-gray-800">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-800 transition-colors"
                >
                  <span className="font-medium text-lg">{item.question}</span>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform ${activeIndex === index ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`px-6 overflow-hidden transition-all ${
                    activeIndex === index ? "max-h-96 py-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-300">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-300 mb-6">
            We're here to help. Reach out to our team for assistance with anything not covered in our FAQ.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}

