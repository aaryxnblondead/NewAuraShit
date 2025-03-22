// API services for Wikipedia and Twitter

// Wikipedia API service
export async function fetchWikipediaImage(name: string): Promise<string | null> {
  try {
    // First, search for the page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()

    if (!searchData.query.search.length) {
      return null
    }

    // Get the page ID from the first search result
    const pageId = searchData.query.search[0].pageid

    // Then fetch the page images
    const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pageids=${pageId}&origin=*`
    const imageResponse = await fetch(imageUrl)
    const imageData = await imageResponse.json()

    // Extract the image URL
    if (imageData.query.pages[pageId].original) {
      return imageData.query.pages[pageId].original.source
    }

    return null
  } catch (error) {
    console.error("Error fetching Wikipedia image:", error)
    return null
  }
}

// Twitter API service (mock implementation)
// In a real app, you would use the Twitter API with proper authentication
export async function fetchTwitterTweets(username: string, count = 5): Promise<any[]> {
  // This is a mock implementation
  // In a real app, you would use the Twitter API with proper authentication

  // For demo purposes, we'll return mock data
  const mockTweets = [
    {
      id: "1",
      text: "Just had an amazing game! Thanks to all the fans for their support. #Grateful",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      user: {
        name: username,
        screen_name: username.toLowerCase().replace(/\s/g, ""),
        profile_image_url: "/placeholder.svg?height=50&width=50",
      },
      favorite_count: 12500,
      retweet_count: 3200,
    },
    {
      id: "2",
      text: "Excited to announce my new partnership with @BrandName! More details coming soon. #NewBeginnings",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      user: {
        name: username,
        screen_name: username.toLowerCase().replace(/\s/g, ""),
        profile_image_url: "/placeholder.svg?height=50&width=50",
      },
      favorite_count: 8700,
      retweet_count: 1500,
    },
    {
      id: "3",
      text: "Thank you for all the birthday wishes! Feeling blessed. ❤️",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      user: {
        name: username,
        screen_name: username.toLowerCase().replace(/\s/g, ""),
        profile_image_url: "/placeholder.svg?height=50&width=50",
      },
      favorite_count: 15800,
      retweet_count: 4200,
    },
    {
      id: "4",
      text: "Just finished an amazing workout. Ready for the next challenge! 💪 #NoRestDays",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      user: {
        name: username,
        screen_name: username.toLowerCase().replace(/\s/g, ""),
        profile_image_url: "/placeholder.svg?height=50&width=50",
      },
      favorite_count: 9300,
      retweet_count: 1800,
    },
    {
      id: "5",
      text: "Great team meeting today. Big things coming! Stay tuned. #Excited",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
      user: {
        name: username,
        screen_name: username.toLowerCase().replace(/\s/g, ""),
        profile_image_url: "/placeholder.svg?height=50&width=50",
      },
      favorite_count: 7600,
      retweet_count: 1200,
    },
  ]

  return mockTweets.slice(0, count)
}

