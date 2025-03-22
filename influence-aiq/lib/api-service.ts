// API service for backend integration

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Helper function for making API requests
async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  additionalHeaders: HeadersInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  }

  // Add auth token if available
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: "include", // Include cookies for cross-origin requests
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, options)

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") === -1) {
      // If not JSON, throw error with status and statusText
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      // For successful non-JSON responses, return a simple success object
      return { success: true } as unknown as T
    }

    // Parse JSON response
    const result = await response.json()

    // Handle non-2xx responses
    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data: result,
        },
      }
    }

    return result as T
  } catch (error) {
    // Rethrow for consistent error handling
    throw error
  }
}

// Auth API endpoints
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: any; token: string }>("/auth/login", "POST", { email, password }),

  register: (userData: { name: string; username: string; email: string; password: string }) =>
    apiRequest<{ user: any; token: string }>("/auth/register", "POST", userData),

  logout: () => apiRequest<{ success: boolean }>("/auth/logout", "POST"),

  resetPassword: (email: string) => apiRequest<{ success: boolean }>("/auth/reset-password", "POST", { email }),

  getCurrentUser: () => apiRequest<{ user: any }>("/auth/me"),
}

// User API endpoints
export const userApi = {
  getProfile: (userId: string) => apiRequest<{ user: any }>(`/users/${userId}`),

  updateProfile: (userId: string, profileData: any) =>
    apiRequest<{ user: any }>(`/users/${userId}`, "PUT", profileData),

  changePassword: (userId: string, passwordData: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ success: boolean }>(`/users/${userId}/password`, "PUT", passwordData),

  getSavedProfiles: (userId: string) => apiRequest<{ profiles: any[] }>(`/users/${userId}/saved-profiles`),

  saveProfile: (userId: string, profileId: string) =>
    apiRequest<{ success: boolean }>(`/users/${userId}/saved-profiles`, "POST", { profileId }),

  unsaveProfile: (userId: string, profileId: string) =>
    apiRequest<{ success: boolean }>(`/users/${userId}/saved-profiles/${profileId}`, "DELETE"),
}

// Profiles API endpoints
export const profilesApi = {
  getProfiles: (params?: {
    page?: number
    limit?: number
    sort?: string
    filter?: string
    industry?: string
    region?: string
  }) =>
    apiRequest<{ profiles: any[]; total: number; page: number; limit: number }>(
      `/profiles${params ? `?${new URLSearchParams(params as any).toString()}` : ""}`,
    ),

  getProfileById: (profileId: string) => apiRequest<{ profile: any }>(`/profiles/${profileId}`),

  searchProfiles: (query: string, params?: { page?: number; limit?: number; industry?: string; region?: string }) =>
    apiRequest<{ profiles: any[]; total: number }>(
      `/profiles/search?q=${encodeURIComponent(query)}${params ? `&${new URLSearchParams(params as any).toString()}` : ""}`,
    ),

  getLeaderboard: (timeFilter: "weekly" | "monthly" | "allTime", limit?: number) =>
    apiRequest<{ profiles: any[] }>(`/profiles/leaderboard?timeFilter=${timeFilter}${limit ? `&limit=${limit}` : ""}`),

  getTrending: (params?: { industry?: string; region?: string; limit?: number }) =>
    apiRequest<{ profiles: any[] }>(
      `/profiles/trending${params ? `?${new URLSearchParams(params as any).toString()}` : ""}`,
    ),
}

// Reviews API endpoints
export const reviewsApi = {
  getReviews: (profileId: string, params?: { page?: number; limit?: number; sort?: string }) =>
    apiRequest<{ reviews: any[]; total: number }>(
      `/profiles/${profileId}/reviews${params ? `?${new URLSearchParams(params as any).toString()}` : ""}`,
    ),

  createReview: (profileId: string, reviewData: { rating: number; comment: string }) =>
    apiRequest<{ review: any }>(`/profiles/${profileId}/reviews`, "POST", reviewData),

  updateReview: (reviewId: string, reviewData: { rating: number; comment: string }) =>
    apiRequest<{ review: any }>(`/reviews/${reviewId}`, "PUT", reviewData),

  deleteReview: (reviewId: string) => apiRequest<{ success: boolean }>(`/reviews/${reviewId}`, "DELETE"),

  voteReview: (reviewId: string, voteType: "up" | "down") =>
    apiRequest<{ success: boolean }>(`/reviews/${reviewId}/vote`, "POST", { voteType }),

  getUserReviews: (userId: string, params?: { page?: number; limit?: number }) =>
    apiRequest<{ reviews: any[]; total: number }>(
      `/users/${userId}/reviews${params ? `?${new URLSearchParams(params as any).toString()}` : ""}`,
    ),
}

// Contact API endpoint
export const contactApi = {
  sendContactForm: (formData: { name: string; email: string; subject: string; message: string }) =>
    apiRequest<{ success: boolean }>("/contact", "POST", formData),
}

// Brand API endpoints
export const brandApi = {
  registerBrand: (brandData: {
    brandName: string
    industry: string
    website: string
    contactName: string
    email: string
    phone?: string
    password: string
  }) => apiRequest<{ success: boolean; brand: any }>("/brands/register", "POST", brandData),

  getBrandProfile: (brandId: string) => apiRequest<{ brand: any }>(`/brands/${brandId}`),

  updateBrandProfile: (brandId: string, profileData: any) =>
    apiRequest<{ brand: any }>(`/brands/${brandId}`, "PUT", profileData),
}

