const Joi = require("joi");

const passwordRule = Joi.string()
  .min(8)
  .max(72)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  .message("password must be 8-72 characters and include a letter and number");

const createUserSchema = Joi.object({
  full_name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().max(255).required(),
  password: passwordRule.required()
});

const updateUserSchema = Joi.object({
  full_name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().lowercase().email().max(255).optional(),
  password: passwordRule.optional()
}).min(1);

module.exports = {
  createUserSchema,
  updateUserSchema
};
