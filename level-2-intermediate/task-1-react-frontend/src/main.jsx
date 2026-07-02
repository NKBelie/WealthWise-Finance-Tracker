import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import './styles/index.css'

// Error boundary for development
if (import.meta.env.DEV) {
  console.log('🚀 WealthWise React Frontend - Level 2 Task 1')
  console.log('📋 Environment:', import.meta.env.MODE)
  console.log('🔗 API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)