"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/data"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => void
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>
}

export interface RegisterData {
  name: string
  username: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved auth token in localStorage
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")

        if (token) {
          // In a real app, you would validate the token with your backend
          // For now, we'll simulate a user being logged in if a token exists

          // Mock user data - replace with API call to get user profile
          const mockUser: User = {
            id: "user1",
            name: "Alex Johnson",
            username: "alexj",
            email: "alex@example.com",
            image: "/placeholder.svg?height=200&width=200",
            bio: "Tech enthusiast and avid follower of influential figures in the industry.",
            location: "San Francisco, CA",
            joinDate: "2022-05-15",
            isVerified: true,
            reviews: [],
            savedProfiles: [],
          }

          setUser(mockUser)
        }
      } catch (error) {
        console.error("Authentication error:", error)
        localStorage.removeItem("auth_token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // In a real app, you would make an API call to your backend
      // For now, we'll simulate a successful login with any credentials

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      if (email && password) {
        // Mock user data - replace with actual user data from your API
        const mockUser: User = {
          id: "user1",
          name: "Alex Johnson",
          username: "alexj",
          email: email,
          image: "/placeholder.svg?height=200&width=200",
          bio: "Tech enthusiast and avid follower of influential figures in the industry.",
          location: "San Francisco, CA",
          joinDate: new Date().toISOString(),
          isVerified: true,
          reviews: [],
          savedProfiles: [],
        }

        // Save auth token to localStorage
        localStorage.setItem("auth_token", "mock_token_" + Date.now())

        setUser(mockUser)
        return { success: true, message: "Login successful" }
      }

      return { success: false, message: "Invalid credentials" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "An error occurred during login" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)

      // In a real app, you would make an API call to your backend
      // For now, we'll simulate a successful registration

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful registration
      if (userData.email && userData.password) {
        // Mock user data based on registration input
        const mockUser: User = {
          id: "user" + Date.now(),
          name: userData.name,
          username: userData.username,
          email: userData.email,
          image: "/placeholder.svg?height=200&width=200",
          bio: "",
          location: "",
          joinDate: new Date().toISOString(),
          isVerified: false,
          reviews: [],
          savedProfiles: [],
        }

        // Save auth token to localStorage
        localStorage.setItem("auth_token", "mock_token_" + Date.now())

        setUser(mockUser)
        return { success: true, message: "Registration successful" }
      }

      return { success: false, message: "Invalid registration data" }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: "An error occurred during registration" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true)

      // In a real app, you would make an API call to your backend
      // For now, we'll simulate a successful password reset request

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        success: true,
        message: "If an account exists with this email, a password reset link has been sent.",
      }
    } catch (error) {
      console.error("Password reset error:", error)
      return { success: false, message: "An error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

