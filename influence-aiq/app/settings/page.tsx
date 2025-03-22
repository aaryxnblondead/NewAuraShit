"use client"

import type React from "react"

import { useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { Check, User, Lock, Bell, Shield } from "lucide-react"
import Image from "next/image"

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [successMessage, setSuccessMessage] = useState("")

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this data to your backend
    console.log("Profile form submitted:", profileForm)

    // Show success message
    setSuccessMessage("Profile updated successfully")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would send this data to your backend
    console.log("Password form submitted:", passwordForm)

    // Show success message
    setSuccessMessage("Password updated successfully")

    // Clear form
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ]

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-center">
            <Check size={20} className="text-green-500 mr-2 flex-shrink-0" />
            <p className="text-green-200">{successMessage}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 sticky top-20">
              <div className="flex items-center space-x-3 mb-6 p-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700">
                  <Image
                    src={user?.image || "/placeholder.svg?height=48&width=48"}
                    alt={user?.name || "User"}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-gray-400">@{user?.username}</div>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id ? "bg-accent/10 text-accent" : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-3/4">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>

                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="username" className="block text-sm font-medium mb-1">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={profileForm.username}
                        onChange={handleProfileChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium mb-1">
                        Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={profileForm.location}
                        onChange={handleProfileChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6">Security Settings</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>

                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>

                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <div className="w-10 h-6 bg-gray-700 rounded-full p-1 flex items-center">
                          <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Enable Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Add an extra layer of security to your account by requiring a verification code in addition to
                          your password.
                        </p>
                      </div>
                    </div>

                    <button className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      Set Up Two-Factor Authentication
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>

                <div className="space-y-6">
                  <div className="border-b border-gray-800 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Email Notifications</h3>
                      <div className="w-12 h-6 bg-accent rounded-full p-1 flex justify-end items-center cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Receive email notifications about activity related to your account.
                    </p>
                  </div>

                  <div className="border-b border-gray-800 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">New Reviews</h3>
                      <div className="w-12 h-6 bg-accent rounded-full p-1 flex justify-end items-center cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Get notified when someone leaves a review on a profile you follow.
                    </p>
                  </div>

                  <div className="border-b border-gray-800 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Trending Updates</h3>
                      <div className="w-12 h-6 bg-gray-700 rounded-full p-1 flex items-center cursor-pointer">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">Receive updates about trending profiles and industry news.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Marketing Communications</h3>
                      <div className="w-12 h-6 bg-gray-700 rounded-full p-1 flex items-center cursor-pointer">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Receive promotional emails and special offers from InfluenceIQ.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6">Privacy Settings</h2>

                <div className="space-y-6">
                  <div className="border-b border-gray-800 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Profile Visibility</h3>
                      <select className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white">
                        <option value="public">Public</option>
                        <option value="followers">Followers Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <p className="text-sm text-gray-400">Control who can see your profile and activity.</p>
                  </div>

                  <div className="border-b border-gray-800 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Show My Reviews</h3>
                      <div className="w-12 h-6 bg-accent rounded-full p-1 flex justify-end items-center cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">Allow others to see reviews you've written.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Data Usage</h3>
                      <div className="w-12 h-6 bg-accent rounded-full p-1 flex justify-end items-center cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Allow InfluenceIQ to use your data to improve your experience.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Data Management</h3>

                  <div className="space-y-4">
                    <button className="w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors">
                      <div className="font-medium mb-1">Download Your Data</div>
                      <div className="text-sm text-gray-400">
                        Get a copy of all the data InfluenceIQ has stored about you.
                      </div>
                    </button>

                    <button className="w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-4 transition-colors">
                      <div className="font-medium mb-1 text-red-400">Delete Your Account</div>
                      <div className="text-sm text-gray-400">
                        Permanently delete your account and all associated data.
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

