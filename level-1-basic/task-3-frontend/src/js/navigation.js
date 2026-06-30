/* ==========================================================================
   Navigation Manager
   ========================================================================== */

// Navigation Manager for SPA routing
class NavigationManager {
    
    constructor() {
        this.currentSection = 'home';
        this.sections = ['home', 'dashboard', 'income', 'expenses', 'budgets', 'reports'];
        this.navMenu = null;
        this.navToggle = null;
        
        this.init();
    }

    /* ==========================================================================
       Initialization
       ========================================================================== */
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.handleInitialRoute();
        this.updateActiveNavLink();
    }

    bindElements() {
        this.navMenu = Utils.getElementById('navMenu');
        this.navToggle = Utils.getElementById('navToggle');
        
        // Get all navigation links
        this.navLinks = Utils.querySelectorAll('.nav-link[data-section]');
        
        // Get all sections
        this.sectionElements = {};
        this.sections.forEach(section => {
            this.sectionElements[section] = Utils.getElementById(section + 'Section');
        });
    }

    bindEvents() {
        // Navigation link clicks
        this.navLinks.forEach(link => {
            Utils.addEventListener(link, 'click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Mobile menu toggle
        if (this.navToggle) {
            Utils.addEventListener(this.navToggle, 'click', () => {
                this.toggleMobileMenu();
            });
        }

        // Handle special navigation buttons
        this.bindSpecialButtons();
    }

    bindSpecialButtons() {
        // Get Started button
        const getStartedBtn = Utils.getElementById('getStartedBtn');
        if (getStartedBtn) {
            Utils.addEventListener(getStartedBtn, 'click', () => {
                if (window.AuthManager && window.AuthManager.isLoggedIn()) {
                    this.navigateToSection('dashboard');
                } else {
                    window.AuthManager.showRegister();
                }
            });
        }

        // Learn More button
        const learnMoreBtn = Utils.getElementById('learnMoreBtn');
        if (learnMoreBtn) {
            Utils.addEventListener(learnMoreBtn, 'click', () => {
                const featuresSection = Utils.getElementById('featuresSection');
                if (featuresSection) {
                    featuresSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    /* ==========================================================================
       Navigation Methods
       ========================================================================== */
    
    navigateToSection(section, updateHistory = true) {
        if (!section || !this.sections.includes(section)) {
            console.warn(`Invalid section: ${section}`);
            return;
        }

        if (!this.checkSectionAccess(section)) {
            return;
        }

        const previousSection = this.currentSection;
        this.currentSection = section;

        // Hide all sections
        Object.values(this.sectionElements).forEach(element => {
            if (element) {
                Utils.removeClass(element, 'active');
            }
        });

        // Show target section
        const targetSection = this.sectionElements[section];
        if (targetSection) {
            Utils.addClass(targetSection, 'active');
        }

        this.updateActiveNavLink();
        this.closeMobileMenu();

        if (updateHistory) {
            this.updateURL(section);
        }

        this.loadSectionContent(section);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (APP_CONFIG.debug.enabled) {
            console.log(`Navigated to section: ${section}`);
        }
    }

    checkSectionAccess(section) {
        const protectedSections = ['dashboard', 'income', 'expenses', 'budgets', 'reports'];
        
        if (protectedSections.includes(section)) {
            if (!window.AuthManager || !window.AuthManager.isLoggedIn()) {
                window.AuthManager.showLogin();
                return false;
            }
        }
        
        return true;
    }

    updateActiveNavLink() {
        this.navLinks.forEach(link => {
            Utils.removeClass(link, 'active');
        });

        const activeLink = Utils.querySelector(`[data-section="${this.currentSection}"]`);
        if (activeLink) {
            Utils.addClass(activeLink, 'active');
        }
    }

    updateURL(section) {
        const newURL = section === 'home' ? '/' : `#${section}`;
        
        if (window.history && window.history.pushState) {
            window.history.pushState({ section: section }, '', newURL);
        } else {
            window.location.hash = section === 'home' ? '' : section;
        }
    }

    /* ==========================================================================
       Mobile Menu
       ========================================================================== */
    
    toggleMobileMenu() {
        if (this.navMenu && this.navToggle) {
            const isActive = Utils.hasClass(this.navMenu, 'active');
            
            if (isActive) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    openMobileMenu() {
        if (this.navMenu && this.navToggle) {
            Utils.addClass(this.navMenu, 'active');
            Utils.addClass(this.navToggle, 'active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileMenu() {
        if (this.navMenu && this.navToggle) {
            Utils.removeClass(this.navMenu, 'active');
            Utils.removeClass(this.navToggle, 'active');
            document.body.style.overflow = '';
        }
    }

    /* ==========================================================================
       Content Loading
       ========================================================================== */
    
    async loadSectionContent(section) {
        try {
            switch (section) {
                case 'dashboard':
                    await this.loadDashboard();
                    break;
                case 'income':
                    await this.loadIncomeSection();
                    break;
                case 'expenses':
                    await this.loadExpensesSection();
                    break;
                case 'budgets':
                    await this.loadBudgetsSection();
                    break;
                case 'reports':
                    await this.loadReportsSection();
                    break;
                case 'home':
                default:
                    break;
            }
        } catch (error) {
            Utils.logError(error, `Loading section: ${section}`);
        }
    }

    async loadDashboard() {
        if (window.DashboardManager) {
            await window.DashboardManager.loadDashboard();
        }
    }

    async loadIncomeSection() {
        if (window.IncomeManager) {
            await window.IncomeManager.loadIncome();
        }
    }

    async loadExpensesSection() {
        if (window.ExpenseManager) {
            await window.ExpenseManager.loadExpenses();
        }
    }

    async loadBudgetsSection() {
        if (window.BudgetManager) {
            await window.BudgetManager.loadBudgets();
        }
    }

    async loadReportsSection() {
        if (window.ReportManager) {
            await window.ReportManager.loadReports();
        }
    }

    /* ==========================================================================
       Public API
       ========================================================================== */
    
    getCurrentSection() {
        return this.currentSection;
    }

    getSections() {
        return [...this.sections];
    }

    goToDashboard() {
        this.navigateToSection('dashboard');
    }

    goToIncome() {
        this.navigateToSection('income');
    }

    goToExpenses() {
        this.navigateToSection('expenses');
    }

    goToBudgets() {
        this.navigateToSection('budgets');
    }

    goToReports() {
        this.navigateToSection('reports');
    }

    goToHome() {
        this.navigateToSection('home');
    }
}

// Create singleton instance
const NavigationManager_Instance = new NavigationManager();

// Export NavigationManager
window.NavigationManager = NavigationManager_Instance;