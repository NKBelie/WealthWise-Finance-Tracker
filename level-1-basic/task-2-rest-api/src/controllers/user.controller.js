const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const createUser = asyncHandler(async (req, res) => {
  const { full_name, email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 12);

  const user = await User.create({ full_name, email, password_hash });

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: { user }
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users }
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new HttpError("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: { user }
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  if (updateData.password) {
    updateData.password_hash = await bcrypt.hash(updateData.password, 12);
    delete updateData.password;
  }

  const user = await User.update(req.params.id, updateData);

  if (!user) {
    throw new HttpError("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: { user }
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.remove(req.params.id);

  if (!deletedUser) {
    throw new HttpError("User not found", 404);
  }

  res.status(204).send();
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
