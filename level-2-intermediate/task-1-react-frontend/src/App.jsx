import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'
import ErrorBoundary from './components/UI/ErrorBoundary'

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const IncomePage = React.lazy(() => import('./pages/IncomePage'))
const ExpensesPage = React.lazy(() => import('./pages/ExpensesPage'))
const BudgetsPage = React.lazy(() => import('./pages/BudgetsPage'))
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))
const LoginPage = React.lazy(() => import('./pages/LoginPage'))
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <LoginPage />
                </Suspense>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <RegisterPage />
                </Suspense>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route index element={<HomePage />} />
                    <Route 
                      path="dashboard" 
                      element={
                        isAuthenticated ? (
                          <DashboardPage />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      } 
                    />
                    <Route 
                      path="income" 
                      element={
                        isAuthenticated ? (
                          <IncomePage />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      } 
                    />
                    <Route 
                      path="expenses" 
                      element={
                        isAuthenticated ? (
                          <ExpensesPage />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      } 
                    />
                    <Route 
                      path="budgets" 
                      element={
                        isAuthenticated ? (
                          <BudgetsPage />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      } 
                    />
                    <Route 
                      path="reports" 
                      element={
                        isAuthenticated ? (
                          <ReportsPage />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      } 
                    />
                    <Route 
                      path="profile" 
                      element={
                        isAuthenticated ? (
                          <ProfilePage />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      } 
                    />
                  </Routes>
                </Suspense>
              </Layout>
            } 
          />

          {/* 404 Route */}
          <Route 
            path="*" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <NotFoundPage />
              </Suspense>
            } 
          />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}

export default App