/* ==========================================================================
   Utility Functions
   ========================================================================== */

// Utility namespace
const Utils = {
    
    /* ==========================================================================
       DOM Manipulation
       ========================================================================== */
    
    // Get element by ID
    getElementById: (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID '${id}' not found`);
        }
        return element;
    },

    // Get elements by class name
    getElementsByClass: (className) => {
        return Array.from(document.getElementsByClassName(className));
    },

    // Query selector with error handling
    querySelector: (selector) => {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.error(`Invalid selector: ${selector}`, error);
            return null;
        }
    },

    // Query all selectors
    querySelectorAll: (selector) => {
        try {
            return Array.from(document.querySelectorAll(selector));
        } catch (error) {
            console.error(`Invalid selector: ${selector}`, error);
            return [];
        }
    },

    // Add event listener with error handling
    addEventListener: (element, event, handler, options = {}) => {
        if (element && typeof handler === 'function') {
            element.addEventListener(event, handler, options);
        } else {
            console.warn('Invalid element or handler for event listener');
        }
    },

    // Remove event listener
    removeEventListener: (element, event, handler, options = {}) => {
        if (element && typeof handler === 'function') {
            element.removeEventListener(event, handler, options);
        }
    },

    // Toggle class
    toggleClass: (element, className) => {
        if (element && element.classList) {
            element.classList.toggle(className);
            return element.classList.contains(className);
        }
        return false;
    },

    // Add class
    addClass: (element, className) => {
        if (element && element.classList) {
            element.classList.add(className);
        }
    },

    // Remove class
    removeClass: (element, className) => {
        if (element && element.classList) {
            element.classList.remove(className);
        }
    },

    // Check if element has class
    hasClass: (element, className) => {
        return element && element.classList && element.classList.contains(className);
    },

    /* ==========================================================================
       String Utilities
       ========================================================================== */
    
    // Capitalize first letter
    capitalize: (str) => {
        if (typeof str !== 'string' || str.length === 0) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Convert to title case
    titleCase: (str) => {
        if (typeof str !== 'string') return '';
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    // Generate random string
    randomString: (length = 10) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // Truncate string
    truncate: (str, length = 50, suffix = '...') => {
        if (typeof str !== 'string') return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },

    // Remove HTML tags
    stripHtml: (str) => {
        if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.innerHTML = str;
        return div.textContent || div.innerText || '';
    },

    /* ==========================================================================
       Number and Currency Utilities
       ========================================================================== */
    
    // Format currency
    formatCurrency: (amount, options = {}) => {
        const {
            currency = APP_CONFIG.ui.currency.code,
            locale = APP_CONFIG.ui.currency.locale,
            minimumFractionDigits = 2,
            maximumFractionDigits = 2
        } = options;

        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits,
                maximumFractionDigits
            }).format(Number(amount) || 0);
        } catch (error) {
            console.error('Currency formatting error:', error);
            return `${APP_CONFIG.ui.currency.symbol}${Number(amount).toFixed(2)}`;
        }
    },

    // Format number with commas
    formatNumber: (num, decimals = 0) => {
        const number = Number(num) || 0;
        return number.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    // Parse currency string to number
    parseCurrency: (str) => {
        if (typeof str === 'number') return str;
        if (typeof str !== 'string') return 0;
        
        // Remove currency symbols and spaces
        const cleaned = str.replace(/[^0-9.-]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    },

    // Calculate percentage
    calculatePercentage: (value, total, decimals = 1) => {
        if (total === 0) return 0;
        const percentage = (value / total) * 100;
        return Number(percentage.toFixed(decimals));
    },

    /* ==========================================================================
       Date Utilities
       ========================================================================== */
    
    // Format date
    formatDate: (date, format = APP_CONFIG.dateFormats.display) => {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return format
            .replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day);
    },

    // Get relative time
    getRelativeTime: (date) => {
        if (!date) return '';
        
        const now = new Date();
        const target = new Date(date);
        const diffMs = now.getTime() - target.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
        if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
        
        return Utils.formatDate(date);
    },

    // Get current month date range
    getCurrentMonthRange: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        return {
            start: Utils.formatDate(startDate, APP_CONFIG.dateFormats.api),
            end: Utils.formatDate(endDate, APP_CONFIG.dateFormats.api)
        };
    },

    /* ==========================================================================
       Validation Utilities
       ========================================================================== */
    
    // Validate email
    isValidEmail: (email) => {
        return APP_CONFIG.validation.email.pattern.test(email);
    },

    // Validate password
    isValidPassword: (password) => {
        return password && 
               password.length >= APP_CONFIG.validation.password.minLength &&
               APP_CONFIG.validation.password.pattern.test(password);
    },

    // Validate amount
    isValidAmount: (amount) => {
        const num = Number(amount);
        return !isNaN(num) && 
               num >= APP_CONFIG.validation.amount.min && 
               num <= APP_CONFIG.validation.amount.max &&
               APP_CONFIG.validation.amount.pattern.test(amount.toString());
    },

    // Validate required field
    isRequired: (value) => {
        return value !== null && value !== undefined && String(value).trim().length > 0;
    },

    /* ==========================================================================
       Local Storage Utilities
       ========================================================================== */
    
    // Set item in localStorage
    setLocalStorage: (key, value) => {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Get item from localStorage
    getLocalStorage: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            return JSON.parse(item);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    // Remove item from localStorage
    removeLocalStorage: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    // Clear all localStorage
    clearLocalStorage: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    /* ==========================================================================
       Array Utilities
       ========================================================================== */
    
    // Group array by key
    groupBy: (array, key) => {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    },

    // Sort array by key
    sortBy: (array, key, direction = 'asc') => {
        return array.sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (direction === 'desc') {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        });
    },

    // Get unique values
    unique: (array, key) => {
        if (key) {
            return array.filter((item, index, self) => 
                index === self.findIndex(t => t[key] === item[key])
            );
        }
        return [...new Set(array)];
    },

    /* ==========================================================================
       Async Utilities
       ========================================================================== */
    
    // Debounce function
    debounce: (func, wait, immediate = false) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Delay execution
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    /* ==========================================================================
       Error Handling
       ========================================================================== */
    
    // Log error
    logError: (error, context = '') => {
        const errorInfo = {
            message: error.message || error,
            stack: error.stack,
            context: context,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        if (APP_CONFIG.debug.enabled && APP_CONFIG.debug.logToConsole) {
            console.error('Application Error:', errorInfo);
        }

        if (APP_CONFIG.debug.logToStorage) {
            Utils.setLocalStorage('app_errors', [
                ...Utils.getLocalStorage('app_errors', []),
                errorInfo
            ].slice(-50)); // Keep last 50 errors
        }
    },

    /* ==========================================================================
       Color Utilities
       ========================================================================== */
    
    // Generate color based on string
    stringToColor: (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 50%)`;
    },

    // Convert hex to RGB
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};

// Export Utils
window.Utils = Utils;

// Freeze to prevent modifications
Object.freeze(Utils);