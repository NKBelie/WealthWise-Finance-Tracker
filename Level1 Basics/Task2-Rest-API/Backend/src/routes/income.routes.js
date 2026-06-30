const express = require("express");

const {
  createIncome,
  getIncomeRecords,
  getIncomeById,
  updateIncome,
  deleteIncome
} = require("../controllers/income.controller");
const validate = require("../middleware/validate.middleware");
const {
  idParamSchema,
  userIdQuerySchema
} = require("../validators/common.validator");
const {
  createIncomeSchema,
  updateIncomeSchema
} = require("../validators/income.validator");

const router = express.Router();

router
  .route("/")
  .post(validate(createIncomeSchema), createIncome)
  .get(validate(userIdQuerySchema, "query"), getIncomeRecords);

router
  .route("/:id")
  .get(validate(idParamSchema, "params"), getIncomeById)
  .put(
    validate(idParamSchema, "params"),
    validate(updateIncomeSchema),
    updateIncome
  )
  .delete(validate(idParamSchema, "params"), deleteIncome);

module.exports = router;
