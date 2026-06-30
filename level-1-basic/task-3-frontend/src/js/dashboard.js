/* ==========================================================================
   Dashboard Manager
   ========================================================================== */

// Dashboard Manager for financial overview
class DashboardManager {
    
    constructor() {
        this.dashboardSection = null;
        this.isLoaded = false;
        this.refreshInterval = null;
        
        this.init();
    }

    /* ==========================================================================
       Initialization
       ========================================================================== */
    
    init() {
        this.dashboardSection = Utils.getElementById('dashboardSection');
    }

    /* ==========================================================================
       Load Dashboard
       ========================================================================== */
    
    async loadDashboard() {
        if (!window.AuthManager?.isLoggedIn()) {
            this.showLoginRequired();
            return;
        }

        try {
            // Show loading state
            this.showLoading();
            
            // Create dashboard content if not exists
            if (!this.isLoaded) {
                this.createDashboardHTML();
                this.isLoaded = true;
            }
            
            // Load dashboard data
            await this.loadDashboardData();
            
            // Hide loading state
            this.hideLoading();
            
            // Start auto-refresh
            this.startAutoRefresh();
            
        } catch (error) {
            this.handleError(error);
        }
    }

    /* ==========================================================================
       Create Dashboard HTML
       ========================================================================== */
    
    createDashboardHTML() {
        if (!this.dashboardSection) return;

        const user = window.AuthManager.getCurrentUser();
        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        this.dashboardSection.innerHTML = `
            <div class="container">
                <div class="dashboard">
                    <!-- Dashboard Header -->
                    <div class="dashboard-header">
                        <h1 class="dashboard-title">Welcome back, ${user.full_name}!</h1>
                        <p class="dashboard-subtitle">${currentDate} • Here's your financial overview</p>
                    </div>

                    <!-- Stats Grid -->
                    <div class="stats-grid" id="statsGrid">
                        ${this.createStatsCards()}
                    </div>

                    <!-- Charts and Recent Activity -->
                    <div class="content-grid">
                        <!-- Charts Section -->
                        <div class="chart-container">
                            <div class="chart-header">
                                <h2 class="chart-title">Monthly Overview</h2>
                                <div class="chart-actions">
                                    <select class="form-select" id="chartPeriod">
                                        <option value="month">This Month</option>
                                        <option value="quarter">This Quarter</option>
                                        <option value="year">This Year</option>
                                    </select>
                                </div>
                            </div>
                            <div class="chart-placeholder" id="monthlyChart">
                                <i class="fas fa-chart-line"></i>
                                <p>Monthly Income vs Expenses Chart</p>
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div class="data-section">
                            <div class="data-header">
                                <h2 class="data-title">Recent Transactions</h2>
                                <div class="data-filters">
                                    <button class="btn btn-ghost btn-small" id="viewAllTransactions">
                                        View All <i class="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="data-body" id="recentTransactions">
                                ${this.createRecentTransactionsPlaceholder()}
                            </div>
                        </div>
                    </div>

                    <!-- Budget Overview -->
                    <div class="data-section">
                        <div class="data-header">
                            <h2 class="data-title">Budget Overview</h2>
                            <div class="data-filters">
                                <button class="btn btn-primary btn-small" id="createBudgetBtn">
                                    <i class="fas fa-plus"></i> Create Budget
                                </button>
                            </div>
                        </div>
                        <div class="data-body" id="budgetOverview">
                            ${this.createBudgetOverviewPlaceholder()}
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Quick Actions</h2>
                        </div>
                        <div class="card-body">
                            <div class="stats-grid">
                                <button class="btn btn-outline btn-large" onclick="window.NavigationManager.goToIncome()">
                                    <i class="fas fa-plus-circle"></i>
                                    Add Income
                                </button>
                                <button class="btn btn-outline btn-large" onclick="window.NavigationManager.goToExpenses()">
                                    <i class="fas fa-minus-circle"></i>
                                    Add Expense
                                </button>
                                <button class="btn btn-outline btn-large" onclick="window.NavigationManager.goToBudgets()">
                                    <i class="fas fa-calculator"></i>
                                    Create Budget
                                </button>
                                <button class="btn btn-outline btn-large" onclick="window.NavigationManager.goToReports()">
                                    <i class="fas fa-chart-bar"></i>
                                    View Reports
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindDashboardEvents();
    }

    createStatsCards() {
        return `
            <div class="stat-card" id="incomeCard">
                <div class="stat-header">
                    <span class="stat-label">Monthly Income</span>
                    <div class="stat-icon income">
                        <i class="fas fa-arrow-up"></i>
                    </div>
                </div>
                <div class="stat-value" id="monthlyIncome">$0.00</div>
                <div class="stat-change positive" id="incomeChange">
                    <i class="fas fa-arrow-up"></i>
                    <span>+0% from last month</span>
                </div>
            </div>

            <div class="stat-card" id="expenseCard">
                <div class="stat-header">
                    <span class="stat-label">Monthly Expenses</span>
                    <div class="stat-icon expense">
                        <i class="fas fa-arrow-down"></i>
                    </div>
                </div>
                <div class="stat-value" id="monthlyExpenses">$0.00</div>
                <div class="stat-change negative" id="expenseChange">
                    <i class="fas fa-arrow-up"></i>
                    <span>+0% from last month</span>
                </div>
            </div>

            <div class="stat-card" id="budgetCard">
                <div class="stat-header">
                    <span class="stat-label">Budget Used</span>
                    <div class="stat-icon budget">
                        <i class="fas fa-percentage"></i>
                    </div>
                </div>
                <div class="stat-value" id="budgetUsed">0%</div>
                <div class="stat-change" id="budgetChange">
                    <i class="fas fa-info-circle"></i>
                    <span>0 active budgets</span>
                </div>
            </div>

            <div class="stat-card" id="savingsCard">
                <div class="stat-header">
                    <span class="stat-label">Net Savings</span>
                    <div class="stat-icon savings">
                        <i class="fas fa-piggy-bank"></i>
                    </div>
                </div>
                <div class="stat-value" id="netSavings">$0.00</div>
                <div class="stat-change positive" id="savingsChange">
                    <i class="fas fa-arrow-up"></i>
                    <span>Good progress!</span>
                </div>
            </div>
        `;
    }

    createRecentTransactionsPlaceholder() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-receipt"></i>
                </div>
                <div class="empty-state-title">No Recent Transactions</div>
                <div class="empty-state-description">
                    Start by adding some income or expenses to see your financial activity here.
                </div>
                <div class="empty-state-actions">
                    <button class="btn btn-primary" onclick="window.NavigationManager.goToIncome()">
                        <i class="fas fa-plus"></i> Add Income
                    </button>
                    <button class="btn btn-outline" onclick="window.NavigationManager.goToExpenses()">
                        <i class="fas fa-minus"></i> Add Expense
                    </button>
                </div>
            </div>
        `;
    }

    createBudgetOverviewPlaceholder() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-calculator"></i>
                </div>
                <div class="empty-state-title">No Budgets Created</div>
                <div class="empty-state-description">
                    Create budgets to track your spending and stay on top of your financial goals.
                </div>
                <div class="empty-state-actions">
                    <button class="btn btn-primary" onclick="window.NavigationManager.goToBudgets()">
                        <i class="fas fa-plus"></i> Create Your First Budget
                    </button>
                </div>
            </div>
        `;
    }

    /* ==========================================================================
       Event Binding
       ========================================================================== */
    
    bindDashboardEvents() {
        // Chart period selector
        const chartPeriod = Utils.getElementById('chartPeriod');
        if (chartPeriod) {
            Utils.addEventListener(chartPeriod, 'change', () => {
                this.updateChart(chartPeriod.value);
            });
        }

        // View all transactions
        const viewAllBtn = Utils.getElementById('viewAllTransactions');
        if (viewAllBtn) {
            Utils.addEventListener(viewAllBtn, 'click', () => {
                // For now, navigate to expenses section
                window.NavigationManager.goToExpenses();
            });
        }

        // Create budget button
        const createBudgetBtn = Utils.getElementById('createBudgetBtn');
        if (createBudgetBtn) {
            Utils.addEventListener(createBudgetBtn, 'click', () => {
                window.NavigationManager.goToBudgets();
            });
        }
    }

    /* ==========================================================================
       Data Loading
       ========================================================================== */
    
    async loadDashboardData() {
        if (!window.AuthManager?.isLoggedIn()) return;

        const user = window.AuthManager.getCurrentUser();
        const currentMonth = Utils.getCurrentMonthRange();

        try {
            // Load financial data in parallel
            const [incomeData, expenseData, budgetData] = await Promise.all([
                this.loadIncomeData(user.id, currentMonth),
                this.loadExpenseData(user.id, currentMonth),
                this.loadBudgetData(user.id)
            ]);

            // Update statistics
            this.updateStats(incomeData, expenseData, budgetData);
            
            // Load recent transactions
            await this.loadRecentTransactions(user.id);
            
            // Load budget overview
            await this.loadBudgetOverview(user.id);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Show demo data instead
            this.showDemoData();
        }
    }

    async loadIncomeData(userId, dateRange) {
        try {
            const result = await API.getIncomeByDateRange(userId, dateRange.start, dateRange.end);
            return result.success ? result.data.income || [] : [];
        } catch (error) {
            return this.generateDemoIncome();
        }
    }

    async loadExpenseData(userId, dateRange) {
        try {
            const result = await API.getExpensesByDateRange(userId, dateRange.start, dateRange.end);
            return result.success ? result.data.expenses || [] : [];
        } catch (error) {
            return this.generateDemoExpenses();
        }
    }

    async loadBudgetData(userId) {
        try {
            const result = await API.getCurrentBudgets(userId);
            return result.success ? result.data.budgets || [] : [];
        } catch (error) {
            return [];
        }
    }

    /* ==========================================================================
       Update UI
       ========================================================================== */
    
    updateStats(income, expenses, budgets) {
        // Calculate totals
        const totalIncome = income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const netSavings = totalIncome - totalExpenses;

        // Update income stat
        const incomeElement = Utils.getElementById('monthlyIncome');
        if (incomeElement) {
            incomeElement.textContent = Utils.formatCurrency(totalIncome);
        }

        // Update expense stat
        const expenseElement = Utils.getElementById('monthlyExpenses');
        if (expenseElement) {
            expenseElement.textContent = Utils.formatCurrency(totalExpenses);
        }

        // Update savings stat
        const savingsElement = Utils.getElementById('netSavings');
        if (savingsElement) {
            savingsElement.textContent = Utils.formatCurrency(netSavings);
        }

        // Update budget usage
        if (budgets.length > 0) {
            const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.budgeted_amount || 0), 0);
            const totalSpent = budgets.reduce((sum, budget) => sum + parseFloat(budget.spent_amount || 0), 0);
            const budgetUsage = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;

            const budgetElement = Utils.getElementById('budgetUsed');
            if (budgetElement) {
                budgetElement.textContent = `${Math.round(budgetUsage)}%`;
            }

            const budgetChangeElement = Utils.getElementById('budgetChange');
            if (budgetChangeElement) {
                budgetChangeElement.innerHTML = `
                    <i class="fas fa-info-circle"></i>
                    <span>${budgets.length} active budget${budgets.length !== 1 ? 's' : ''}</span>
                `;
            }
        }

        // Update trend indicators (simplified)
        this.updateTrendIndicators(totalIncome, totalExpenses);
    }

    updateTrendIndicators(income, expenses) {
        // Simplified trend calculation (in real app, compare with previous month)
        const incomeChange = income > 0 ? 5 : 0; // Demo: assume 5% increase
        const expenseChange = expenses > 0 ? 3 : 0; // Demo: assume 3% increase

        const incomeChangeElement = Utils.getElementById('incomeChange');
        if (incomeChangeElement && income > 0) {
            incomeChangeElement.innerHTML = `
                <i class="fas fa-arrow-up"></i>
                <span>+${incomeChange}% from last month</span>
            `;
            Utils.addClass(incomeChangeElement, 'positive');
        }

        const expenseChangeElement = Utils.getElementById('expenseChange');
        if (expenseChangeElement && expenses > 0) {
            expenseChangeElement.innerHTML = `
                <i class="fas fa-arrow-up"></i>
                <span>+${expenseChange}% from last month</span>
            `;
            Utils.addClass(expenseChangeElement, 'negative');
        }
    }

    /* ==========================================================================
       Demo Data
       ========================================================================== */
    
    showDemoData() {
        const demoIncome = this.generateDemoIncome();
        const demoExpenses = this.generateDemoExpenses();
        const demoBudgets = [];

        this.updateStats(demoIncome, demoExpenses, demoBudgets);
        
        if (window.NotificationManager) {
            window.NotificationManager.info('Showing demo data. Connect to API for real financial data.', {
                timeout: 5000
            });
        }
    }

    generateDemoIncome() {
        return [
            { amount: 5000, source: 'Salary', income_date: new Date().toISOString().split('T')[0] },
            { amount: 1200, source: 'Freelance', income_date: new Date().toISOString().split('T')[0] },
            { amount: 300, source: 'Investment', income_date: new Date().toISOString().split('T')[0] }
        ];
    }

    generateDemoExpenses() {
        return [
            { amount: 1200, category: 'Housing', expense_date: new Date().toISOString().split('T')[0] },
            { amount: 400, category: 'Food', expense_date: new Date().toISOString().split('T')[0] },
            { amount: 200, category: 'Transportation', expense_date: new Date().toISOString().split('T')[0] },
            { amount: 150, category: 'Utilities', expense_date: new Date().toISOString().split('T')[0] }
        ];
    }

    /* ==========================================================================
       Loading States
       ========================================================================== */
    
    showLoading() {
        if (!this.dashboardSection) return;
        
        this.dashboardSection.innerHTML = `
            <div class="container">
                <div class="dashboard">
                    <div class="loading-overlay">
                        <div class="spinner"></div>
                        <div class="loading-text">Loading your financial dashboard...</div>
                    </div>
                </div>
            </div>
        `;
    }

    hideLoading() {
        // Loading is hidden when content is loaded
    }

    showLoginRequired() {
        if (!this.dashboardSection) return;
        
        this.dashboardSection.innerHTML = `
            <div class="container">
                <div class="dashboard">
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div class="empty-state-title">Login Required</div>
                        <div class="empty-state-description">
                            Please log in to view your financial dashboard.
                        </div>
                        <div class="empty-state-actions">
                            <button class="btn btn-primary" onclick="window.AuthManager.showLogin()">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </button>
                            <button class="btn btn-outline" onclick="window.AuthManager.showRegister()">
                                <i class="fas fa-user-plus"></i> Create Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /* ==========================================================================
       Auto Refresh
       ========================================================================== */
    
    startAutoRefresh() {
        // Refresh every 5 minutes
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            if (window.NavigationManager?.getCurrentSection() === 'dashboard') {
                this.loadDashboardData();
            }
        }, 300000); // 5 minutes
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    /* ==========================================================================
       Error Handling
       ========================================================================== */
    
    handleError(error) {
        Utils.logError(error, 'Dashboard Loading');
        
        if (window.NotificationManager) {
            window.NotificationManager.error('Failed to load dashboard data');
        }
        
        // Show demo data as fallback
        this.showDemoData();
    }

    /* ==========================================================================
       Public API
       ========================================================================== */
    
    refresh() {
        this.loadDashboardData();
    }

    updateChart(period) {
        // Placeholder for chart updates
        console.log(`Updating chart for period: ${period}`);
    }

    async loadRecentTransactions(userId) {
        // Placeholder - will show demo message for now
        console.log(`Loading recent transactions for user: ${userId}`);
    }

    async loadBudgetOverview(userId) {
        // Placeholder - will show demo message for now
        console.log(`Loading budget overview for user: ${userId}`);
    }
}

// Create singleton instance
const DashboardManager_Instance = new DashboardManager();

// Export DashboardManager
window.DashboardManager = DashboardManager_Instance;