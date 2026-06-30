const HttpError = require("../utils/httpError");

const notFoundHandler = (req, res, next) => {
  next(new HttpError(`Route ${req.originalUrl} not found`, 404));
};

module.exports = notFoundHandler;
