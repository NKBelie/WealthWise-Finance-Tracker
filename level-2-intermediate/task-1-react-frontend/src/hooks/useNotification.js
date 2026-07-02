import { useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { ACTION_TYPES } from '../context/AppContext'

export function useNotification() {
  const { state, dispatch } = useApp()

  // Show notification
  const showNotification = useCallback((notification) => {
    const notificationData = {
      type: 'info',
      title: '',
      message: '',
      duration: 5000, // 5 seconds default
      ...notification
    }

    dispatch({
      type: ACTION_TYPES.ADD_NOTIFICATION,
      payload: notificationData
    })

    // Auto-dismiss notification
    if (notificationData.duration > 0) {
      setTimeout(() => {
        dispatch({
          type: ACTION_TYPES.REMOVE_NOTIFICATION,
          payload: notificationData.id
        })
      }, notificationData.duration)
    }

    return notificationData.id
  }, [dispatch])

  // Remove specific notification
  const removeNotification = useCallback((id) => {
    dispatch({
      type: ACTION_TYPES.REMOVE_NOTIFICATION,
      payload: id
    })
  }, [dispatch])

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    dispatch({
      type: ACTION_TYPES.CLEAR_NOTIFICATIONS
    })
  }, [dispatch])

  // Convenience methods for different notification types
  const showSuccess = useCallback((title, message, options = {}) => {
    return showNotification({
      type: 'success',
      title,
      message,
      ...options
    })
  }, [showNotification])

  const showError = useCallback((title, message, options = {}) => {
    return showNotification({
      type: 'error',
      title,
      message,
      duration: 7000, // Errors stay longer
      ...options
    })
  }, [showNotification])

  const showWarning = useCallback((title, message, options = {}) => {
    return showNotification({
      type: 'warning',
      title,
      message,
      ...options
    })
  }, [showNotification])

  const showInfo = useCallback((title, message, options = {}) => {
    return showNotification({
      type: 'info',
      title,
      message,
      ...options
    })
  }, [showNotification])

  return {
    notifications: state.notifications,
    showNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}