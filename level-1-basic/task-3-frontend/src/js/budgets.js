/* ==========================================================================
   Budget Manager - Placeholder
   ========================================================================== */

// Budget Manager for managing budgets
class BudgetManager {
    
    constructor() {
        this.budgetsSection = null;
        this.isLoaded = false;
        
        this.init();
    }

    init() {
        this.budgetsSection = Utils.getElementById('budgetsSection');
    }

    async loadBudgets() {
        if (!window.AuthManager?.isLoggedIn()) {
            this.showLoginRequired();
            return;
        }

        if (!this.isLoaded) {
            this.createBudgetsHTML();
            this.isLoaded = true;
        }
    }

    createBudgetsHTML() {
        if (!this.budgetsSection) return;

        this.budgetsSection.innerHTML = `
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Budget Management</h1>
                    <div class="page-actions">
                        <button class="btn btn-primary">
                            <i class="fas fa-plus"></i> Create Budget
                        </button>
                    </div>
                </div>
                
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-calculator"></i>
                    </div>
                    <div class="empty-state-title">Budget Management</div>
                    <div class="empty-state-description">
                        This section will be implemented in future iterations.<br>
                        Features will include budget creation, progress tracking, alerts, and spending limits.
                    </div>
                </div>
            </div>
        `;
    }

    showLoginRequired() {
        if (!this.budgetsSection) return;
        
        this.budgetsSection.innerHTML = `
            <div class="container">
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <div class="empty-state-title">Login Required</div>
                    <div class="empty-state-description">
                        Please log in to manage your budgets.
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
const BudgetManager_Instance = new BudgetManager();

// Export BudgetManager
window.BudgetManager = BudgetManager_Instance;