import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import NotificationContainer from '../UI/NotificationContainer'
import { useApp } from '../../context/AppContext'

function Layout({ children }) {
  const { state } = useApp()

  return (
    <div className="layout min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      <div className="layout-body flex">
        {/* Sidebar - only show when authenticated */}
        {state.isAuthenticated && <Sidebar />}
        
        {/* Main content area */}
        <main 
          className={`main-content flex-1 transition-all duration-300 ${
            state.isAuthenticated 
              ? state.sidebar.isOpen 
                ? 'ml-64' 
                : 'ml-16'
              : 'ml-0'
          }`}
        >
          <div className="content-wrapper p-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Notifications */}
      <NotificationContainer />
    </div>
  )
}

export default Layout