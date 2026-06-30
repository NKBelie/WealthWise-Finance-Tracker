const Budget = require("../models/budget.model");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const createBudget = asyncHandler(async (req, res) => {
  const budgetData = req.body;
  
  // Check for overlapping budgets in the same category and period
  if (budgetData.category_id) {
    const existingBudgets = await Budget.findByUserAndPeriod(
      budgetData.user_id,
      budgetData.period_type,
      budgetData.start_date,
      budgetData.end_date
    );

    const overlapping = existingBudgets.find(
      budget => budget.category_id === budgetData.category_id
    );

    if (overlapping) {
      throw new HttpError(
        "A budget for this category and period already exists", 
        409
      );
    }
  }

  const budget = await Budget.create(budgetData);

  res.status(201).json({
    status: "success",
    message: "Budget created successfully",
    data: { budget }
  });
});

const getBudgets = asyncHandler(async (req, res) => {
  const filters = {
    user_id: req.query.user_id,
    is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
    period_type: req.query.period_type,
    category_id: req.query.category_id,
    current_period: req.query.current_period === 'true'
  };

  // Remove undefined filters
  Object.keys(filters).forEach(key => 
    filters[key] === undefined && delete filters[key]
  );

  const budgets = await Budget.findAll(filters);

  res.status(200).json({
    status: "success",
    results: budgets.length,
    data: { budgets }
  });
});

const getBudgetById = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    throw new HttpError("Budget not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: { budget }
  });
});

const updateBudget = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  const budget = await Budget.update(req.params.id, updateData);

  if (!budget) {
    throw new HttpError("Budget not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Budget updated successfully",
    data: { budget }
  });
});

const deleteBudget = asyncHandler(async (req, res) => {
  const deletedBudget = await Budget.remove(req.params.id);

  if (!deletedBudget) {
    throw new HttpError("Budget not found", 404);
  }

  res.status(204).send();
});

// Budget-specific controller methods

const getBudgetProgress = asyncHandler(async (req, res) => {
  const progress = await Budget.getBudgetProgress(req.params.id);

  if (!progress) {
    throw new HttpError("Budget not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: { progress }
  });
});

const getUserBudgetSummary = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const { period_type = 'MONTHLY' } = req.query;

  const summary = await Budget.getUserBudgetSummary(user_id, period_type);

  if (!summary) {
    throw new HttpError("No budget data found for user", 404);
  }

  res.status(200).json({
    status: "success",
    data: { summary }
  });
});

const getBudgetAlerts = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  const alerts = await Budget.getBudgetsNeedingAlert(user_id);

  res.status(200).json({
    status: "success",
    results: alerts.length,
    data: { alerts }
  });
});

const syncBudgetWithExpenses = asyncHandler(async (req, res) => {
  const budget = await Budget.syncBudgetWithExpenses(req.params.id);

  if (!budget) {
    throw new HttpError("Budget not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Budget synced with expenses successfully",
    data: { budget }
  });
});

const updateBudgetSpending = asyncHandler(async (req, res) => {
  const { spent_amount } = req.body;

  if (spent_amount === undefined || spent_amount < 0) {
    throw new HttpError("Valid spent_amount is required", 400);
  }

  const budget = await Budget.updateSpentAmount(req.params.id, spent_amount);

  if (!budget) {
    throw new HttpError("Budget not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Budget spending updated successfully",
    data: { budget }
  });
});

const getBudgetsByCategory = asyncHandler(async (req, res) => {
  const { user_id, category_id } = req.params;

  const budgets = await Budget.getBudgetsByCategory(user_id, category_id);

  res.status(200).json({
    status: "success",
    results: budgets.length,
    data: { budgets }
  });
});

// Bulk operations
const createMultipleBudgets = asyncHandler(async (req, res) => {
  const { budgets } = req.body;

  if (!Array.isArray(budgets) || budgets.length === 0) {
    throw new HttpError("Budgets array is required", 400);
  }

  const createdBudgets = [];
  const errors = [];

  for (let i = 0; i < budgets.length; i++) {
    try {
      const budget = await Budget.create(budgets[i]);
      createdBudgets.push(budget);
    } catch (error) {
      errors.push({
        index: i,
        budget: budgets[i],
        error: error.message
      });
    }
  }

  res.status(201).json({
    status: "success",
    message: `Created ${createdBudgets.length} budgets successfully`,
    data: { 
      budgets: createdBudgets,
      errors: errors.length > 0 ? errors : undefined
    }
  });
});

const toggleBudgetStatus = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    throw new HttpError("Budget not found", 404);
  }

  const updatedBudget = await Budget.update(req.params.id, {
    is_active: !budget.is_active
  });

  res.status(200).json({
    status: "success",
    message: `Budget ${updatedBudget.is_active ? 'activated' : 'deactivated'} successfully`,
    data: { budget: updatedBudget }
  });
});

module.exports = {
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
};