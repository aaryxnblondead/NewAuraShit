"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Check, Info } from "lucide-react"

export default function JoinAsBrandPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    brandName: "",
    industry: "",
    website: "",
    contactName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.brandName.trim()) {
      newErrors.brandName = "Brand name is required"
    }

    if (!formData.industry) {
      newErrors.industry = "Industry is required"
    }

    if (!formData.website.trim()) {
      newErrors.website = "Website is required"
    } else if (!/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(formData.website)) {
      newErrors.website = "Please enter a valid website URL"
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        setShowSuccess(true)

        // Redirect after showing success message
        setTimeout(() => {
          router.push("/")
        }, 3000)
      }, 1500)
    }
  }

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Retail",
    "Entertainment",
    "Food & Beverage",
    "Travel",
    "Education",
    "Manufacturing",
    "Other",
  ]

  if (showSuccess) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-md">
        <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800">
          <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Registration Successful!</h1>
          <p className="text-gray-300 mb-6">
            Thank you for registering your brand with InfluenceIQ. We'll review your application and get back to you
            shortly.
          </p>
          <p className="text-gray-400 text-sm">Redirecting to homepage...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Join InfluenceIQ as a Brand</h1>
          <p className="text-gray-300">
            Register your brand to access exclusive features and connect with influential figures.
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 flex items-start">
            <Info size={20} className="text-accent mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Why Join as a Brand?</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Connect with influential figures in your industry</li>
                <li>• Access detailed analytics and engagement metrics</li>
                <li>• Showcase your brand's credibility and influence</li>
                <li>• Discover partnership opportunities with top influencers</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Brand Information */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Briefcase size={20} className="mr-2" />
                  Brand Information
                </h2>
              </div>

              <div>
                <label htmlFor="brandName" className="block text-sm font-medium mb-1">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${errors.brandName ? "border-red-500" : "border-gray-700"} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent`}
                />
                {errors.brandName && <p className="text-red-500 text-sm mt-1">{errors.brandName}</p>}
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium mb-1">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${errors.industry ? "border-red-500" : "border-gray-700"} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent`}
                >
                  <option value="">Select Industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium mb-1">
                  Website <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                  className={`w-full bg-gray-800 border ${errors.website ? "border-red-500" : "border-gray-700"} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent`}
                />
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
              </div>

              {/* Contact Information */}
              <div className="md:col-span-2 mt-4">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-medium mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${errors.contactName ? "border-red-500" : "border-gray-700"} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent`}
                />
                {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${errors.email ? "border-red-500" : "border-gray-700"} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              {/* Account Information */}
              <div className="md:col-span-2 mt-4">
                <h2 className="text-xl font-bold mb-4">Account Information</h2>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${errors.password ? "border-red-500" : "border-gray-700"} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${errors.confirmPassword ? "border-red-500" : "border-gray-700"} rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 mr-2 accent-accent"
                  />
                  <label htmlFor="agreeTerms" className="text-sm">
                    I agree to the{" "}
                    <a href="/terms" className="text-accent hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-accent hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>}
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Register Brand"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-accent hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  )
}

