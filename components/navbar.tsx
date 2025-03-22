"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X, User, Home, TrendingUp, Briefcase, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  const handleLogout = () => {
    logout()
    setIsProfileMenuOpen(false)
  }

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Trending", href: "/trending", icon: TrendingUp },
    { name: "Join as Brand", href: "/join-brand", icon: Briefcase },
  ]

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-accent font-bold text-2xl">
              Influence<span className="text-white">IQ</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-1 hover:text-accent transition-colors ${isActive ? "text-accent" : "text-gray-300"}`}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </Link>
              )
            })}

            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={toggleProfileMenu} className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700">
                    <Image
                      src={user?.image || "/placeholder.svg?height=32&width=32"}
                      alt={user?.name || "User"}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-gray-300">{user?.name?.split(" ")[0]}</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                    <Link
                      href={`/user-profile/${user?.id}`}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-300 hover:text-accent transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300 hover:text-white" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-800 mt-3">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-800 ${isActive ? "text-accent" : "text-gray-300"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                )
              })}

              {/* Auth Links for Mobile */}
              {isAuthenticated ? (
                <>
                  <Link
                    href={`/user-profile/${user?.id}`}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Your Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 text-gray-300 w-full text-left"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-2 p-2 rounded bg-accent text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

