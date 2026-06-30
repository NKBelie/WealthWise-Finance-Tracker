const db = require("../config/db");

const selectIncomeQuery = `
  SELECT
    income.id,
    income.user_id,
    users.full_name AS user_full_name,
    income.source,
    income.amount,
    income.income_date,
    income.created_at
  FROM income
  INNER JOIN users ON users.id = income.user_id
`;

const create = async ({ user_id, source, amount, income_date }) => {
  const result = await db.query(
    `INSERT INTO income (user_id, source, amount, income_date)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [user_id, source, amount, income_date]
  );

  return findById(result.rows[0].id);
};

const findAll = async ({ user_id } = {}) => {
  const values = [];
  let whereClause = "";

  if (user_id) {
    values.push(user_id);
    whereClause = `WHERE income.user_id = $${values.length}`;
  }

  const result = await db.query(
    `${selectIncomeQuery}
     ${whereClause}
     ORDER BY income.income_date DESC, income.created_at DESC`,
    values
  );

  return result.rows;
};

const findById = async (id) => {
  const result = await db.query(
    `${selectIncomeQuery}
     WHERE income.id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const update = async (id, data) => {
  const allowedFields = ["user_id", "source", "amount", "income_date"];
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
    `UPDATE income
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
    "DELETE FROM income WHERE id = $1 RETURNING id",
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
