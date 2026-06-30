/* ==========================================================================
   Notification Manager
   ========================================================================== */

// Notification Manager for displaying toast messages
class NotificationManager {
    
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxNotifications = APP_CONFIG.ui.maxNotifications;
        this.defaultTimeout = APP_CONFIG.ui.notificationTimeout;
        
        this.init();
    }

    /* ==========================================================================
       Initialization
       ========================================================================== */
    
    init() {
        this.container = Utils.getElementById('notificationContainer');
        if (!this.container) {
            this.createContainer();
        }
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    /* ==========================================================================
       Show Notifications
       ========================================================================== */
    
    show(message, type = 'info', options = {}) {
        const {
            title = null,
            timeout = this.defaultTimeout,
            persistent = false,
            action = null
        } = options;

        // Validate type
        const validTypes = ['success', 'error', 'warning', 'info'];
        if (!validTypes.includes(type)) {
            type = 'info';
        }

        // Create notification object
        const notification = {
            id: this.generateId(),
            type: type,
            title: title,
            message: message,
            timestamp: Date.now(),
            timeout: timeout,
            persistent: persistent,
            action: action
        };

        // Add to notifications array
        this.notifications.push(notification);

        // Remove old notifications if exceeding max
        this.enforceMaxNotifications();

        // Create and show notification element
        const element = this.createNotificationElement(notification);
        this.container.appendChild(element);

        // Auto-dismiss if not persistent
        if (!persistent && timeout > 0) {
            setTimeout(() => {
                this.dismiss(notification.id);
            }, timeout);
        }

        // Log notification
        if (APP_CONFIG.debug.enabled) {
            console.log(`Notification [${type}]: ${message}`);
        }

        return notification.id;
    }

    /* ==========================================================================
       Notification Types
       ========================================================================== */
    
    success(message, options = {}) {
        return this.show(message, 'success', {
            title: 'Success',
            ...options
        });
    }

    error(message, options = {}) {
        return this.show(message, 'error', {
            title: 'Error',
            timeout: 0, // Errors should be manually dismissed
            ...options
        });
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', {
            title: 'Warning',
            ...options
        });
    }

    info(message, options = {}) {
        return this.show(message, 'info', {
            title: 'Information',
            ...options
        });
    }

    /* ==========================================================================
       Create Notification Element
       ========================================================================== */
    
    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `notification ${notification.type}`;
        element.setAttribute('data-id', notification.id);

        // Icon
        const icon = this.createIconElement(notification.type);
        
        // Content
        const content = document.createElement('div');
        content.className = 'notification-content';

        // Title (if provided)
        if (notification.title) {
            const title = document.createElement('div');
            title.className = 'notification-title';
            title.textContent = notification.title;
            content.appendChild(title);
        }

        // Message
        const message = document.createElement('div');
        message.className = 'notification-message';
        message.textContent = notification.message;
        content.appendChild(message);

        // Action button (if provided)
        if (notification.action) {
            const actionBtn = document.createElement('button');
            actionBtn.className = 'btn btn-small btn-outline';
            actionBtn.textContent = notification.action.label;
            actionBtn.onclick = () => {
                notification.action.handler();
                this.dismiss(notification.id);
            };
            content.appendChild(actionBtn);
        }

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.onclick = () => this.dismiss(notification.id);

        // Assemble notification
        element.appendChild(icon);
        element.appendChild(content);
        element.appendChild(closeBtn);

        // Add click-to-dismiss (except for close button)
        element.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-close') && !e.target.closest('button')) {
                this.dismiss(notification.id);
            }
        });

        return element;
    }

    createIconElement(type) {
        const iconContainer = document.createElement('div');
        iconContainer.className = 'notification-icon';

        const icon = document.createElement('i');
        
        switch (type) {
            case 'success':
                icon.className = 'fas fa-check';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-triangle';
                break;
            case 'warning':
                icon.className = 'fas fa-exclamation-circle';
                break;
            case 'info':
            default:
                icon.className = 'fas fa-info-circle';
                break;
        }

        iconContainer.appendChild(icon);
        return iconContainer;
    }

    /* ==========================================================================
       Notification Management
       ========================================================================== */
    
    dismiss(id) {
        // Find notification
        const notification = this.notifications.find(n => n.id === id);
        if (!notification) return;

        // Find element
        const element = this.container.querySelector(`[data-id="${id}"]`);
        if (!element) return;

        // Add dismiss animation
        element.style.animation = 'slideOut 300ms ease-in-out forwards';

        // Remove after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }

            // Remove from notifications array
            this.notifications = this.notifications.filter(n => n.id !== id);
        }, 300);
    }

    dismissAll() {
        this.notifications.forEach(notification => {
            this.dismiss(notification.id);
        });
    }

    dismissByType(type) {
        this.notifications
            .filter(n => n.type === type)
            .forEach(notification => {
                this.dismiss(notification.id);
            });
    }

    enforceMaxNotifications() {
        while (this.notifications.length > this.maxNotifications) {
            const oldest = this.notifications[0];
            this.dismiss(oldest.id);
        }
    }

    /* ==========================================================================
       Utility Methods
       ========================================================================== */
    
    generateId() {
        return 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getNotifications() {
        return [...this.notifications];
    }

    getNotificationById(id) {
        return this.notifications.find(n => n.id === id);
    }

    hasNotifications() {
        return this.notifications.length > 0;
    }

    getNotificationCount() {
        return this.notifications.length;
    }

    getNotificationsByType(type) {
        return this.notifications.filter(n => n.type === type);
    }

    /* ==========================================================================
       Predefined Notifications
       ========================================================================== */
    
    // API-related notifications
    apiError(message = 'An error occurred while communicating with the server') {
        return this.error(message, {
            title: 'Connection Error',
            action: {
                label: 'Retry',
                handler: () => window.location.reload()
            }
        });
    }

    apiSuccess(message = 'Operation completed successfully') {
        return this.success(message, {
            title: 'Success'
        });
    }

    // Form-related notifications
    formError(message = 'Please check the form and try again') {
        return this.error(message, {
            title: 'Form Error'
        });
    }

    formSuccess(message = 'Form submitted successfully') {
        return this.success(message, {
            title: 'Form Submitted'
        });
    }

    // Authentication-related notifications
    loginSuccess(userName = 'User') {
        return this.success(`Welcome back, ${userName}!`, {
            title: 'Login Successful'
        });
    }

    loginError(message = 'Invalid credentials') {
        return this.error(message, {
            title: 'Login Failed'
        });
    }

    logoutSuccess() {
        return this.info('You have been logged out successfully', {
            title: 'Logged Out'
        });
    }

    // Data-related notifications
    dataLoaded(message = 'Data loaded successfully') {
        return this.success(message, {
            timeout: 2000
        });
    }

    dataError(message = 'Failed to load data') {
        return this.error(message, {
            title: 'Data Error',
            action: {
                label: 'Retry',
                handler: () => window.location.reload()
            }
        });
    }

    // Save-related notifications
    saveSuccess(message = 'Changes saved successfully') {
        return this.success(message, {
            timeout: 3000
        });
    }

    saveError(message = 'Failed to save changes') {
        return this.error(message, {
            title: 'Save Error'
        });
    }

    // Delete-related notifications
    deleteSuccess(message = 'Item deleted successfully') {
        return this.success(message, {
            timeout: 3000
        });
    }

    deleteError(message = 'Failed to delete item') {
        return this.error(message, {
            title: 'Delete Error'
        });
    }

    // Budget-related notifications
    budgetAlert(message, budgetName) {
        return this.warning(message, {
            title: `Budget Alert: ${budgetName}`,
            persistent: true
        });
    }

    budgetExceeded(budgetName) {
        return this.error(`You have exceeded your budget for ${budgetName}`, {
            title: 'Budget Exceeded',
            persistent: true
        });
    }

    // Network-related notifications
    networkError() {
        return this.error('No internet connection. Please check your network and try again.', {
            title: 'Network Error',
            persistent: true,
            action: {
                label: 'Retry',
                handler: () => window.location.reload()
            }
        });
    }

    // Validation notifications
    validationError(message = 'Please correct the errors and try again') {
        return this.warning(message, {
            title: 'Validation Error'
        });
    }

    // Loading notifications
    showLoading(message = 'Loading...') {
        return this.info(message, {
            title: 'Please Wait',
            persistent: true
        });
    }

    hideLoading(loadingId) {
        if (loadingId) {
            this.dismiss(loadingId);
        }
    }
}

// Add slideOut animation to CSS if not present
if (!document.querySelector('#notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Create singleton instance
const NotificationManager_Instance = new NotificationManager();

// Export NotificationManager
window.NotificationManager = NotificationManager_Instance;