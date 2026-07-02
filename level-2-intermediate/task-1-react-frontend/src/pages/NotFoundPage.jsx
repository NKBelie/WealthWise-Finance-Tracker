import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => window.history.back()} className="btn btn-outline flex items-center justify-center">
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </button>
          <Link to="/" className="btn btn-primary flex items-center justify-center">
            <Home size={16} className="mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
