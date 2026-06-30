const { env } = require("../config/env");

const postgresErrorMap = {
  "23505": {
    statusCode: 409,
    message: "A record with that unique value already exists"
  },
  "23503": {
    statusCode: 400,
    message: "Referenced user does not exist"
  },
  "23514": {
    statusCode: 400,
    message: "Database constraint failed"
  }
};

const errorHandler = (error, req, res, next) => {
  const mappedPostgresError = postgresErrorMap[error.code];
  const statusCode =
    mappedPostgresError?.statusCode || error.statusCode || 500;

  const message =
    mappedPostgresError?.message ||
    (env.NODE_ENV === "production" && !error.isOperational
      ? "Internal server error"
      : error.message);

  if (env.NODE_ENV !== "test") {
    console.error(error);
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
    ...(env.NODE_ENV !== "production" && { stack: error.stack })
  });
};

module.exports = errorHandler;
