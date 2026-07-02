import { useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { ACTION_TYPES } from '../context/AppContext'
import { authService } from '../services/authService'
import { useNotification } from './useNotification'

export function useAuth() {
  const { state, dispatch } = useApp()
  const { showNotification } = useNotification()

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true })

      const response = await authService.login(credentials)
      
      if (response.success) {
        // Store token
        localStorage.setItem('wealthwise_token', response.token)
        
        // Update state
        dispatch({
          type: ACTION_TYPES.LOGIN_SUCCESS,
          payload: { user: response.user }
        })

        showNotification({
          type: 'success',
          title: 'Welcome back!',
          message: `Successfully logged in as ${response.user.full_name}`
        })

        return { success: true }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      dispatch({ type: ACTION_TYPES.LOGIN_FAILURE })
      
      showNotification({
        type: 'error',
        title: 'Login Failed',
        message: error.message || 'Please check your credentials and try again'
      })

      return { success: false, error: error.message }
    }
  }, [dispatch, showNotification])

  // Register function
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true })

      const response = await authService.register(userData)
      
      if (response.success) {
        // Store token
        localStorage.setItem('wealthwise_token', response.token)
        
        // Update state
        dispatch({
          type: ACTION_TYPES.LOGIN_SUCCESS,
          payload: { user: response.user }
        })

        showNotification({
          type: 'success',
          title: 'Account Created!',
          message: `Welcome to WealthWise, ${response.user.full_name}!`
        })

        return { success: true }
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      
      dispatch({ type: ACTION_TYPES.LOGIN_FAILURE })
      
      showNotification({
        type: 'error',
        title: 'Registration Failed',
        message: error.message || 'Please check your information and try again'
      })

      return { success: false, error: error.message }
    }
  }, [dispatch, showNotification])

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call API logout if needed
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local state
      dispatch({ type: ACTION_TYPES.LOGOUT })
      
      showNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out'
      })
    }
  }, [dispatch, showNotification])

  // Update user profile
  const updateUser = useCallback(async (updates) => {
    try {
      const response = await authService.updateProfile(updates)
      
      if (response.success) {
        dispatch({
          type: ACTION_TYPES.UPDATE_USER,
          payload: response.user
        })

        showNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been successfully updated'
        })

        return { success: true }
      } else {
        throw new Error(response.message || 'Update failed')
      }
    } catch (error) {
      console.error('Update user error:', error)
      
      showNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Failed to update profile'
      })

      return { success: false, error: error.message }
    }
  }, [dispatch, showNotification])

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    if (!state.user) return false
    
    // For now, all authenticated users have all permissions
    // This can be expanded for role-based access control
    return state.isAuthenticated
  }, [state.user, state.isAuthenticated])

  // Demo login function
  const demoLogin = useCallback(async () => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true })

      // Simulate demo user
      const demoUser = {
        id: 'demo-user',
        full_name: 'Demo User',
        email: 'demo@wealthwise.app',
        created_at: new Date().toISOString()
      }

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store demo token
      localStorage.setItem('wealthwise_token', 'demo-token-123')
      
      // Update state
      dispatch({
        type: ACTION_TYPES.LOGIN_SUCCESS,
        payload: { user: demoUser }
      })

      showNotification({
        type: 'success',
        title: 'Demo Mode',
        message: 'You are now using WealthWise in demo mode'
      })

      return { success: true }
    } catch (error) {
      console.error('Demo login error:', error)
      
      dispatch({ type: ACTION_TYPES.LOGIN_FAILURE })
      
      showNotification({
        type: 'error',
        title: 'Demo Login Failed',
        message: 'Unable to start demo mode'
      })

      return { success: false, error: error.message }
    }
  }, [dispatch, showNotification])

  return {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    demoLogin,
    
    // Utilities
    hasPermission
  }
}