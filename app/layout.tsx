import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from 'react-hot-toast';
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InfluenceIQ - Public Figure Ranking Platform",
  description: "Discover and rank public figures based on credibility, longevity, and engagement",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  )
}