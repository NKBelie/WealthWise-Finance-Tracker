/* ==========================================================================
   API Service Layer
   ========================================================================== */

// API Service for handling all REST API communications
class APIService {
    
    constructor() {
        this.baseUrl = APP_CONFIG.api.baseUrl;
        this.timeout = APP_CONFIG.api.timeout;
        this.retryAttempts = APP_CONFIG.api.retryAttempts;
        this.retryDelay = APP_CONFIG.api.retryDelay;
    }

    /* ==========================================================================
       HTTP Request Methods
       ========================================================================== */

    // Generic request method
    async request(url, options = {}) {
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders()
            },
            timeout: this.timeout,
            ...options
        };

        // Add request body for non-GET requests
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

        try {
            const response = await this.fetchWithTimeout(fullUrl, config);
            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error, url, config);
        }
    }

    // GET request
    async get(url, params = {}) {
        const queryString = this.buildQueryString(params);
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        
        return this.request(fullUrl, {
            method: 'GET'
        });
    }

    // POST request
    async post(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: data
        });
    }

    // PUT request
    async put(url, data = {}) {
        return this.request(url, {
            method: 'PUT',
            body: data
        });
    }

    // PATCH request
    async patch(url, data = {}) {
        return this.request(url, {
            method: 'PATCH',
            body: data
        });
    }

    // DELETE request
    async delete(url) {
        return this.request(url, {
            method: 'DELETE'
        });
    }

    /* ==========================================================================
       Helper Methods
       ========================================================================== */

    // Fetch with timeout
    async fetchWithTimeout(url, options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    // Handle response
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');

        let data;
        if (isJson) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const error = new Error(data.message || `HTTP ${response.status}`);
            error.status = response.status;
            error.statusText = response.statusText;
            error.data = data;
            throw error;
        }

        return {
            success: true,
            status: response.status,
            data: data
        };
    }

    // Handle error
    async handleError(error, url, config) {
        Utils.logError(error, `API Request: ${config.method} ${url}`);

        // Retry logic for network errors
        if (this.shouldRetry(error, config)) {
            return this.retryRequest(url, config);
        }

        return {
            success: false,
            error: {
                message: error.message || 'An error occurred',
                status: error.status || 0,
                type: this.getErrorType(error)
            }
        };
    }

    // Determine if request should be retried
    shouldRetry(error, config) {
        const retryCount = config._retryCount || 0;
        const isNetworkError = !error.status || error.status >= 500;
        const isRetryableMethod = ['GET', 'PUT', 'PATCH', 'DELETE'].includes(config.method);
        
        return retryCount < this.retryAttempts && 
               isNetworkError && 
               isRetryableMethod;
    }

    // Retry request
    async retryRequest(url, config) {
        const retryCount = (config._retryCount || 0) + 1;
        const delay = this.retryDelay * Math.pow(2, retryCount - 1); // Exponential backoff

        await Utils.delay(delay);

        return this.request(url, {
            ...config,
            _retryCount: retryCount
        });
    }

    // Get error type
    getErrorType(error) {
        if (!error.status) return 'network';
        if (error.status === 401) return 'unauthorized';
        if (error.status === 403) return 'forbidden';
        if (error.status === 404) return 'not_found';
        if (error.status >= 400 && error.status < 500) return 'client';
        if (error.status >= 500) return 'server';
        return 'unknown';
    }

    // Get authentication headers
    getAuthHeaders() {
        const token = Utils.getLocalStorage(APP_CONFIG.storage.token);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Build query string
    buildQueryString(params) {
        const filtered = Object.entries(params)
            .filter(([key, value]) => value !== null && value !== undefined && value !== '');
        
        if (filtered.length === 0) return '';
        
        return new URLSearchParams(filtered).toString();
    }

    /* ==========================================================================
       System Endpoints
       ========================================================================== */

    // Health check
    async checkHealth() {
        return this.get(APP_CONFIG.endpoints.health);
    }

    // Get API info
    async getInfo() {
        return this.get(APP_CONFIG.endpoints.info);
    }

    // Get API stats
    async getStats() {
        return this.get(APP_CONFIG.endpoints.stats);
    }

    /* ==========================================================================
       User Management
       ========================================================================== */

    // Get all users
    async getUsers() {
        return this.get(APP_CONFIG.endpoints.users.base);
    }

    // Get user by ID
    async getUser(id) {
        return this.get(APP_CONFIG.endpoints.users.byId(id));
    }

    // Create user
    async createUser(userData) {
        return this.post(APP_CONFIG.endpoints.users.base, userData);
    }

    // Update user
    async updateUser(id, userData) {
        return this.put(APP_CONFIG.endpoints.users.byId(id), userData);
    }

    // Delete user
    async deleteUser(id) {
        return this.delete(APP_CONFIG.endpoints.users.byId(id));
    }

    /* ==========================================================================
       Income Management
       ========================================================================== */

    // Get all income
    async getIncome(filters = {}) {
        return this.get(APP_CONFIG.endpoints.income.base, filters);
    }

    // Get income by ID
    async getIncomeById(id) {
        return this.get(APP_CONFIG.endpoints.income.byId(id));
    }

    // Get income by user
    async getIncomeByUser(userId, filters = {}) {
        const url = APP_CONFIG.endpoints.income.byUser(userId);
        return this.get(url, filters);
    }

    // Get income by date range
    async getIncomeByDateRange(userId, startDate, endDate) {
        const url = APP_CONFIG.endpoints.income.byDateRange(userId, startDate, endDate);
        return this.get(url);
    }

    // Create income
    async createIncome(incomeData) {
        return this.post(APP_CONFIG.endpoints.income.base, incomeData);
    }

    // Update income
    async updateIncome(id, incomeData) {
        return this.put(APP_CONFIG.endpoints.income.byId(id), incomeData);
    }

    // Delete income
    async deleteIncome(id) {
        return this.delete(APP_CONFIG.endpoints.income.byId(id));
    }

    /* ==========================================================================
       Expense Management
       ========================================================================== */

    // Get all expenses
    async getExpenses(filters = {}) {
        return this.get(APP_CONFIG.endpoints.expenses.base, filters);
    }

    // Get expense by ID
    async getExpenseById(id) {
        return this.get(APP_CONFIG.endpoints.expenses.byId(id));
    }

    // Get expenses by user
    async getExpensesByUser(userId, filters = {}) {
        const url = APP_CONFIG.endpoints.expenses.byUser(userId);
        return this.get(url, filters);
    }

    // Get expenses by category
    async getExpensesByCategory(userId, category) {
        const url = APP_CONFIG.endpoints.expenses.byCategory(userId, category);
        return this.get(url);
    }

    // Get expenses by date range
    async getExpensesByDateRange(userId, startDate, endDate) {
        const url = APP_CONFIG.endpoints.expenses.byDateRange(userId, startDate, endDate);
        return this.get(url);
    }

    // Create expense
    async createExpense(expenseData) {
        return this.post(APP_CONFIG.endpoints.expenses.base, expenseData);
    }

    // Update expense
    async updateExpense(id, expenseData) {
        return this.put(APP_CONFIG.endpoints.expenses.byId(id), expenseData);
    }

    // Delete expense
    async deleteExpense(id) {
        return this.delete(APP_CONFIG.endpoints.expenses.byId(id));
    }

    /* ==========================================================================
       Budget Management
       ========================================================================== */

    // Get all budgets
    async getBudgets(filters = {}) {
        return this.get(APP_CONFIG.endpoints.budgets.base, filters);
    }

    // Get budget by ID
    async getBudgetById(id) {
        return this.get(APP_CONFIG.endpoints.budgets.byId(id));
    }

    // Get budgets by user
    async getBudgetsByUser(userId, filters = {}) {
        const url = APP_CONFIG.endpoints.budgets.byUser(userId);
        return this.get(url, filters);
    }

    // Get current period budgets
    async getCurrentBudgets(userId) {
        const url = APP_CONFIG.endpoints.budgets.current(userId);
        return this.get(url);
    }

    // Get budget progress
    async getBudgetProgress(id) {
        return this.get(APP_CONFIG.endpoints.budgets.progress(id));
    }

    // Get user budget summary
    async getBudgetSummary(userId, periodType = 'MONTHLY') {
        return this.get(APP_CONFIG.endpoints.budgets.summary(userId), { period_type: periodType });
    }

    // Get budget alerts
    async getBudgetAlerts(userId) {
        return this.get(APP_CONFIG.endpoints.budgets.alerts(userId));
    }

    // Create budget
    async createBudget(budgetData) {
        return this.post(APP_CONFIG.endpoints.budgets.base, budgetData);
    }

    // Create multiple budgets
    async createBudgetsBulk(budgetsData) {
        return this.post(APP_CONFIG.endpoints.budgets.bulk, { budgets: budgetsData });
    }

    // Update budget
    async updateBudget(id, budgetData) {
        return this.put(APP_CONFIG.endpoints.budgets.byId(id), budgetData);
    }

    // Update budget spending
    async updateBudgetSpending(id, spentAmount) {
        return this.patch(APP_CONFIG.endpoints.budgets.spending(id), { spent_amount: spentAmount });
    }

    // Sync budget with expenses
    async syncBudget(id) {
        return this.post(APP_CONFIG.endpoints.budgets.sync(id));
    }

    // Toggle budget status
    async toggleBudgetStatus(id) {
        return this.patch(APP_CONFIG.endpoints.budgets.toggle(id));
    }

    // Delete budget
    async deleteBudget(id) {
        return this.delete(APP_CONFIG.endpoints.budgets.byId(id));
    }

    /* ==========================================================================
       Authentication (Placeholder for future implementation)
       ========================================================================== */

    // Login
    async login(credentials) {
        // Note: This is a placeholder since we don't have auth endpoints in the current API
        // For now, we'll simulate login with user data
        return this.post('/api/auth/login', credentials);
    }

    // Register
    async register(userData) {
        // Note: This is a placeholder
        return this.post('/api/auth/register', userData);
    }

    // Logout
    async logout() {
        // Note: This is a placeholder
        return this.post('/api/auth/logout');
    }
}

// Create singleton instance
const API = new APIService();

// Export API instance
window.API = API;

// Freeze to prevent modifications
Object.freeze(API);