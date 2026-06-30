const Joi = require("joi");

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const userIdQuerySchema = Joi.object({
  user_id: Joi.number().integer().positive().optional()
});

const dateOnly = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .message("date must use YYYY-MM-DD format");

module.exports = {
  idParamSchema,
  userIdQuerySchema,
  dateOnly
};
