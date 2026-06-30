const Expense = require("../models/expense.model");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Expense record created successfully",
    data: { expense }
  });
});

const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.findAll(req.query);

  res.status(200).json({
    status: "success",
    results: expenses.length,
    data: { expenses }
  });
});

const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    throw new HttpError("Expense record not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: { expense }
  });
});

const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.update(req.params.id, req.body);

  if (!expense) {
    throw new HttpError("Expense record not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Expense record updated successfully",
    data: { expense }
  });
});

const deleteExpense = asyncHandler(async (req, res) => {
  const deletedExpense = await Expense.remove(req.params.id);

  if (!deletedExpense) {
    throw new HttpError("Expense record not found", 404);
  }

  res.status(204).send();
});

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};
