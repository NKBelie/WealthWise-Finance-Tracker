const db = require("../config/db");

const publicCategoryColumns = `
  id, name, type, color, icon, description, is_active, created_at, updated_at
`;

const create = async (categoryData) => {
  const {
    name,
    type,
    color = '#3B82F6',
    icon = 'dollar-sign',
    description
  } = categoryData;

  const result = await db.query(
    `INSERT INTO categories (name, type, color, icon, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${publicCategoryColumns}`,
    [name, type, color, icon, description]
  );

  return result.rows[0];
};

const findAll = async (filters = {}) => {
  let query = `SELECT ${publicCategoryColumns} FROM categories`;
  const conditions = [];
  const values = [];

  // Add filters
  if (filters.type) {
    conditions.push(`type = $${values.length + 1} OR type = 'BOTH'`);
    values.push(filters.type);
  }

  if (filters.is_active !== undefined) {
    conditions.push(`is_active = $${values.length + 1}`);
    values.push(filters.is_active);
  }

  if (filters.name_search) {
    conditions.push(`name ILIKE $${values.length + 1}`);
    values.push(`%${filters.name_search}%`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY name ASC`;

  const result = await db.query(query, values);
  return result.rows;
};

const findById = async (id) => {
  const result = await db.query(
    `SELECT ${publicCategoryColumns} FROM categories WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const findByName = async (name) => {
  const result = await db.query(
    `SELECT ${publicCategoryColumns} FROM categories WHERE LOWER(name) = LOWER($1)`,
    [name]
  );

  return result.rows[0] || null;
};

const update = async (id, data) => {
  const allowedFields = ["name", "type", "color", "icon", "description", "is_active"];
  const values = [];
  const setClauses = [];

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      values.push(data[field]);
      setClauses.push(`${field} = $${values.length}`);
    }
  });

  if (setClauses.length === 0) {
    return null;
  }

  values.push(id);

  const result = await db.query(
    `UPDATE categories
     SET ${setClauses.join(", ")}
     WHERE id = $${values.length}
     RETURNING ${publicCategoryColumns}`,
    values
  );

  return result.rows[0] || null;
};

const remove = async (id) => {
  const result = await db.query(
    "DELETE FROM categories WHERE id = $1 RETURNING id",
    [id]
  );

  return result.rows[0] || null;
};

const getCategoryUsageStats = async () => {
  const result = await db.query(
    `SELECT 
       c.id,
       c.name,
       c.type,
       c.color,
       c.icon,
       COALESCE(income_count.count, 0) AS income_usage,
       COALESCE(expense_count.count, 0) AS expense_usage,
       COALESCE(budget_count.count, 0) AS budget_usage,
       (COALESCE(income_count.count, 0) + COALESCE(expense_count.count, 0) + COALESCE(budget_count.count, 0)) AS total_usage
     FROM categories c
     LEFT JOIN (
       SELECT category_id, COUNT(*) as count 
       FROM income 
       WHERE category_id IS NOT NULL 
       GROUP BY category_id
     ) income_count ON c.id = income_count.category_id
     LEFT JOIN (
       SELECT category_id, COUNT(*) as count 
       FROM expenses 
       WHERE category_id IS NOT NULL 
       GROUP BY category_id
     ) expense_count ON c.id = expense_count.category_id
     LEFT JOIN (
       SELECT category_id, COUNT(*) as count 
       FROM budgets 
       WHERE category_id IS NOT NULL 
       GROUP BY category_id
     ) budget_count ON c.id = budget_count.category_id
     ORDER BY total_usage DESC, c.name ASC`
  );

  return result.rows;
};

const getIncomeCategories = async () => {
  const result = await db.query(
    `SELECT ${publicCategoryColumns} 
     FROM categories 
     WHERE (type = 'INCOME' OR type = 'BOTH') AND is_active = true
     ORDER BY name ASC`
  );

  return result.rows;
};

const getExpenseCategories = async () => {
  const result = await db.query(
    `SELECT ${publicCategoryColumns} 
     FROM categories 
     WHERE (type = 'EXPENSE' OR type = 'BOTH') AND is_active = true
     ORDER BY name ASC`
  );

  return result.rows;
};

module.exports = {
  create,
  findAll,
  findById,
  findByName,
  update,
  remove,
  getCategoryUsageStats,
  getIncomeCategories,
  getExpenseCategories
};