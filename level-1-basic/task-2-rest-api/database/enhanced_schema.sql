-- WealthWise Finance Tracker - Enhanced Database Schema
-- Level 1 Task 2: Complete REST API Implementation

-- ===============================================
-- Drop existing tables if they exist (for clean setup)
-- ===============================================
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS income CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===============================================
-- Create Categories Table (New - for better organization)
-- ===============================================
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE', 'BOTH')),
  color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for UI
  icon VARCHAR(50) DEFAULT 'dollar-sign', -- Icon identifier
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- Create Users Table (Enhanced)
-- ===============================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  profile_image VARCHAR(255), -- URL to profile image
  phone VARCHAR(20),
  date_of_birth DATE,
  currency VARCHAR(3) DEFAULT 'USD',
  timezone VARCHAR(50) DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- Create Income Table (Enhanced with Categories)
-- ===============================================
CREATE TABLE IF NOT EXISTS income (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL,
  category_id INTEGER,
  source VARCHAR(100) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  income_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  recurring_type VARCHAR(20) CHECK (recurring_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')),
  recurring_end_date DATE,
  tags TEXT[], -- Array of tags for better categorization
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_income_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_income_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);

-- ===============================================
-- Create Expenses Table (Enhanced with Categories)
-- ===============================================
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL,
  category_id INTEGER,
  category VARCHAR(100) NOT NULL, -- Keep for backward compatibility
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  expense_date DATE NOT NULL,
  receipt_url VARCHAR(500), -- URL to receipt image
  is_recurring BOOLEAN DEFAULT false,
  recurring_type VARCHAR(20) CHECK (recurring_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')),
  recurring_end_date DATE,
  payment_method VARCHAR(50), -- Cash, Credit Card, Debit Card, etc.
  location VARCHAR(200), -- Where the expense occurred
  tags TEXT[], -- Array of tags
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_expenses_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_expenses_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);

-- ===============================================
-- Create Budgets Table (New - Core Feature)
-- ===============================================
CREATE TABLE IF NOT EXISTS budgets (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL,
  category_id INTEGER,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  budgeted_amount NUMERIC(12, 2) NOT NULL CHECK (budgeted_amount > 0),
  spent_amount NUMERIC(12, 2) DEFAULT 0.00 CHECK (spent_amount >= 0),
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  alert_threshold NUMERIC(5, 2) DEFAULT 80.00 CHECK (alert_threshold BETWEEN 0 AND 100), -- Percentage
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_budgets_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_budgets_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL,
  CONSTRAINT check_date_range
    CHECK (end_date > start_date)
);

-- ===============================================
-- Create Indexes for Performance
-- ===============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- Income indexes
CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(income_date);
CREATE INDEX IF NOT EXISTS idx_income_category ON income(category_id);
CREATE INDEX IF NOT EXISTS idx_income_recurring ON income(is_recurring);
CREATE INDEX IF NOT EXISTS idx_income_user_date ON income(user_id, income_date);

-- Expenses indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_recurring ON expenses(is_recurring);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_payment_method ON expenses(payment_method);

-- Budgets indexes
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period_type);
CREATE INDEX IF NOT EXISTS idx_budgets_active ON budgets(is_active);
CREATE INDEX IF NOT EXISTS idx_budgets_dates ON budgets(start_date, end_date);

-- ===============================================
-- Create Triggers for Updated_at Timestamps
-- ===============================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_income_updated_at 
  BEFORE UPDATE ON income 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON expenses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at 
  BEFORE UPDATE ON budgets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- Insert Default Categories
-- ===============================================

INSERT INTO categories (name, type, color, icon, description) VALUES
-- Income Categories
('Salary', 'INCOME', '#10B981', 'briefcase', 'Regular employment income'),
('Freelance', 'INCOME', '#3B82F6', 'laptop', 'Freelance and contract work'),
('Business', 'INCOME', '#8B5CF6', 'building', 'Business and entrepreneurship income'),
('Investment', 'INCOME', '#F59E0B', 'trending-up', 'Dividends, interest, and investment returns'),
('Rental', 'INCOME', '#EF4444', 'home', 'Rental property income'),
('Other Income', 'INCOME', '#6B7280', 'plus-circle', 'Miscellaneous income sources'),

-- Expense Categories
('Housing', 'EXPENSE', '#DC2626', 'home', 'Rent, mortgage, utilities, maintenance'),
('Transportation', 'EXPENSE', '#2563EB', 'car', 'Car payments, gas, public transit'),
('Food & Dining', 'EXPENSE', '#059669', 'utensils', 'Groceries, restaurants, food delivery'),
('Healthcare', 'EXPENSE', '#DC2626', 'heart', 'Medical expenses, insurance, pharmacy'),
('Entertainment', 'EXPENSE', '#7C3AED', 'music', 'Movies, games, hobbies, subscriptions'),
('Shopping', 'EXPENSE', '#DB2777', 'shopping-bag', 'Clothing, electronics, personal items'),
('Education', 'EXPENSE', '#0891B2', 'book-open', 'Tuition, courses, books, training'),
('Travel', 'EXPENSE', '#EA580C', 'map', 'Vacation, business travel, hotels'),
('Insurance', 'EXPENSE', '#374151', 'shield', 'Life, auto, home insurance premiums'),
('Debt Payments', 'EXPENSE', '#991B1B', 'credit-card', 'Credit card, loan payments'),
('Savings', 'EXPENSE', '#065F46', 'piggy-bank', 'Emergency fund, retirement savings'),
('Other Expenses', 'EXPENSE', '#6B7280', 'more-horizontal', 'Miscellaneous expenses');

-- ===============================================
-- Create Views for Common Queries
-- ===============================================

-- User Financial Summary View
CREATE OR REPLACE VIEW user_financial_summary AS
SELECT 
    u.id AS user_id,
    u.full_name,
    u.email,
    COALESCE(income_summary.total_income, 0) AS total_income,
    COALESCE(expense_summary.total_expenses, 0) AS total_expenses,
    COALESCE(income_summary.total_income, 0) - COALESCE(expense_summary.total_expenses, 0) AS net_income,
    income_summary.income_count,
    expense_summary.expense_count
FROM users u
LEFT JOIN (
    SELECT 
        user_id,
        SUM(amount) AS total_income,
        COUNT(*) AS income_count
    FROM income 
    GROUP BY user_id
) income_summary ON u.id = income_summary.user_id
LEFT JOIN (
    SELECT 
        user_id,
        SUM(amount) AS total_expenses,
        COUNT(*) AS expense_count
    FROM expenses 
    GROUP BY user_id
) expense_summary ON u.id = expense_summary.user_id;

-- Monthly Budget Performance View
CREATE OR REPLACE VIEW monthly_budget_performance AS
SELECT 
    b.id AS budget_id,
    b.user_id,
    b.name AS budget_name,
    b.budgeted_amount,
    COALESCE(expense_totals.spent_amount, 0) AS actual_spent,
    b.budgeted_amount - COALESCE(expense_totals.spent_amount, 0) AS remaining_amount,
    CASE 
        WHEN b.budgeted_amount > 0 THEN 
            ROUND((COALESCE(expense_totals.spent_amount, 0) / b.budgeted_amount * 100), 2)
        ELSE 0 
    END AS spent_percentage,
    b.alert_threshold,
    b.period_type,
    b.start_date,
    b.end_date,
    b.is_active
FROM budgets b
LEFT JOIN (
    SELECT 
        category_id,
        SUM(amount) AS spent_amount
    FROM expenses e
    WHERE e.expense_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY category_id
) expense_totals ON b.category_id = expense_totals.category_id
WHERE b.is_active = true;

-- ===============================================
-- Database Schema Information
-- ===============================================

-- Create a function to get database info
CREATE OR REPLACE FUNCTION get_database_info()
RETURNS TABLE (
    table_name TEXT,
    column_count BIGINT,
    row_count BIGINT,
    size_pretty TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename AS table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.tablename) AS column_count,
        (SELECT n_tup_ins - n_tup_del FROM pg_stat_user_tables WHERE schemaname||'.'||relname = schemaname||'.'||tablename) AS row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size_pretty
    FROM pg_tables t
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- Sample Data for Testing (Optional)
-- ===============================================

-- Uncomment the following lines to insert sample data for testing

/*
-- Sample Users
INSERT INTO users (full_name, email, password_hash) VALUES
('John Doe', 'john.doe@example.com', '$2a$12$example_hash_1'),
('Jane Smith', 'jane.smith@example.com', '$2a$12$example_hash_2'),
('Mike Johnson', 'mike.johnson@example.com', '$2a$12$example_hash_3');

-- Sample Income (using user_id = 1)
INSERT INTO income (user_id, category_id, source, amount, income_date, description) VALUES
(1, 1, 'Software Developer Salary', 5000.00, CURRENT_DATE - INTERVAL '1 day', 'Monthly salary'),
(1, 2, 'Web Development Project', 1500.00, CURRENT_DATE - INTERVAL '5 days', 'Freelance project completion'),
(1, 4, 'Stock Dividends', 200.00, CURRENT_DATE - INTERVAL '10 days', 'Quarterly dividend payment');

-- Sample Expenses (using user_id = 1)
INSERT INTO expenses (user_id, category_id, category, amount, expense_date, description, payment_method) VALUES
(1, 7, 'Housing', 1200.00, CURRENT_DATE - INTERVAL '1 day', 'Monthly rent payment', 'Bank Transfer'),
(1, 9, 'Food & Dining', 85.50, CURRENT_DATE - INTERVAL '2 days', 'Grocery shopping', 'Credit Card'),
(1, 8, 'Transportation', 45.00, CURRENT_DATE - INTERVAL '3 days', 'Gas fill-up', 'Debit Card'),
(1, 11, 'Entertainment', 25.99, CURRENT_DATE - INTERVAL '4 days', 'Netflix subscription', 'Credit Card');

-- Sample Budgets (using user_id = 1)
INSERT INTO budgets (user_id, category_id, name, budgeted_amount, period_type, start_date, end_date, description) VALUES
(1, 7, 'Housing Budget', 1300.00, 'MONTHLY', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day', 'Monthly housing expenses limit'),
(1, 9, 'Food Budget', 400.00, 'MONTHLY', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day', 'Monthly food and dining budget'),
(1, 8, 'Transportation Budget', 200.00, 'MONTHLY', DATE_TRUNC('month', CURRENT_DATE), DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day', 'Monthly transportation costs');
*/

-- ===============================================
-- Database Setup Complete
-- ===============================================

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'WealthWise database schema created successfully!';
    RAISE NOTICE 'Tables: users, categories, income, expenses, budgets';
    RAISE NOTICE 'Indexes: Created for performance optimization';
    RAISE NOTICE 'Triggers: Auto-update timestamps on record changes';
    RAISE NOTICE 'Views: Financial summaries and budget performance';
    RAISE NOTICE 'Categories: Default income and expense categories added';
    RAISE NOTICE 'Ready for Level 1 Task 2 REST API implementation!';
END $$;