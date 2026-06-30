const express = require("express");

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/user.controller");
const validate = require("../middleware/validate.middleware");
const { idParamSchema } = require("../validators/common.validator");
const {
  createUserSchema,
  updateUserSchema
} = require("../validators/user.validator");

const router = express.Router();

router
  .route("/")
  .post(validate(createUserSchema), createUser)
  .get(getUsers);

router
  .route("/:id")
  .get(validate(idParamSchema, "params"), getUserById)
  .put(validate(idParamSchema, "params"), validate(updateUserSchema), updateUser)
  .delete(validate(idParamSchema, "params"), deleteUser);

module.exports = router;
