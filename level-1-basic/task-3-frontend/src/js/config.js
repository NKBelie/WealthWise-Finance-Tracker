/* ==========================================================================
   Application Configuration
   ========================================================================== */

// Application Configuration
const APP_CONFIG = {
    // Application Information
    name: 'WealthWise',
    version: '1.0.0',
    description: 'Smart Personal Finance Tracker',
    
    // API Configuration
    api: {
        baseUrl: 'http://localhost:5000',
        timeout: 10000,
        retryAttempts: 3,
        retryDelay: 1000
    },
    
    // API Endpoints
    endpoints: {
        // Authentication
        auth: {
            login: '/api/auth/login',
            register: '/api/auth/register',
            refresh: '/api/auth/refresh',
            logout: '/api/auth/logout'
        },
        
        // System
        health: '/api/health',
        info: '/api/info',
        stats: '/api/stats',
        
        // Users
        users: {
            base: '/api/users',
            byId: (id) => `/api/users/${id}`,
            profile: '/api/users/profile'
        },
        
        // Income
        income: {
            base: '/api/income',
            byId: (id) => `/api/income/${id}`,
            byUser: (userId) => `/api/income?user_id=${userId}`,
            byDateRange: (userId, startDate, endDate) => 
                `/api/income?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`
        },
        
        // Expenses
        expenses: {
            base: '/api/expenses',
            byId: (id) => `/api/expenses/${id}`,
            byUser: (userId) => `/api/expenses?user_id=${userId}`,
            byCategory: (userId, category) => 
                `/api/expenses?user_id=${userId}&category=${category}`,
            byDateRange: (userId, startDate, endDate) => 
                `/api/expenses?user_id=${userId}&start_date=${startDate}&end_date=${endDate}`
        },
        
        // Budgets
        budgets: {
            base: '/api/budgets',
            byId: (id) => `/api/budgets/${id}`,
            byUser: (userId) => `/api/budgets?user_id=${userId}`,
            progress: (id) => `/api/budgets/${id}/progress`,
            sync: (id) => `/api/budgets/${id}/sync`,
            spending: (id) => `/api/budgets/${id}/spending`,
            toggle: (id) => `/api/budgets/${id}/toggle`,
            summary: (userId) => `/api/budgets/users/${userId}/summary`,
            alerts: (userId) => `/api/budgets/users/${userId}/alerts`,
            bulk: '/api/budgets/bulk',
            current: (userId) => `/api/budgets?user_id=${userId}&current_period=true`
        }
    },
    
    // Local Storage Keys
    storage: {
        token: 'wealthwise_token',
        refreshToken: 'wealthwise_refresh_token',
        user: 'wealthwise_user',
        preferences: 'wealthwise_preferences',
        theme: 'wealthwise_theme'
    },
    
    // UI Configuration
    ui: {
        // Pagination
        defaultPageSize: 10,
        maxPageSize: 50,
        
        // Notifications
        notificationTimeout: 5000,
        maxNotifications: 5,
        
        // Animation Durations
        animationDuration: {
            fast: 150,
            normal: 300,
            slow: 500
        },
        
        // Chart Colors
        chartColors: {
            primary: '#3b82f6',
            secondary: '#10b981',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4',
            gray: '#6b7280'
        },
        
        // Currency Settings
        currency: {
            symbol: '$',
            code: 'USD',
            locale: 'en-US'
        }
    },
    
    // Form Validation Rules
    validation: {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        password: {
            minLength: 8,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
        },
        name: {
            minLength: 2,
            maxLength: 100,
            pattern: /^[a-zA-Z\s'-]+$/,
            message: 'Name must contain only letters, spaces, hyphens, and apostrophes'
        },
        amount: {
            min: 0.01,
            max: 999999999.99,
            pattern: /^\d+(\.\d{1,2})?$/,
            message: 'Amount must be a positive number with up to 2 decimal places'
        }
    },
    
    // Date and Time Formats
    dateFormats: {
        display: 'MM/dd/yyyy',
        api: 'yyyy-MM-dd',
        timestamp: 'yyyy-MM-dd HH:mm:ss'
    },
    
    // Feature Flags
    features: {
        darkMode: true,
        notifications: true,
        charts: true,
        exports: true,
        budgetAlerts: true,
        recurringTransactions: true
    },
    
    // Debug Settings
    debug: {
        enabled: true,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        logToConsole: true,
        logToStorage: false
    }
};

// Environment-specific overrides
if (window.location.hostname === 'localhost') {
    APP_CONFIG.debug.enabled = true;
    APP_CONFIG.debug.logLevel = 'debug';
} else {
    APP_CONFIG.debug.enabled = false;
    APP_CONFIG.debug.logLevel = 'error';
}

// Export configuration
window.APP_CONFIG = APP_CONFIG;

// Freeze configuration to prevent modifications
Object.freeze(APP_CONFIG);