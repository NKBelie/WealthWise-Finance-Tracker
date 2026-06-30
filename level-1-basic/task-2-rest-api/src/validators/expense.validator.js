const Joi = require("joi");
const { dateOnly } = require("./common.validator");

const createExpenseSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  category: Joi.string().trim().min(2).max(100).required(),
  amount: Joi.number().positive().precision(2).required(),
  description: Joi.string().trim().max(255).allow("").optional(),
  expense_date: dateOnly.required()
});

const updateExpenseSchema = Joi.object({
  user_id: Joi.number().integer().positive().optional(),
  category: Joi.string().trim().min(2).max(100).optional(),
  amount: Joi.number().positive().precision(2).optional(),
  description: Joi.string().trim().max(255).allow("").optional(),
  expense_date: dateOnly.optional()
}).min(1);

module.exports = {
  createExpenseSchema,
  updateExpenseSchema
};
