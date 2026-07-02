import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, PlusCircle, MinusCircle, Calculator, BarChart3, Shield, Zap } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function HomePage() {
  const { isAuthenticated, demoLogin } = useAuth()

  const features = [
    {
      icon: PlusCircle,
      title: 'Income Tracking',
      description: 'Track income from multiple sources with categorization and recurring income support.'
    },
    {
      icon: MinusCircle,
      title: 'Expense Management',
      description: 'Monitor and categorize expenses with detailed tracking and analytics.'
    },
    {
      icon: Calculator,
      title: 'Budget Planning',
      description: 'Create and monitor budgets with real-time progress tracking and alerts.'
    },
    {
      icon: BarChart3,
      title: 'Financial Analytics',
      description: 'Gain insights with comprehensive reports and visual analytics.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is protected with industry-standard security measures.'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant updates and notifications about your financial activities.'
    }
  ]

  const handleDemoLogin = async () => {
    await demoLogin()
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Take Control of Your{' '}
              <span className="text-yellow-300">Financial Future</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              WealthWise helps you track expenses, manage budgets, and achieve your financial goals 
              with our comprehensive personal finance management platform.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Get Started Free
                </Link>
                <button 
                  onClick={handleDemoLogin}
                  className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
                >
                  Try Demo
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link to="/dashboard" className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Financial Management Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your personal finances in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="feature-card bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Icon size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              WealthWise is built using cutting-edge web technologies as part of the 
              Codveda Full-Stack Development Internship Program.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="tech-item text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">R</span>
                </div>
                <p className="text-sm font-medium text-gray-700">React 18</p>
              </div>
              <div className="tech-item text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">V</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Vite</p>
              </div>
              <div className="tech-item text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">N</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Node.js</p>
              </div>
              <div className="tech-item text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">P</span>
                </div>
                <p className="text-sm font-medium text-gray-700">PostgreSQL</p>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn btn-primary px-8 py-3">
                  Start Your Journey
                </Link>
                <Link to="/login" className="btn btn-outline px-8 py-3">
                  Already Have Account?
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage