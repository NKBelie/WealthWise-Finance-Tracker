import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, Menu, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useApp } from '../../context/AppContext'
import { ACTION_TYPES } from '../../context/AppContext'

function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { state, dispatch } = useApp()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleSidebar = () => {
    dispatch({ type: ACTION_TYPES.TOGGLE_SIDEBAR })
  }

  return (
    <header className="header bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="header-container flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="btn-ghost p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
          )}
          
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center space-x-2 text-gray-800 hover:text-primary-600 transition-colors"
          >
            <TrendingUp size={28} className="text-primary-600" />
            <span className="text-xl font-bold">WealthWise</span>
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden lg:flex items-center space-x-6">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link to="/features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/income" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Income
              </Link>
              <Link 
                to="/expenses" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Expenses
              </Link>
              <Link 
                to="/budgets" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Budgets
              </Link>
            </>
          )}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative group">
              {/* User Avatar and Info */}
              <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={16} className="mr-3" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings size={16} className="mr-3" />
                  Settings
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header