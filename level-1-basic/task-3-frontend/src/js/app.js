/* ==========================================================================
   Main Application
   ========================================================================== */

// Application class for coordinating all modules
class WealthWiseApp {
    
    constructor() {
        this.isInitialized = false;
        this.modules = {};
        this.startTime = Date.now();
        
        this.init();
    }

    /* ==========================================================================
       Initialization
       ========================================================================== */
    
    async init() {
        try {
            // Show loading spinner
            this.showLoadingSpinner();
            
            // Initialize core modules
            await this.initializeModules();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Check API health
            await this.checkAPIHealth();
            
            // Hide loading spinner
            this.hideLoadingSpinner();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Log initialization
            this.logInitialization();
            
            // Show welcome message
            this.showWelcomeMessage();
            
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    async initializeModules() {
        // Initialize modules in order
        const initPromises = [
            this.initUtils(),
            this.initAPI(),
            this.initAuth(),
            this.initNavigation(),
            this.initNotifications(),
            this.initDashboard(),
            this.initTheme()
        ];

        await Promise.all(initPromises);
    }

    /* ==========================================================================
       Module Initialization
       ========================================================================== */
    
    async initUtils() {
        this.modules.utils = window.Utils;
        if (APP_CONFIG.debug.enabled) {
            console.log('✓ Utils module initialized');
        }
    }

    async initAPI() {
        this.modules.api = window.API;
        if (APP_CONFIG.debug.enabled) {
            console.log('✓ API module initialized');
        }
    }

    async initAuth() {
        this.modules.auth = window.AuthManager;
        if (APP_CONFIG.debug.enabled) {
            console.log('✓ Authentication module initialized');
        }
    }

    async initNavigation() {
        this.modules.navigation = window.NavigationManager;
        if (APP_CONFIG.debug.enabled) {
            console.log('✓ Navigation module initialized');
        }
    }

    async initNotifications() {
        this.modules.notifications = window.NotificationManager;
        if (APP_CONFIG.debug.enabled) {
            console.log('✓ Notification module initialized');
        }
    }

    async initDashboard() {
        // Dashboard will be initialized when needed
        if (APP_CONFIG.debug.enabled) {
            console.log('✓ Dashboard module ready');
        }
    }

    async initTheme() {
        this.loadTheme();
        if (APP_CONFIG.debug.enabled) {
            console.log('✓ Theme module initialized');
        }
    }

    /* ==========================================================================
       Loading Management
       ========================================================================== */
    
    showLoadingSpinner() {
        const spinner = Utils.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'flex';
            Utils.removeClass(spinner, 'hidden');
        }
    }

    hideLoadingSpinner() {
        const spinner = Utils.getElementById('loadingSpinner');
        if (spinner) {
            Utils.addClass(spinner, 'hidden');
            
            // Hide after animation
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 300);
        }
    }

    /* ==========================================================================
       Event Listeners
       ========================================================================== */
    
    setupEventListeners() {
        // Global error handling
        window.addEventListener('error', (e) => {
            Utils.logError(e.error, 'Global Error Handler');
            if (window.NotificationManager) {
                window.NotificationManager.error('An unexpected error occurred');
            }
        });

        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (e) => {
            Utils.logError(e.reason, 'Unhandled Promise Rejection');
            if (window.NotificationManager) {
                window.NotificationManager.error('An unexpected error occurred');
            }
            e.preventDefault(); // Prevent console error
        });

        // Online/Offline status
        window.addEventListener('online', () => {
            if (window.NotificationManager) {
                window.NotificationManager.success('Connection restored', {
                    timeout: 3000
                });
            }
        });

        window.addEventListener('offline', () => {
            if (window.NotificationManager) {
                window.NotificationManager.networkError();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Before unload
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts if no input is focused
        const focusedElement = document.activeElement;
        const isInputFocused = focusedElement && 
            (focusedElement.tagName === 'INPUT' || 
             focusedElement.tagName === 'TEXTAREA' || 
             focusedElement.contentEditable === 'true');

        if (isInputFocused) return;

        // Keyboard shortcuts with Ctrl/Cmd
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'h':
                    e.preventDefault();
                    window.NavigationManager?.goToHome();
                    break;
                case 'd':
                    e.preventDefault();
                    window.NavigationManager?.goToDashboard();
                    break;
                case 'i':
                    e.preventDefault();
                    window.NavigationManager?.goToIncome();
                    break;
                case 'e':
                    e.preventDefault();
                    window.NavigationManager?.goToExpenses();
                    break;
                case 'b':
                    e.preventDefault();
                    window.NavigationManager?.goToBudgets();
                    break;
                case 'r':
                    e.preventDefault();
                    window.NavigationManager?.goToReports();
                    break;
            }
        }

        // Standalone shortcuts
        switch (e.key) {
            case '?':
                e.preventDefault();
                this.showKeyboardShortcuts();
                break;
        }
    }

    handleBeforeUnload() {
        // Save any pending data
        if (APP_CONFIG.debug.enabled) {
            console.log('Application shutting down...');
        }
    }

    /* ==========================================================================
       API Health Check
       ========================================================================== */
    
    async checkAPIHealth() {
        try {
            const result = await this.modules.api.checkHealth();
            if (result.success) {
                if (APP_CONFIG.debug.enabled) {
                    console.log('✓ API health check passed');
                }
            } else {
                throw new Error('API health check failed');
            }
        } catch (error) {
            console.warn('API health check failed:', error.message);
            // Don't block initialization for API errors
        }
    }

    /* ==========================================================================
       Theme Management
       ========================================================================== */
    
    loadTheme() {
        const savedTheme = Utils.getLocalStorage(APP_CONFIG.storage.theme, 'light');
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        const validThemes = ['light', 'dark', 'high-contrast'];
        if (!validThemes.includes(theme)) {
            theme = 'light';
        }

        document.documentElement.setAttribute('data-theme', theme);
        Utils.setLocalStorage(APP_CONFIG.storage.theme, theme);
        
        if (APP_CONFIG.debug.enabled) {
            console.log(`Theme set to: ${theme}`);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        if (window.NotificationManager) {
            window.NotificationManager.info(`Switched to ${newTheme} theme`, {
                timeout: 2000
            });
        }
    }

    /* ==========================================================================
       User Interface Helpers
       ========================================================================== */
    
    showWelcomeMessage() {
        if (window.AuthManager?.isLoggedIn()) {
            const user = window.AuthManager.getCurrentUser();
            if (window.NotificationManager) {
                window.NotificationManager.success(
                    `Welcome back, ${user.full_name}!`, 
                    { timeout: 4000 }
                );
            }
        }
    }

    showKeyboardShortcuts() {
        const shortcuts = [
            'Ctrl+H - Home',
            'Ctrl+D - Dashboard', 
            'Ctrl+I - Income',
            'Ctrl+E - Expenses',
            'Ctrl+B - Budgets',
            'Ctrl+R - Reports',
            '? - Show this help'
        ];

        if (window.NotificationManager) {
            window.NotificationManager.info(
                shortcuts.join('\n'), 
                { 
                    title: 'Keyboard Shortcuts',
                    timeout: 10000 
                }
            );
        }
    }

    /* ==========================================================================
       Error Handling
       ========================================================================== */
    
    handleInitializationError(error) {
        console.error('Application initialization failed:', error);
        
        // Hide loading spinner
        this.hideLoadingSpinner();
        
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <div class="error-content">
                <h2>Application Failed to Load</h2>
                <p>Sorry, there was an error initializing the application.</p>
                <p>Error: ${error.message}</p>
                <button onclick="window.location.reload()" class="btn btn-primary">
                    Reload Application
                </button>
            </div>
        `;
        
        document.body.appendChild(errorMessage);
        
        // Log error
        Utils.logError(error, 'Application Initialization');
    }

    /* ==========================================================================
       Performance and Debugging
       ========================================================================== */
    
    logInitialization() {
        const loadTime = Date.now() - this.startTime;
        
        if (APP_CONFIG.debug.enabled) {
            console.group('🎉 WealthWise Application Initialized');
            console.log(`Load time: ${loadTime}ms`);
            console.log(`Version: ${APP_CONFIG.version}`);
            console.log(`Environment: ${APP_CONFIG.api.baseUrl}`);
            console.log(`Modules loaded: ${Object.keys(this.modules).length}`);
            console.log(`Debug mode: ${APP_CONFIG.debug.enabled}`);
            console.groupEnd();
        }
    }

    getPerformanceInfo() {
        return {
            loadTime: Date.now() - this.startTime,
            isInitialized: this.isInitialized,
            modules: Object.keys(this.modules),
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
            } : null
        };
    }

    /* ==========================================================================
       Public API
       ========================================================================== */
    
    getModule(name) {
        return this.modules[name];
    }

    getAllModules() {
        return { ...this.modules };
    }

    isReady() {
        return this.isInitialized;
    }

    restart() {
        window.location.reload();
    }

    // Utility methods for console debugging
    debug() {
        if (APP_CONFIG.debug.enabled) {
            console.group('🔍 Application Debug Info');
            console.log('Performance:', this.getPerformanceInfo());
            console.log('Configuration:', APP_CONFIG);
            console.log('Modules:', this.modules);
            console.log('Current User:', window.AuthManager?.getCurrentUser());
            console.log('Current Section:', window.NavigationManager?.getCurrentSection());
            console.groupEnd();
        }
    }
}

/* ==========================================================================
   Application Startup
   ========================================================================== */

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.WealthWiseApp = new WealthWiseApp();
    });
} else {
    // DOM is already loaded
    window.WealthWiseApp = new WealthWiseApp();
}

// Global error styles
const errorStyles = `
    .error-message {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f9fafb;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .error-content {
        text-align: center;
        padding: 2rem;
        max-width: 32rem;
    }
    
    .error-content h2 {
        color: #dc2626;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }
    
    .error-content p {
        color: #6b7280;
        margin-bottom: 1rem;
        line-height: 1.5;
    }
`;

// Add error styles to document
if (!document.querySelector('#error-styles')) {
    const style = document.createElement('style');
    style.id = 'error-styles';
    style.textContent = errorStyles;
    document.head.appendChild(style);
}