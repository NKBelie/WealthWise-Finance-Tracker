/* ==========================================================================
   Expense Manager - Placeholder
   ========================================================================== */

// Expense Manager for managing expense records
class ExpenseManager {
    
    constructor() {
        this.expensesSection = null;
        this.isLoaded = false;
        
        this.init();
    }

    init() {
        this.expensesSection = Utils.getElementById('expensesSection');
    }

    async loadExpenses() {
        if (!window.AuthManager?.isLoggedIn()) {
            this.showLoginRequired();
            return;
        }

        if (!this.isLoaded) {
            this.createExpensesHTML();
            this.isLoaded = true;
        }
    }

    createExpensesHTML() {
        if (!this.expensesSection) return;

        this.expensesSection.innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Expense Management</h1>
                    <div class="page-actions">
                        <button class="btn btn-primary">
                            <i class="fas fa-plus"></i> Add Expense
                        </button>
                    </div>
                </div>
                
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-minus-circle"></i>
                    </div>
                    <div class="empty-state-title">Expense Management</div>
                    <div class="empty-state-description">
                        This section will be implemented in future iterations.<br>
                        Features will include expense tracking, receipt uploads, categorization, and spending analysis.
                    </div>
                </div>
            </div>
        `;
    }

    showLoginRequired() {
        if (!this.expensesSection) return;
        
        this.expensesSection.innerHTML = `
            <div class="container">
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <div class="empty-state-title">Login Required</div>
                    <div class="empty-state-description">
                        Please log in to manage your expense records.
                    </div>
                    <div class="empty-state-actions">
                        <button class="btn btn-primary" onclick="window.AuthManager.showLogin()">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Create singleton instance
const ExpenseManager_Instance = new ExpenseManager();

// Export ExpenseManager
window.ExpenseManager = ExpenseManager_Instance;