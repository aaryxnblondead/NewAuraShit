// Placeholder data for the application

// Add User interface
export interface User {
  id: string
  name: string
  username: string
  email: string
  image: string
  bio: string
  location: string
  joinDate: string
  isVerified: boolean
  reviews: UserReview[]
  savedProfiles: string[]
}

export interface UserReview {
  id: string
  profileId: string
  profileName: string
  rating: number
  comment: string
  date: string
  upvotes: number
  downvotes: number
}

export interface Profile {
  id: string
  name: string
  image: string
  profession: string
  bio: string
  industry?: string
  region?: string
  twitterHandle?: string
  score: {
    overall: number
    credibility: number
    longevity: number
    engagement: number
  }
  socialStats: {
    followers: number
    posts: number
    engagement: number
  }
  recentActivity: Activity[]
  reviews: Review[]
}

export interface Activity {
  id: string
  type: "post" | "news" | "award" | "event"
  platform?: string
  title: string
  content: string
  date: string
  image?: string
  link?: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  userImage: string
  rating: number
  comment: string
  date: string
  upvotes: number
  downvotes: number
}

export const profiles: Profile[] = [
  {
    id: "elon-musk",
    name: "Elon Musk",
    image: "/placeholder.svg?height=400&width=400",
    profession: "Entrepreneur & Investor",
    bio: "Elon Reeve Musk is a business magnate and investor. He is the founder, CEO, and chief engineer of SpaceX; angel investor, CEO, and product architect of Tesla, Inc.; founder of The Boring Company; co-founder of Neuralink and OpenAI.",
    score: {
      overall: 8.7,
      credibility: 8.2,
      longevity: 9.5,
      engagement: 8.4,
    },
    socialStats: {
      followers: 128500000,
      posts: 24500,
      engagement: 5.2,
    },
    recentActivity: [
      {
        id: "act1",
        type: "post",
        platform: "X",
        title: "New SpaceX Launch",
        content: "Successful launch of Starship prototype SN15!",
        date: "2023-03-15",
        image: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "act2",
        type: "news",
        title: "Tesla Reaches New Milestone",
        content: "Tesla delivers record number of vehicles in Q1 2023",
        date: "2023-04-02",
        link: "#",
      },
      {
        id: "act3",
        type: "event",
        title: "AI Conference Keynote",
        content: "Elon Musk delivers keynote on the future of AI",
        date: "2023-02-28",
        image: "/placeholder.svg?height=300&width=500",
      },
    ],
    reviews: [
      {
        id: "rev1",
        userId: "user1",
        userName: "TechEnthusiast",
        userImage: "/placeholder.svg?height=100&width=100",
        rating: 9,
        comment:
          "Visionary entrepreneur who's changing multiple industries simultaneously. His work ethic is unmatched.",
        date: "2023-03-10",
        upvotes: 245,
        downvotes: 12,
      },
      {
        id: "rev2",
        userId: "user2",
        userName: "SpaceXFan",
        userImage: "/placeholder.svg?height=100&width=100",
        rating: 10,
        comment:
          "What he's accomplished with SpaceX is nothing short of revolutionary. Bringing space travel to the private sector!",
        date: "2023-02-15",
        upvotes: 189,
        downvotes: 5,
      },
    ],
  },
  {
    id: "taylor-swift",
    name: "Taylor Swift",
    image: "/placeholder.svg?height=400&width=400",
    profession: "Musician & Songwriter",
    bio: "Taylor Alison Swift is an American singer-songwriter. Her discography spans multiple genres, and her narrative songwriting—often inspired by her personal life—has received critical praise and widespread media coverage.",
    score: {
      overall: 9.2,
      credibility: 9.0,
      longevity: 9.3,
      engagement: 9.3,
    },
    socialStats: {
      followers: 92300000,
      posts: 1120,
      engagement: 7.8,
    },
    recentActivity: [
      {
        id: "act1",
        type: "event",
        title: "Eras Tour",
        content: "Taylor Swift announces additional dates for The Eras Tour",
        date: "2023-04-01",
        image: "/placeholder.svg?height=300&width=500",
      },
      {
        id: "act2",
        type: "news",
        title: "Album Breaks Records",
        content: "Taylor Swift's latest album breaks streaming records",
        date: "2023-03-20",
        link: "#",
      },
    ],
    reviews: [
      {
        id: "rev1",
        userId: "user3",
        userName: "Swiftie4Life",
        userImage: "/placeholder.svg?height=100&width=100",
        rating: 10,
        comment: "The greatest songwriter of our generation. Her ability to connect with fans is unmatched.",
        date: "2023-03-25",
        upvotes: 312,
        downvotes: 8,
      },
    ],
  },
  {
    id: "lebron-james",
    name: "LeBron James",
    image: "/placeholder.svg?height=400&width=400",
    profession: "Professional Athlete",
    bio: "LeBron Raymone James Sr. is an American professional basketball player for the Los Angeles Lakers of the National Basketball Association (NBA). Nicknamed 'King James', he is widely considered one of the greatest players in NBA history.",
    score: {
      overall: 9.5,
      credibility: 9.7,
      longevity: 9.8,
      engagement: 9.0,
    },
    socialStats: {
      followers: 51200000,
      posts: 3450,
      engagement: 4.3,
    },
    recentActivity: [
      {
        id: "act1",
        type: "news",
        title: "NBA Playoffs",
        content: "LeBron leads Lakers to playoff victory",
        date: "2023-04-05",
        image: "/placeholder.svg?height=300&width=500",
      },
    ],
    reviews: [
      {
        id: "rev1",
        userId: "user4",
        userName: "BasketballFan",
        userImage: "/placeholder.svg?height=100&width=100",
        rating: 10,
        comment: "The greatest basketball player I've ever seen. His longevity is incredible.",
        date: "2023-03-18",
        upvotes: 278,
        downvotes: 15,
      },
    ],
  },
  {
    id: "oprah-winfrey",
    name: "Oprah Winfrey",
    image: "/placeholder.svg?height=400&width=400",
    profession: "Media Executive & Philanthropist",
    bio: "Oprah Gail Winfrey is an American talk show host, television producer, actress, author, and philanthropist. She is best known for her talk show, The Oprah Winfrey Show, which was the highest-rated television program of its kind.",
    score: {
      overall: 9.3,
      credibility: 9.5,
      longevity: 9.7,
      engagement: 8.7,
    },
    socialStats: {
      followers: 42800000,
      posts: 2150,
      engagement: 3.8,
    },
    recentActivity: [
      {
        id: "act1",
        type: "event",
        title: "Charity Gala",
        content: "Oprah hosts annual charity gala raising millions for education",
        date: "2023-03-28",
        image: "/placeholder.svg?height=300&width=500",
      },
    ],
    reviews: [
      {
        id: "rev1",
        userId: "user5",
        userName: "MediaExpert",
        userImage: "/placeholder.svg?height=100&width=100",
        rating: 9,
        comment: "A true pioneer in media who has used her platform for positive change. Her influence is undeniable.",
        date: "2023-04-01",
        upvotes: 201,
        downvotes: 7,
      },
    ],
  },
  {
    id: "cristiano-ronaldo",
    name: "Cristiano Ronaldo",
    image: "/placeholder.svg?height=400&width=400",
    profession: "Professional Athlete",
    bio: "Cristiano Ronaldo dos Santos Aveiro is a Portuguese professional footballer who plays as a forward and captains the Portugal national team. Widely regarded as one of the greatest players of all time, he has won numerous awards including five Ballon d'Or awards.",
    score: {
      overall: 9.4,
      credibility: 9.2,
      longevity: 9.6,
      engagement: 9.4,
    },
    socialStats: {
      followers: 156700000,
      posts: 3280,
      engagement: 6.7,
    },
    recentActivity: [
      {
        id: "act1",
        type: "post",
        platform: "Instagram",
        title: "Training Session",
        content: "Working hard for the upcoming match!",
        date: "2023-04-03",
        image: "/placeholder.svg?height=300&width=500",
      },
    ],
    reviews: [
      {
        id: "rev1",
        userId: "user6",
        userName: "FootballFanatic",
        userImage: "/placeholder.svg?height=100&width=100",
        rating: 10,
        comment: "The most dedicated athlete I've ever seen. His work ethic and consistency are unmatched.",
        date: "2023-03-22",
        upvotes: 345,
        downvotes: 18,
      },
    ],
  },
]

// Add mock users data
export const users: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    username: "alexj",
    email: "alex@example.com",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Tech enthusiast and avid follower of influential figures in the industry.",
    location: "San Francisco, CA",
    joinDate: "2022-05-15",
    isVerified: true,
    reviews: [
      {
        id: "rev1",
        profileId: "elon-musk",
        profileName: "Elon Musk",
        rating: 9,
        comment:
          "Visionary entrepreneur who's changing multiple industries simultaneously. His work ethic is unmatched.",
        date: "2023-03-10",
        upvotes: 245,
        downvotes: 12,
      },
      {
        id: "rev2",
        profileId: "taylor-swift",
        profileName: "Taylor Swift",
        rating: 8,
        comment: "Incredible songwriter and performer. Her ability to reinvent herself is impressive.",
        date: "2023-02-20",
        upvotes: 178,
        downvotes: 8,
      },
    ],
    savedProfiles: ["elon-musk", "lebron-james"],
  },
  {
    id: "user2",
    name: "Samantha Lee",
    username: "samlee",
    email: "sam@example.com",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Sports journalist and analyst. I love tracking the influence of athletes both on and off the field.",
    location: "Chicago, IL",
    joinDate: "2022-07-22",
    isVerified: true,
    reviews: [
      {
        id: "rev3",
        profileId: "lebron-james",
        profileName: "LeBron James",
        rating: 10,
        comment:
          "The greatest basketball player I've ever seen. His longevity is incredible and his off-court impact is just as impressive.",
        date: "2023-03-18",
        upvotes: 278,
        downvotes: 15,
      },
    ],
    savedProfiles: ["lebron-james", "cristiano-ronaldo"],
  },
]

export const trendingProfiles = [
  {
    id: "mark-zuckerberg",
    name: "Mark Zuckerberg",
    image: "/placeholder.svg?height=400&width=400",
    profession: "Tech Entrepreneur",
    score: 8.3,
    trending: true,
  },
  {
    id: "beyonce",
    name: "Beyoncé",
    image: "/placeholder.svg?height=400&width=400",
    profession: "Musician & Performer",
    score: 9.1,
    trending: true,
  },
  {
    id: "dwayne-johnson",
    name: "Dwayne Johnson",
    image: "/placeholder.svg?height=400&width=400",
    profession: "Actor & Entrepreneur",
    score: 8.9,
    trending: true,
  },
]

export const getProfileById = (id: string): Profile | undefined => {
  return profiles.find((profile) => profile.id === id)
}

// Add function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id)
}

export const getTopProfiles = (limit = 10): Profile[] => {
  return [...profiles].sort((a, b) => b.score.overall - a.score.overall).slice(0, limit)
}

export const searchProfiles = (query: string): Profile[] => {
  const lowercaseQuery = query.toLowerCase()
  return profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(lowercaseQuery) ||
      profile.profession.toLowerCase().includes(lowercaseQuery) ||
      profile.bio.toLowerCase().includes(lowercaseQuery),
  )
}

// Add industries for filtering
export const industries = ["Technology", "Sports", "Entertainment", "Music", "Business", "Politics", "Media", "Science"]

// Add regions for filtering
export const regions = ["North America", "Europe", "Asia", "South America", "Africa", "Australia"]

export const filterProfiles = (
  profiles: Profile[],
  filters: {
    profession?: string
    minScore?: number
    maxScore?: number
    sortBy?: "overall" | "credibility" | "longevity" | "engagement"
  },
): Profile[] => {
  let filtered = [...profiles]

  if (filters.profession) {
    filtered = filtered.filter((p) => p.profession.toLowerCase().includes(filters.profession!.toLowerCase()))
  }

  if (filters.minScore !== undefined) {
    filtered = filtered.filter((p) => p.score.overall >= filters.minScore!)
  }

  if (filters.maxScore !== undefined) {
    filtered = filtered.filter((p) => p.score.overall <= filters.maxScore!)
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => b.score[filters.sortBy!] - a.score[filters.sortBy!])
  }

  return filtered
}

// Update profiles with industry and region
profiles.forEach((profile) => {
  if (profile.id === "elon-musk") {
    profile.industry = "Technology"
    profile.region = "North America"
    profile.twitterHandle = "elonmusk"
  } else if (profile.id === "taylor-swift") {
    profile.industry = "Music"
    profile.region = "North America"
    profile.twitterHandle = "taylorswift13"
  } else if (profile.id === "lebron-james") {
    profile.industry = "Sports"
    profile.region = "North America"
    profile.twitterHandle = "KingJames"
  } else if (profile.id === "oprah-winfrey") {
    profile.industry = "Media"
    profile.region = "North America"
    profile.twitterHandle = "Oprah"
  } else if (profile.id === "cristiano-ronaldo") {
    profile.industry = "Sports"
    profile.region = "Europe"
    profile.twitterHandle = "Cristiano"
  }
})

