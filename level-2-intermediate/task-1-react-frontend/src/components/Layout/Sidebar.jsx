import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  PlusCircle, 
  MinusCircle, 
  Calculator, 
  BarChart3,
  User,
  Settings
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

function Sidebar() {
  const { state } = useApp()

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/income', icon: PlusCircle, label: 'Income' },
    { to: '/expenses', icon: MinusCircle, label: 'Expenses' },
    { to: '/budgets', icon: Calculator, label: 'Budgets' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside 
      className={`sidebar fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        state.sidebar.isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <nav className="sidebar-nav p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {state.sidebar.isOpen && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar