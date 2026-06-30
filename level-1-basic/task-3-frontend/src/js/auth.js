/* ==========================================================================
   Authentication Module
   ========================================================================== */

// Authentication Manager
class AuthManager {
    
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authModal = null;
        this.loginForm = null;
        this.registerForm = null;
        
        this.init();
    }

    /* ==========================================================================
       Initialization
       ========================================================================== */
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindElements() {
        // Modal elements
        this.authModal = Utils.getElementById('authModal');
        this.authModalTitle = Utils.getElementById('authModalTitle');
        this.authModalClose = Utils.getElementById('authModalClose');
        this.authModalBackdrop = Utils.getElementById('authModalBackdrop');

        // Forms
        this.loginForm = Utils.getElementById('loginForm');
        this.registerForm = Utils.getElementById('registerForm');

        // Buttons
        this.loginBtn = Utils.getElementById('loginBtn');
        this.registerBtn = Utils.getElementById('registerBtn');
        this.showRegisterForm = Utils.getElementById('showRegisterForm');
        this.showLoginForm = Utils.getElementById('showLoginForm');
        this.logoutBtn = Utils.getElementById('logoutBtn');

        // Menu elements
        this.guestMenu = Utils.getElementById('guestMenu');
        this.authenticatedMenu = Utils.getElementById('authenticatedMenu');
        this.userNameElement = Utils.getElementById('userName');
        this.userDropdownBtn = Utils.getElementById('userDropdownBtn');
        this.userDropdownMenu = Utils.getElementById('userDropdownMenu');
    }

    bindEvents() {
        // Modal events
        if (this.authModalClose) {
            Utils.addEventListener(this.authModalClose, 'click', () => this.closeModal());
        }
        
        if (this.authModalBackdrop) {
            Utils.addEventListener(this.authModalBackdrop, 'click', () => this.closeModal());
        }

        // Button events
        if (this.loginBtn) {
            Utils.addEventListener(this.loginBtn, 'click', () => this.showLogin());
        }
        
        if (this.registerBtn) {
            Utils.addEventListener(this.registerBtn, 'click', () => this.showRegister());
        }
        
        if (this.showRegisterForm) {
            Utils.addEventListener(this.showRegisterForm, 'click', (e) => {
                e.preventDefault();
                this.switchToRegister();
            });
        }
        
        if (this.showLoginForm) {
            Utils.addEventListener(this.showLoginForm, 'click', (e) => {
                e.preventDefault();
                this.switchToLogin();
            });
        }
        
        if (this.logoutBtn) {
            Utils.addEventListener(this.logoutBtn, 'click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Form events
        if (this.loginForm) {
            Utils.addEventListener(this.loginForm, 'submit', (e) => this.handleLogin(e));
        }
        
        if (this.registerForm) {
            Utils.addEventListener(this.registerForm, 'submit', (e) => this.handleRegister(e));
        }

        // User dropdown events
        if (this.userDropdownBtn) {
            Utils.addEventListener(this.userDropdownBtn, 'click', () => {
                const dropdown = this.userDropdownBtn.closest('.user-dropdown');
                if (dropdown) {
                    Utils.toggleClass(dropdown, 'active');
                }
            });
        }

        // Close dropdown when clicking outside
        Utils.addEventListener(document, 'click', (e) => {
            const dropdown = Utils.querySelector('.user-dropdown');
            if (dropdown && !dropdown.contains(e.target)) {
                Utils.removeClass(dropdown, 'active');
            }
        });

        // Keyboard events
        Utils.addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen()) {
                this.closeModal();
            }
        });
    }

    /* ==========================================================================
       Authentication Status
       ========================================================================== */
    
    checkAuthStatus() {
        const storedUser = Utils.getLocalStorage(APP_CONFIG.storage.user);
        const token = Utils.getLocalStorage(APP_CONFIG.storage.token);

        if (storedUser && token) {
            this.currentUser = storedUser;
            this.isAuthenticated = true;
            this.updateUI();
        } else {
            this.isAuthenticated = false;
            this.currentUser = null;
            this.updateUI();
        }
    }

    updateUI() {
        if (this.isAuthenticated && this.currentUser) {
            // Show authenticated menu
            if (this.guestMenu) {
                this.guestMenu.style.display = 'none';
            }
            if (this.authenticatedMenu) {
                this.authenticatedMenu.style.display = 'flex';
            }
            if (this.userNameElement) {
                this.userNameElement.textContent = this.currentUser.full_name || 'User';
            }
        } else {
            // Show guest menu
            if (this.guestMenu) {
                this.guestMenu.style.display = 'flex';
            }
            if (this.authenticatedMenu) {
                this.authenticatedMenu.style.display = 'none';
            }
        }
    }

    /* ==========================================================================
       Modal Management
       ========================================================================== */
    
    showModal() {
        if (this.authModal) {
            Utils.addClass(this.authModal, 'active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.authModal) {
            Utils.removeClass(this.authModal, 'active');
            document.body.style.overflow = '';
        }
        this.clearForms();
    }

    isModalOpen() {
        return this.authModal && Utils.hasClass(this.authModal, 'active');
    }

    showLogin() {
        if (this.authModalTitle) {
            this.authModalTitle.textContent = 'Login to WealthWise';
        }
        if (this.loginForm) {
            this.loginForm.style.display = 'block';
        }
        if (this.registerForm) {
            this.registerForm.style.display = 'none';
        }
        this.showModal();
    }

    showRegister() {
        if (this.authModalTitle) {
            this.authModalTitle.textContent = 'Create Account';
        }
        if (this.loginForm) {
            this.loginForm.style.display = 'none';
        }
        if (this.registerForm) {
            this.registerForm.style.display = 'block';
        }
        this.showModal();
    }

    switchToRegister() {
        if (this.authModalTitle) {
            this.authModalTitle.textContent = 'Create Account';
        }
        if (this.loginForm) {
            this.loginForm.style.display = 'none';
        }
        if (this.registerForm) {
            this.registerForm.style.display = 'block';
        }
        this.clearForms();
    }

    switchToLogin() {
        if (this.authModalTitle) {
            this.authModalTitle.textContent = 'Login to WealthWise';
        }
        if (this.loginForm) {
            this.loginForm.style.display = 'block';
        }
        if (this.registerForm) {
            this.registerForm.style.display = 'none';
        }
        this.clearForms();
    }

    /* ==========================================================================
       Form Handling
       ========================================================================== */
    
    async handleLogin(e) {
        e.preventDefault();
        
        const email = Utils.getElementById('loginEmail').value.trim();
        const password = Utils.getElementById('loginPassword').value;

        // Clear previous errors
        this.clearFormErrors('login');

        // Validate inputs
        if (!this.validateLoginForm(email, password)) {
            return;
        }

        try {
            // Show loading state
            const submitBtn = Utils.getElementById('loginSubmitBtn');
            this.setButtonLoading(submitBtn, true);

            // For now, simulate login since we don't have auth endpoints
            // In a real implementation, you would call API.login(credentials)
            const mockUser = await this.simulateLogin(email, password);
            
            if (mockUser) {
                this.handleLoginSuccess(mockUser);
            }

        } catch (error) {
            this.handleAuthError(error, 'login');
        } finally {
            const submitBtn = Utils.getElementById('loginSubmitBtn');
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const fullName = Utils.getElementById('registerFullName').value.trim();
        const email = Utils.getElementById('registerEmail').value.trim();
        const password = Utils.getElementById('registerPassword').value;
        const confirmPassword = Utils.getElementById('registerConfirmPassword').value;

        // Clear previous errors
        this.clearFormErrors('register');

        // Validate inputs
        if (!this.validateRegisterForm(fullName, email, password, confirmPassword)) {
            return;
        }

        try {
            // Show loading state
            const submitBtn = Utils.getElementById('registerSubmitBtn');
            this.setButtonLoading(submitBtn, true);

            // Create user via API
            const result = await API.createUser({
                full_name: fullName,
                email: email,
                password: password
            });

            if (result.success) {
                this.handleRegisterSuccess(result.data.user);
            } else {
                this.handleAuthError(result.error, 'register');
            }

        } catch (error) {
            this.handleAuthError(error, 'register');
        } finally {
            const submitBtn = Utils.getElementById('registerSubmitBtn');
            this.setButtonLoading(submitBtn, false);
        }
    }

    /* ==========================================================================
       Validation
       ========================================================================== */
    
    validateLoginForm(email, password) {
        let isValid = true;

        if (!email) {
            this.showFieldError('loginEmail', 'Email is required');
            isValid = false;
        } else if (!Utils.isValidEmail(email)) {
            this.showFieldError('loginEmail', 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            this.showFieldError('loginPassword', 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    validateRegisterForm(fullName, email, password, confirmPassword) {
        let isValid = true;

        if (!fullName) {
            this.showFieldError('registerFullName', 'Full name is required');
            isValid = false;
        } else if (fullName.length < 2) {
            this.showFieldError('registerFullName', 'Name must be at least 2 characters');
            isValid = false;
        }

        if (!email) {
            this.showFieldError('registerEmail', 'Email is required');
            isValid = false;
        } else if (!Utils.isValidEmail(email)) {
            this.showFieldError('registerEmail', 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            this.showFieldError('registerPassword', 'Password is required');
            isValid = false;
        } else if (!Utils.isValidPassword(password)) {
            this.showFieldError('registerPassword', APP_CONFIG.validation.password.message);
            isValid = false;
        }

        if (!confirmPassword) {
            this.showFieldError('registerConfirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            this.showFieldError('registerConfirmPassword', 'Passwords do not match');
            isValid = false;
        }

        return isValid;
    }

    /* ==========================================================================
       Error Handling
       ========================================================================== */
    
    showFieldError(fieldId, message) {
        const field = Utils.getElementById(fieldId);
        const errorElement = Utils.getElementById(fieldId + 'Error');
        
        if (field) {
            Utils.addClass(field.closest('.form-group'), 'has-error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearFormErrors(formType) {
        const prefix = formType === 'login' ? 'login' : 'register';
        const fields = formType === 'login' 
            ? ['Email', 'Password']
            : ['FullName', 'Email', 'Password', 'ConfirmPassword'];

        fields.forEach(field => {
            const fieldId = prefix + field;
            const fieldElement = Utils.getElementById(fieldId);
            const errorElement = Utils.getElementById(fieldId + 'Error');
            
            if (fieldElement) {
                Utils.removeClass(fieldElement.closest('.form-group'), 'has-error');
            }
            
            if (errorElement) {
                errorElement.style.display = 'none';
                errorElement.textContent = '';
            }
        });
    }

    handleAuthError(error, formType) {
        const message = error.message || 'An error occurred. Please try again.';
        
        if (window.NotificationManager) {
            window.NotificationManager.show(message, 'error');
        } else {
            alert(message);
        }

        Utils.logError(error, `Authentication ${formType}`);
    }

    /* ==========================================================================
       Authentication Actions
       ========================================================================== */
    
    handleLoginSuccess(user) {
        // Store user data and token
        Utils.setLocalStorage(APP_CONFIG.storage.user, user);
        Utils.setLocalStorage(APP_CONFIG.storage.token, 'mock_token_' + Date.now());

        this.currentUser = user;
        this.isAuthenticated = true;
        
        this.updateUI();
        this.closeModal();
        
        if (window.NotificationManager) {
            window.NotificationManager.show(`Welcome back, ${user.full_name}!`, 'success');
        }

        // Navigate to dashboard if on home page
        if (window.NavigationManager) {
            window.NavigationManager.navigateToSection('dashboard');
        }
    }

    handleRegisterSuccess(user) {
        if (window.NotificationManager) {
            window.NotificationManager.show('Account created successfully! Please log in.', 'success');
        }
        
        // Switch to login form
        this.switchToLogin();
        
        // Pre-fill email
        const emailField = Utils.getElementById('loginEmail');
        if (emailField) {
            emailField.value = user.email;
        }
    }

    async logout() {
        try {
            // Clear stored data
            Utils.removeLocalStorage(APP_CONFIG.storage.user);
            Utils.removeLocalStorage(APP_CONFIG.storage.token);
            
            this.currentUser = null;
            this.isAuthenticated = false;
            
            this.updateUI();
            
            if (window.NotificationManager) {
                window.NotificationManager.show('Logged out successfully', 'info');
            }

            // Navigate to home page
            if (window.NavigationManager) {
                window.NavigationManager.navigateToSection('home');
            }

        } catch (error) {
            Utils.logError(error, 'Logout');
            if (window.NotificationManager) {
                window.NotificationManager.show('Error during logout', 'error');
            }
        }
    }

    /* ==========================================================================
       Utility Methods
       ========================================================================== */
    
    setButtonLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        } else {
            button.disabled = false;
            // Restore original content based on button ID
            if (button.id === 'loginSubmitBtn') {
                button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            } else if (button.id === 'registerSubmitBtn') {
                button.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            }
        }
    }

    clearForms() {
        if (this.loginForm) {
            this.loginForm.reset();
        }
        if (this.registerForm) {
            this.registerForm.reset();
        }
        this.clearFormErrors('login');
        this.clearFormErrors('register');
    }

    // Simulate login for demo purposes (replace with real API call)
    async simulateLogin(email, password) {
        // Simulate API delay
        await Utils.delay(1000);

        // For demo purposes, accept any email with password "demo123"
        if (password === 'demo123') {
            return {
                id: 1,
                full_name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                email: email,
                created_at: new Date().toISOString()
            };
        } else {
            throw new Error('Invalid email or password');
        }
    }

    /* ==========================================================================
       Public API
       ========================================================================== */
    
    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }

    requireAuth() {
        if (!this.isAuthenticated) {
            this.showLogin();
            return false;
        }
        return true;
    }
}

// Create singleton instance
const AuthManager_Instance = new AuthManager();

// Export AuthManager
window.AuthManager = AuthManager_Instance;