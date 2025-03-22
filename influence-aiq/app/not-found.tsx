import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-7xl font-bold text-accent mb-6">404</h1>
        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-300 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link
          href="/"
          className="inline-block bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

