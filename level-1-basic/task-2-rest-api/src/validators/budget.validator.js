const Joi = require("joi");

// Common validation schemas
const idSchema = Joi.number().integer().min(1).required();
const userIdSchema = Joi.number().integer().min(1).required();
const categoryIdSchema = Joi.number().integer().min(1).optional().allow(null);
const amountSchema = Joi.number().positive().precision(2).max(999999999.99);
const dateSchema = Joi.date().iso();

// Budget-specific schemas
const periodTypeSchema = Joi.string().valid('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY').required();
const alertThresholdSchema = Joi.number().min(0).max(100).precision(2).default(80.00);

// Budget creation validation
const budgetCreationValidation = [
  Joi.object({
    user_id: userIdSchema,
    category_id: categoryIdSchema,
    name: Joi.string().min(1).max(100).required()
      .messages({
        'string.empty': 'Budget name is required',
        'string.min': 'Budget name must be at least 1 character long',
        'string.max': 'Budget name cannot exceed 100 characters'
      }),
    description: Joi.string().max(500).optional().allow(''),
    budgeted_amount: amountSchema.required()
      .messages({
        'number.positive': 'Budgeted amount must be positive',
        'number.max': 'Budgeted amount is too large',
        'any.required': 'Budgeted amount is required'
      }),
    period_type: periodTypeSchema,
    start_date: dateSchema.required()
      .messages({
        'date.base': 'Start date must be a valid date',
        'any.required': 'Start date is required'
      }),
    end_date: dateSchema.required()
      .greater(Joi.ref('start_date'))
      .messages({
        'date.base': 'End date must be a valid date',
        'date.greater': 'End date must be after start date',
        'any.required': 'End date is required'
      }),
    alert_threshold: alertThresholdSchema
  }).custom((value, helpers) => {
    // Custom validation for date range based on period type
    const { period_type, start_date, end_date } = value;
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let expectedDays;
    switch (period_type) {
      case 'WEEKLY':
        expectedDays = 7;
        break;
      case 'MONTHLY':
        expectedDays = 31; // Allow some flexibility for different month lengths
        break;
      case 'QUARTERLY':
        expectedDays = 93; // ~3 months
        break;
      case 'YEARLY':
        expectedDays = 366; // Account for leap years
        break;
      default:
        return helpers.error('any.invalid');
    }

    if (diffDays > expectedDays + 5) { // Allow 5-day buffer
      return helpers.error('custom.dateRangeMismatch', { 
        period_type, 
        expected: expectedDays, 
        actual: diffDays 
      });
    }

    return value;
  }, 'Date range validation')
  .messages({
    'custom.dateRangeMismatch': 'Date range does not match the selected period type'
  })
];

// Budget update validation
const budgetUpdateValidation = [
  Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().max(500).optional().allow(''),
    budgeted_amount: amountSchema.optional(),
    spent_amount: Joi.number().min(0).precision(2).max(999999999.99).optional(),
    period_type: Joi.string().valid('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY').optional(),
    start_date: dateSchema.optional(),
    end_date: dateSchema.optional(),
    alert_threshold: Joi.number().min(0).max(100).precision(2).optional(),
    is_active: Joi.boolean().optional(),
    category_id: categoryIdSchema
  }).custom((value, helpers) => {
    // If both start_date and end_date are provided, validate them
    if (value.start_date && value.end_date) {
      if (new Date(value.end_date) <= new Date(value.start_date)) {
        return helpers.error('custom.endDateBeforeStart');
      }
    }

    // If spent_amount is greater than budgeted_amount, show warning (but allow)
    if (value.spent_amount && value.budgeted_amount && 
        value.spent_amount > value.budgeted_amount) {
      // This is a warning, not an error - budget overruns are allowed
      console.warn(`Budget overrun detected: spent ${value.spent_amount} exceeds budget ${value.budgeted_amount}`);
    }

    return value;
  })
  .messages({
    'custom.endDateBeforeStart': 'End date must be after start date'
  })
];

// Budget ID validation
const budgetIdValidation = [
  Joi.object({
    id: idSchema
  }).messages({
    'number.base': 'Budget ID must be a number',
    'number.integer': 'Budget ID must be an integer',
    'number.min': 'Budget ID must be positive',
    'any.required': 'Budget ID is required'
  })
];

// User ID validation
const userIdValidation = [
  Joi.object({
    user_id: userIdSchema
  }).messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer', 
    'number.min': 'User ID must be positive',
    'any.required': 'User ID is required'
  })
];

// Budget spending update validation
const budgetSpendingValidation = [
  Joi.object({
    spent_amount: amountSchema.required()
      .messages({
        'number.positive': 'Spent amount must be positive',
        'number.max': 'Spent amount is too large',
        'any.required': 'Spent amount is required'
      })
  })
];

// Multiple budgets validation
const multipleBudgetsValidation = [
  Joi.object({
    budgets: Joi.array()
      .items(
        Joi.object({
          user_id: userIdSchema,
          category_id: categoryIdSchema,
          name: Joi.string().min(1).max(100).required(),
          description: Joi.string().max(500).optional().allow(''),
          budgeted_amount: amountSchema.required(),
          period_type: periodTypeSchema,
          start_date: dateSchema.required(),
          end_date: dateSchema.required().greater(Joi.ref('start_date')),
          alert_threshold: alertThresholdSchema
        })
      )
      .min(1)
      .max(50) // Limit bulk operations
      .required()
      .messages({
        'array.min': 'At least one budget is required',
        'array.max': 'Cannot create more than 50 budgets at once',
        'any.required': 'Budgets array is required'
      })
  })
];

// Query parameter validation for filtering
const budgetQueryValidation = [
  Joi.object({
    user_id: Joi.number().integer().min(1).optional(),
    is_active: Joi.string().valid('true', 'false').optional(),
    period_type: Joi.string().valid('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY').optional(),
    category_id: Joi.number().integer().min(1).optional(),
    current_period: Joi.string().valid('true', 'false').optional(),
    limit: Joi.number().integer().min(1).max(100).default(10).optional(),
    offset: Joi.number().integer().min(0).default(0).optional(),
    sort_by: Joi.string().valid('created_at', 'start_date', 'budgeted_amount', 'spent_amount').default('created_at').optional(),
    sort_order: Joi.string().valid('asc', 'desc').default('desc').optional()
  })
];

// Budget summary query validation
const budgetSummaryQueryValidation = [
  Joi.object({
    period_type: Joi.string().valid('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY').default('MONTHLY').optional()
  })
];

module.exports = {
  budgetCreationValidation,
  budgetUpdateValidation,
  budgetIdValidation,
  userIdValidation,
  budgetSpendingValidation,
  multipleBudgetsValidation,
  budgetQueryValidation,
  budgetSummaryQueryValidation
};