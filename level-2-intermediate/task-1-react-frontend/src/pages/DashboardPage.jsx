import React, { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, TrendingDown, Target, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'

function DashboardPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    budgetUsage: 0,
    netSavings: 0
  })

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats({
        monthlyIncome: 5420.00,
        monthlyExpenses: 3180.50,
        budgetUsage: 68,
        netSavings: 2239.50
      })
      setIsLoading(false)
    }
    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" text="Loading your dashboard..." />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Monthly Income',
      value: `$${stats.monthlyIncome.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+12% from last month'
    },
    {
      title: 'Monthly Expenses',
      value: `$${stats.monthlyExpenses.toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: '-5% from last month'
    },
    {
      title: 'Budget Usage',
      value: `${stats.budgetUsage}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'On track this month'
    },
    {
      title: 'Net Savings',
      value: `$${stats.netSavings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+18% from last month'
    }
  ]

  const quickActions = [
    { title: 'Add Income', to: '/income', color: 'bg-green-600' },
    { title: 'Record Expense', to: '/expenses', color: 'bg-red-600' },
    { title: 'Create Budget', to: '/budgets', color: 'bg-blue-600' },
    { title: 'View Reports', to: '/reports', color: 'bg-purple-600' }
  ]

  return (
    <div className="dashboard-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-4`}>
                <Icon size={24} className={stat.color} />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.trend}</p>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.to}
                className={`flex items-center justify-center p-3 rounded-lg text-white font-medium ${action.color} hover:opacity-90 transition-opacity`}
              >
                <Plus size={16} className="mr-2" />
                {action.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {[
              { label: 'Salary', date: 'Dec 1, 2024', amount: '+$3,200', positive: true },
              { label: 'Groceries', date: 'Dec 2, 2024', amount: '-$120.50', positive: false },
              { label: 'Transportation', date: 'Dec 3, 2024', amount: '-$45.00', positive: false }
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${tx.positive ? 'bg-green-100' : 'bg-red-100'}`}>
                    {tx.positive
                      ? <TrendingUp size={14} className="text-green-600" />
                      : <TrendingDown size={14} className="text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.label}</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-semibold ${tx.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link to="/expenses" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all transactions →
            </Link>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
          <div className="space-y-4">
            {[
              { label: 'Food & Dining', spent: 320, total: 500, color: 'bg-blue-600' },
              { label: 'Transportation', spent: 180, total: 300, color: 'bg-green-500' },
              { label: 'Entertainment', spent: 150, total: 200, color: 'bg-yellow-500' }
            ].map((budget, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{budget.label}</span>
                  <span className="text-sm text-gray-500">${budget.spent} / ${budget.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${budget.color} h-2 rounded-full`}
                    style={{ width: `${(budget.spent / budget.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link to="/budgets" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Manage budgets →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
