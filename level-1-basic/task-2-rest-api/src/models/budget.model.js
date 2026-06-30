const db = require("../config/db");

const publicBudgetColumns = `
  id, user_id, category_id, name, description, 
  budgeted_amount, spent_amount, period_type, 
  start_date, end_date, alert_threshold, is_active, 
  created_at, updated_at
`;

const create = async (budgetData) => {
  const {
    user_id,
    category_id,
    name,
    description,
    budgeted_amount,
    period_type,
    start_date,
    end_date,
    alert_threshold = 80.00
  } = budgetData;

  const result = await db.query(
    `INSERT INTO budgets (
       user_id, category_id, name, description, budgeted_amount, 
       period_type, start_date, end_date, alert_threshold
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${publicBudgetColumns}`,
    [user_id, category_id, name, description, budgeted_amount, 
     period_type, start_date, end_date, alert_threshold]
  );

  return result.rows[0];
};

const findAll = async (filters = {}) => {
  let query = `
    SELECT 
      b.${publicBudgetColumns.replace(/(\w+)/g, 'b.$1')},
      c.name AS category_name,
      c.color AS category_color,
      c.icon AS category_icon
    FROM budgets b
    LEFT JOIN categories c ON b.category_id = c.id
  `;
  
  const conditions = [];
  const values = [];

  // Add filters
  if (filters.user_id) {
    conditions.push(`b.user_id = $${values.length + 1}`);
    values.push(filters.user_id);
  }

  if (filters.is_active !== undefined) {
    conditions.push(`b.is_active = $${values.length + 1}`);
    values.push(filters.is_active);
  }

  if (filters.period_type) {
    conditions.push(`b.period_type = $${values.length + 1}`);
    values.push(filters.period_type);
  }

  if (filters.category_id) {
    conditions.push(`b.category_id = $${values.length + 1}`);
    values.push(filters.category_id);
  }

  // Add current period filter
  if (filters.current_period) {
    conditions.push(`CURRENT_DATE BETWEEN b.start_date AND b.end_date`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY b.created_at DESC`;

  const result = await db.query(query, values);
  return result.rows;
};

const findById = async (id) => {
  const result = await db.query(
    `SELECT 
       b.${publicBudgetColumns.replace(/(\w+)/g, 'b.$1')},
       c.name AS category_name,
       c.color AS category_color,
       c.icon AS category_icon
     FROM budgets b
     LEFT JOIN categories c ON b.category_id = c.id
     WHERE b.id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const findByUserAndPeriod = async (user_id, period_type, start_date, end_date) => {
  const result = await db.query(
    `SELECT ${publicBudgetColumns}
     FROM budgets
     WHERE user_id = $1 
       AND period_type = $2 
       AND start_date = $3 
       AND end_date = $4
       AND is_active = true`,
    [user_id, period_type, start_date, end_date]
  );

  return result.rows;
};

const update = async (id, data) => {
  const allowedFields = [
    "name", "description", "budgeted_amount", "spent_amount", 
    "period_type", "start_date", "end_date", "alert_threshold", 
    "is_active", "category_id"
  ];
  
  const values = [];
  const setClauses = [];

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      values.push(data[field]);
      setClauses.push(`${field} = $${values.length}`);
    }
  });

  if (setClauses.length === 0) {
    return null; // No valid fields to update
  }

  values.push(id);

  const result = await db.query(
    `UPDATE budgets
     SET ${setClauses.join(", ")}
     WHERE id = $${values.length}
     RETURNING ${publicBudgetColumns}`,
    values
  );

  return result.rows[0] || null;
};

const remove = async (id) => {
  const result = await db.query(
    "DELETE FROM budgets WHERE id = $1 RETURNING id",
    [id]
  );

  return result.rows[0] || null;
};

// Budget-specific functions

const updateSpentAmount = async (budget_id, spent_amount) => {
  const result = await db.query(
    `UPDATE budgets 
     SET spent_amount = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING ${publicBudgetColumns}`,
    [budget_id, spent_amount]
  );

  return result.rows[0] || null;
};

const getBudgetProgress = async (budget_id) => {
  const result = await db.query(
    `SELECT 
       id,
       name,
       budgeted_amount,
       spent_amount,
       budgeted_amount - spent_amount AS remaining_amount,
       CASE 
         WHEN budgeted_amount > 0 THEN 
           ROUND((spent_amount / budgeted_amount * 100), 2)
         ELSE 0 
       END AS spent_percentage,
       alert_threshold,
       CASE 
         WHEN budgeted_amount > 0 AND (spent_amount / budgeted_amount * 100) >= alert_threshold 
         THEN true 
         ELSE false 
       END AS alert_triggered,
       period_type,
       start_date,
       end_date,
       CASE 
         WHEN CURRENT_DATE BETWEEN start_date AND end_date THEN 'ACTIVE'
         WHEN CURRENT_DATE < start_date THEN 'UPCOMING'
         ELSE 'EXPIRED'
       END AS status
     FROM budgets 
     WHERE id = $1`,
    [budget_id]
  );

  return result.rows[0] || null;
};

const getUserBudgetSummary = async (user_id, period_type = 'MONTHLY') => {
  const result = await db.query(
    `SELECT 
       COUNT(*) AS total_budgets,
       SUM(budgeted_amount) AS total_budgeted,
       SUM(spent_amount) AS total_spent,
       SUM(budgeted_amount - spent_amount) AS total_remaining,
       ROUND(AVG(CASE 
         WHEN budgeted_amount > 0 THEN (spent_amount / budgeted_amount * 100)
         ELSE 0 
       END), 2) AS avg_spent_percentage,
       COUNT(CASE 
         WHEN budgeted_amount > 0 AND (spent_amount / budgeted_amount * 100) >= alert_threshold 
         THEN 1 
       END) AS budgets_over_threshold
     FROM budgets 
     WHERE user_id = $1 
       AND period_type = $2 
       AND is_active = true
       AND CURRENT_DATE BETWEEN start_date AND end_date`,
    [user_id, period_type]
  );

  return result.rows[0] || null;
};

const getBudgetsNeedingAlert = async (user_id) => {
  const result = await db.query(
    `SELECT 
       ${publicBudgetColumns},
       ROUND((spent_amount / budgeted_amount * 100), 2) AS spent_percentage
     FROM budgets 
     WHERE user_id = $1 
       AND is_active = true
       AND budgeted_amount > 0
       AND (spent_amount / budgeted_amount * 100) >= alert_threshold
       AND CURRENT_DATE BETWEEN start_date AND end_date
     ORDER BY (spent_amount / budgeted_amount) DESC`,
    [user_id]
  );

  return result.rows;
};

const syncBudgetWithExpenses = async (budget_id) => {
  const result = await db.query(
    `UPDATE budgets 
     SET spent_amount = (
       SELECT COALESCE(SUM(e.amount), 0)
       FROM expenses e
       WHERE e.category_id = budgets.category_id
         AND e.user_id = budgets.user_id
         AND e.expense_date BETWEEN budgets.start_date AND budgets.end_date
     ),
     updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING ${publicBudgetColumns}`,
    [budget_id]
  );

  return result.rows[0] || null;
};

const getBudgetsByCategory = async (user_id, category_id) => {
  const result = await db.query(
    `SELECT ${publicBudgetColumns}
     FROM budgets
     WHERE user_id = $1 AND category_id = $2
     ORDER BY start_date DESC`,
    [user_id, category_id]
  );

  return result.rows;
};

module.exports = {
  create,
  findAll,
  findById,
  findByUserAndPeriod,
  update,
  remove,
  updateSpentAmount,
  getBudgetProgress,
  getUserBudgetSummary,
  getBudgetsNeedingAlert,
  syncBudgetWithExpenses,
  getBudgetsByCategory
};