import axios from 'axios'

class ApiClient {
  constructor() {
    // Create axios instance
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('wealthwise_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Log request in development
        if (import.meta.env.DEV) {
          console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`, config.data)
        }
        
        return config
      },
      (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
        }
        
        return response
      },
      (error) => {
        // Handle common errors
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response
          
          switch (status) {
            case 401:
              // Unauthorized - clear token and redirect to login
              localStorage.removeItem('wealthwise_token')
              if (window.location.pathname !== '/login') {
                window.location.href = '/login'
              }
              break
            case 403:
              // Forbidden
              console.error('Access forbidden')
              break
            case 404:
              // Not found
              console.error('Resource not found')
              break
            case 500:
              // Server error
              console.error('Server error')
              break
          }
          
          // Log error in development
          if (import.meta.env.DEV) {
            console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
              status,
              data,
              message: error.message
            })
          }
          
          // Enhance error with response data
          error.message = data?.message || error.message
        } else if (error.request) {
          // Network error
          console.error('Network error:', error.message)
          error.message = 'Network error. Please check your connection.'
        } else {
          // Other error
          console.error('Request setup error:', error.message)
        }
        
        return Promise.reject(error)
      }
    )
  }

  // Set authorization token
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.Authorization = `Bearer ${token}`
    } else {
      delete this.client.defaults.headers.Authorization
    }
  }

  // Generic request method
  async request(config) {
    try {
      const response = await this.client.request(config)
      return response
    } catch (error) {
      throw error
    }
  }

  // GET request
  async get(url, config = {}) {
    return this.request({
      method: 'GET',
      url,
      ...config
    })
  }

  // POST request
  async post(url, data = {}, config = {}) {
    return this.request({
      method: 'POST',
      url,
      data,
      ...config
    })
  }

  // PUT request
  async put(url, data = {}, config = {}) {
    return this.request({
      method: 'PUT',
      url,
      data,
      ...config
    })
  }

  // PATCH request
  async patch(url, data = {}, config = {}) {
    return this.request({
      method: 'PATCH',
      url,
      data,
      ...config
    })
  }

  // DELETE request
  async delete(url, config = {}) {
    return this.request({
      method: 'DELETE',
      url,
      ...config
    })
  }

  // Upload file
  async upload(url, file, onUploadProgress = null) {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    })
  }

  // Download file
  async download(url, filename = null) {
    try {
      const response = await this.get(url, {
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      return response
    } catch (error) {
      throw error
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.get('/health')
      return {
        isOnline: true,
        ...response.data
      }
    } catch (error) {
      return {
        isOnline: false,
        error: error.message
      }
    }
  }

  // Get API info
  async getApiInfo() {
    try {
      const response = await this.get('/info')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient()

// Export the class for testing purposes
export { ApiClient }