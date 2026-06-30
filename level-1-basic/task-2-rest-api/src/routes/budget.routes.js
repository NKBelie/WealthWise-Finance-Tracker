const express = require("express");
const {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
  getUserBudgetSummary,
  getBudgetAlerts,
  syncBudgetWithExpenses,
  updateBudgetSpending,
  getBudgetsByCategory,
  createMultipleBudgets,
  toggleBudgetStatus
} = require("../controllers/budget.controller");

const { validateRequest } = require("../middleware/validate.middleware");
const {
  budgetCreationValidation,
  budgetUpdateValidation,
  budgetIdValidation,
  userIdValidation,
  budgetSpendingValidation,
  multipleBudgetsValidation
} = require("../validators/budget.validator");

const router = express.Router();

// ===============================================
// Core CRUD Operations
// ===============================================

// Create a new budget
router.post("/", budgetCreationValidation, validateRequest, createBudget);

// Get all budgets with filtering
router.get("/", getBudgets);

// Create multiple budgets at once
router.post("/bulk", multipleBudgetsValidation, validateRequest, createMultipleBudgets);

// Get budget by ID
router.get("/:id", budgetIdValidation, validateRequest, getBudgetById);

// Update budget by ID
router.put("/:id", [budgetIdValidation, budgetUpdateValidation], validateRequest, updateBudget);

// Delete budget by ID
router.delete("/:id", budgetIdValidation, validateRequest, deleteBudget);

// ===============================================
// Budget Management Operations
// ===============================================

// Get budget progress and status
router.get("/:id/progress", budgetIdValidation, validateRequest, getBudgetProgress);

// Sync budget with actual expenses
router.post("/:id/sync", budgetIdValidation, validateRequest, syncBudgetWithExpenses);

// Update budget spending amount
router.patch("/:id/spending", 
  [budgetIdValidation, budgetSpendingValidation], 
  validateRequest, 
  updateBudgetSpending
);

// Toggle budget active/inactive status
router.patch("/:id/toggle", budgetIdValidation, validateRequest, toggleBudgetStatus);

// ===============================================
// User-Specific Budget Operations
// ===============================================

// Get user budget summary
router.get("/users/:user_id/summary", 
  userIdValidation, 
  validateRequest, 
  getUserBudgetSummary
);

// Get budget alerts for user
router.get("/users/:user_id/alerts", 
  userIdValidation, 
  validateRequest, 
  getBudgetAlerts
);

// Get budgets by user and category
router.get("/users/:user_id/categories/:category_id", 
  [userIdValidation, budgetIdValidation], 
  validateRequest, 
  getBudgetsByCategory
);

module.exports = router;