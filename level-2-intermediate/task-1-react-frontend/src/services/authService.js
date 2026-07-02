import { apiClient } from './apiClient'

class AuthService {
  constructor() {
    this.tokenKey = 'wealthwise_token'
  }

  // Get stored token
  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  // Set token
  setToken(token) {
    localStorage.setItem(this.tokenKey, token)
    apiClient.setAuthToken(token)
  }

  // Remove token
  removeToken() {
    localStorage.removeItem(this.tokenKey)
    apiClient.setAuthToken(null)
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken()
    return !!token
  }

  // Login user
  async login(credentials) {
    try {
      // For demo purposes, we'll simulate login
      // In production, this would call the real API
      if (credentials.email && credentials.password === 'demo123') {
        const demoUser = {
          id: 1,
          full_name: credentials.email.split('@')[0].replace('.', ' '),
          email: credentials.email,
          created_at: new Date().toISOString()
        }

        const token = 'demo-jwt-token-' + Date.now()
        this.setToken(token)

        return {
          success: true,
          user: demoUser,
          token: token
        }
      }

      // Try to call real API if available
      const response = await apiClient.post('/auth/login', credentials)
      
      if (response.data.success) {
        this.setToken(response.data.token)
        return response.data
      }
      
      throw new Error(response.data.message || 'Login failed')
    } catch (error) {
      // If API is not available, fall back to demo mode for certain emails
      if (error.code === 'ECONNREFUSED' || error.response?.status === 404) {
        if (credentials.email && credentials.password === 'demo123') {
          const demoUser = {
            id: 1,
            full_name: credentials.email.split('@')[0].replace('.', ' '),
            email: credentials.email,
            created_at: new Date().toISOString()
          }

          const token = 'demo-jwt-token-' + Date.now()
          this.setToken(token)

          return {
            success: true,
            user: demoUser,
            token: token
          }
        }
      }
      
      throw error
    }
  }

  // Register user
  async register(userData) {
    try {
      // For demo purposes, simulate registration
      const demoUser = {
        id: Date.now(),
        full_name: userData.full_name,
        email: userData.email,
        created_at: new Date().toISOString()
      }

      const token = 'demo-jwt-token-' + Date.now()
      this.setToken(token)

      return {
        success: true,
        user: demoUser,
        token: token
      }

      // Uncomment for real API call:
      // const response = await apiClient.post('/auth/register', userData)
      // 
      // if (response.data.success) {
      //   this.setToken(response.data.token)
      //   return response.data
      // }
      // 
      // throw new Error(response.data.message || 'Registration failed')
    } catch (error) {
      throw error
    }
  }

  // Logout user
  async logout() {
    try {
      // Call API logout endpoint if available
      const token = this.getToken()
      if (token) {
        try {
          await apiClient.post('/auth/logout')
        } catch (error) {
          // Ignore logout API errors
          console.warn('Logout API call failed:', error.message)
        }
      }
    } finally {
      // Always clear local token
      this.removeToken()
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh')
      
      if (response.data.success) {
        this.setToken(response.data.token)
        return response.data
      }
      
      throw new Error('Token refresh failed')
    } catch (error) {
      // If refresh fails, logout user
      this.removeToken()
      throw error
    }
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      // For demo purposes, simulate update
      return {
        success: true,
        user: updates
      }

      // Uncomment for real API call:
      // const response = await apiClient.put('/auth/profile', updates)
      // return response.data
    } catch (error) {
      throw error
    }
  }

  // Change password
  async changePassword(passwords) {
    try {
      const response = await apiClient.put('/auth/password', passwords)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password: newPassword
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await apiClient.post('/auth/verify-email', { token })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const authService = new AuthService()