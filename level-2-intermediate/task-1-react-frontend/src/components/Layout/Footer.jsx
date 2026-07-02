import React from 'react'
import { TrendingUp } from 'lucide-react'

function Footer() {
  return (
    <footer className="footer bg-white border-t border-gray-200 mt-auto">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-primary-600" />
            <span className="font-semibold text-gray-800">WealthWise</span>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-gray-600 text-center">
            <p>&copy; 2024 WealthWise Finance Tracker. Built with  for the Codveda Internship Program.</p>
          </div>
          
          {/* Technology Stack */}
          <div className="text-xs text-gray-500">
            <span>Powered by React & Vite</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer