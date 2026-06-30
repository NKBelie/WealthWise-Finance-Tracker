const Joi = require("joi");
const { dateOnly } = require("./common.validator");

const createIncomeSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  source: Joi.string().trim().min(2).max(100).required(),
  amount: Joi.number().positive().precision(2).required(),
  income_date: dateOnly.required()
});

const updateIncomeSchema = Joi.object({
  user_id: Joi.number().integer().positive().optional(),
  source: Joi.string().trim().min(2).max(100).optional(),
  amount: Joi.number().positive().precision(2).optional(),
  income_date: dateOnly.optional()
}).min(1);

module.exports = {
  createIncomeSchema,
  updateIncomeSchema
};
