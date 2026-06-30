const db = require("../config/db");

const selectExpenseQuery = `
  SELECT
    expenses.id,
    expenses.user_id,
    users.full_name AS user_full_name,
    expenses.category,
    expenses.amount,
    expenses.description,
    expenses.expense_date,
    expenses.created_at
  FROM expenses
  INNER JOIN users ON users.id = expenses.user_id
`;

const create = async ({
  user_id,
  category,
  amount,
  description,
  expense_date
}) => {
  const result = await db.query(
    `INSERT INTO expenses (user_id, category, amount, description, expense_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [user_id, category, amount, description || null, expense_date]
  );

  return findById(result.rows[0].id);
};

const findAll = async ({ user_id } = {}) => {
  const values = [];
  let whereClause = "";

  if (user_id) {
    values.push(user_id);
    whereClause = `WHERE expenses.user_id = $${values.length}`;
  }

  const result = await db.query(
    `${selectExpenseQuery}
     ${whereClause}
     ORDER BY expenses.expense_date DESC, expenses.created_at DESC`,
    values
  );

  return result.rows;
};

const findById = async (id) => {
  const result = await db.query(
    `${selectExpenseQuery}
     WHERE expenses.id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const update = async (id, data) => {
  const allowedFields = [
    "user_id",
    "category",
    "amount",
    "description",
    "expense_date"
  ];
  const values = [];
  const setClauses = [];

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      values.push(data[field]);
      setClauses.push(`${field} = $${values.length}`);
    }
  });

  values.push(id);

  const result = await db.query(
    `UPDATE expenses
     SET ${setClauses.join(", ")}
     WHERE id = $${values.length}
     RETURNING id`,
    values
  );

  if (!result.rows[0]) {
    return null;
  }

  return findById(result.rows[0].id);
};

const remove = async (id) => {
  const result = await db.query(
    "DELETE FROM expenses WHERE id = $1 RETURNING id",
    [id]
  );

  return result.rows[0] || null;
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove
};
