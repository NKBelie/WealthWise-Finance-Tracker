const express = require("express");

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} = require("../controllers/expense.controller");
const validate = require("../middleware/validate.middleware");
const {
  idParamSchema,
  userIdQuerySchema
} = require("../validators/common.validator");
const {
  createExpenseSchema,
  updateExpenseSchema
} = require("../validators/expense.validator");

const router = express.Router();

router
  .route("/")
  .post(validate(createExpenseSchema), createExpense)
  .get(validate(userIdQuerySchema, "query"), getExpenses);

router
  .route("/:id")
  .get(validate(idParamSchema, "params"), getExpenseById)
  .put(
    validate(idParamSchema, "params"),
    validate(updateExpenseSchema),
    updateExpense
  )
  .delete(validate(idParamSchema, "params"), deleteExpense);

module.exports = router;
