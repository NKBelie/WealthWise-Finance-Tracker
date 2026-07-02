import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state
const initialState = {
  // Authentication
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  // Financial Data
  transactions: [],
  income: [],
  expenses: [],
  budgets: [],
  
  // UI State
  notifications: [],
  theme: 'light',
  sidebar: {
    isOpen: false,
    isMobile: false
  },
  
  // API State
  api: {
    isOnline: true,
    lastSync: null
  }
}

// Action types
export const ACTION_TYPES = {
  // Authentication
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  
  // Financial Data
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  
  SET_INCOME: 'SET_INCOME',
  ADD_INCOME: 'ADD_INCOME',
  UPDATE_INCOME: 'UPDATE_INCOME',
  DELETE_INCOME: 'DELETE_INCOME',
  
  SET_EXPENSES: 'SET_EXPENSES',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  
  SET_BUDGETS: 'SET_BUDGETS',
  ADD_BUDGET: 'ADD_BUDGET',
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  DELETE_BUDGET: 'DELETE_BUDGET',
  
  // UI Actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  SET_THEME: 'SET_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR_MOBILE: 'SET_SIDEBAR_MOBILE',
  
  // API Actions
  SET_API_STATUS: 'SET_API_STATUS',
  SET_LAST_SYNC: 'SET_LAST_SYNC'
}

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false
      }
    
    case ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false
      }
    
    case ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
        theme: state.theme
      }
    
    case ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    
    case ACTION_TYPES.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload }
    
    case ACTION_TYPES.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      }
    
    case ACTION_TYPES.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        )
      }
    
    case ACTION_TYPES.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      }
    
    case ACTION_TYPES.SET_INCOME:
      return { ...state, income: action.payload }
    
    case ACTION_TYPES.ADD_INCOME:
      return {
        ...state,
        income: [...state.income, action.payload]
      }
    
    case ACTION_TYPES.UPDATE_INCOME:
      return {
        ...state,
        income: state.income.map(i =>
          i.id === action.payload.id ? { ...i, ...action.payload } : i
        )
      }
    
    case ACTION_TYPES.DELETE_INCOME:
      return {
        ...state,
        income: state.income.filter(i => i.id !== action.payload)
      }
    
    case ACTION_TYPES.SET_EXPENSES:
      return { ...state, expenses: action.payload }
    
    case ACTION_TYPES.ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, action.payload]
      }
    
    case ACTION_TYPES.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(e =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        )
      }
    
    case ACTION_TYPES.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(e => e.id !== action.payload)
      }
    
    case ACTION_TYPES.SET_BUDGETS:
      return { ...state, budgets: action.payload }
    
    case ACTION_TYPES.ADD_BUDGET:
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      }
    
    case ACTION_TYPES.UPDATE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.map(b =>
          b.id === action.payload.id ? { ...b, ...action.payload } : b
        )
      }
    
    case ACTION_TYPES.DELETE_BUDGET:
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload)
      }
    
    case ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now() + Math.random(),
          ...action.payload,
          timestamp: new Date()
        }]
      }
    
    case ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    case ACTION_TYPES.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] }
    
    case ACTION_TYPES.SET_THEME:
      return { ...state, theme: action.payload }
    
    case ACTION_TYPES.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen }
      }
    
    case ACTION_TYPES.SET_SIDEBAR_MOBILE:
      return {
        ...state,
        sidebar: { ...state.sidebar, isMobile: action.payload }
      }
    
    case ACTION_TYPES.SET_API_STATUS:
      return {
        ...state,
        api: { ...state.api, isOnline: action.payload }
      }
    
    case ACTION_TYPES.SET_LAST_SYNC:
      return {
        ...state,
        api: { ...state.api, lastSync: action.payload }
      }
    
    default:
      return state
  }
}

// Create contexts
const AppStateContext = createContext()
const AppDispatchContext = createContext()

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize app on mount
  useEffect(() => {
    // Check for saved user session
    const initializeApp = () => {
      try {
        const savedUser = localStorage.getItem('wealthwise_user')
        const savedToken = localStorage.getItem('wealthwise_token')
        
        if (savedUser && savedToken) {
          dispatch({
            type: ACTION_TYPES.LOGIN_SUCCESS,
            payload: { user: JSON.parse(savedUser) }
          })
        } else {
          dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false })
        }
        
        // Load theme preference
        const savedTheme = localStorage.getItem('wealthwise_theme')
        if (savedTheme) {
          dispatch({ type: ACTION_TYPES.SET_THEME, payload: savedTheme })
        }
        
      } catch (error) {
        console.error('Error initializing app:', error)
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false })
      }
    }

    // Check if app is online
    const handleOnline = () => {
      dispatch({ type: ACTION_TYPES.SET_API_STATUS, payload: true })
    }
    
    const handleOffline = () => {
      dispatch({ type: ACTION_TYPES.SET_API_STATUS, payload: false })
    }

    // Initialize
    initializeApp()
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Save user session when authentication state changes
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      localStorage.setItem('wealthwise_user', JSON.stringify(state.user))
    } else {
      localStorage.removeItem('wealthwise_user')
      localStorage.removeItem('wealthwise_token')
    }
  }, [state.isAuthenticated, state.user])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('wealthwise_theme', state.theme)
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

// Custom hooks for consuming context
export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider')
  }
  return context
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext)
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider')
  }
  return context
}

// Combined hook for convenience
export function useApp() {
  return {
    state: useAppState(),
    dispatch: useAppDispatch()
  }
}