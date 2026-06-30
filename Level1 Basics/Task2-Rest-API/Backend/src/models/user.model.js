const db = require("../config/db");

const publicUserColumns = "id, full_name, email, created_at";

const create = async ({ full_name, email, password_hash }) => {
  const result = await db.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING ${publicUserColumns}`,
    [full_name, email, password_hash]
  );

  return result.rows[0];
};

const findAll = async () => {
  const result = await db.query(
    `SELECT ${publicUserColumns}
     FROM users
     ORDER BY created_at DESC`
  );

  return result.rows;
};

const findById = async (id) => {
  const result = await db.query(
    `SELECT ${publicUserColumns}
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

const update = async (id, data) => {
  const allowedFields = ["full_name", "email", "password_hash"];
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
    `UPDATE users
     SET ${setClauses.join(", ")}
     WHERE id = $${values.length}
     RETURNING ${publicUserColumns}`,
    values
  );

  return result.rows[0] || null;
};

const remove = async (id) => {
  const result = await db.query(
    "DELETE FROM users WHERE id = $1 RETURNING id",
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
