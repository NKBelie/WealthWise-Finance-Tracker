const Income = require("../models/income.model");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const createIncome = asyncHandler(async (req, res) => {
  const income = await Income.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Income record created successfully",
    data: { income }
  });
});

const getIncomeRecords = asyncHandler(async (req, res) => {
  const income = await Income.findAll(req.query);

  res.status(200).json({
    status: "success",
    results: income.length,
    data: { income }
  });
});

const getIncomeById = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (!income) {
    throw new HttpError("Income record not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: { income }
  });
});

const updateIncome = asyncHandler(async (req, res) => {
  const income = await Income.update(req.params.id, req.body);

  if (!income) {
    throw new HttpError("Income record not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Income record updated successfully",
    data: { income }
  });
});

const deleteIncome = asyncHandler(async (req, res) => {
  const deletedIncome = await Income.remove(req.params.id);

  if (!deletedIncome) {
    throw new HttpError("Income record not found", 404);
  }

  res.status(204).send();
});

module.exports = {
  createIncome,
  getIncomeRecords,
  getIncomeById,
  updateIncome,
  deleteIncome
};
