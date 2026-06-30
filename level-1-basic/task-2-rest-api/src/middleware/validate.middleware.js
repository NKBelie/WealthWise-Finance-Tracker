const validate = (schema, property = "body") => (req, res, next) => {
  const { value, error } = schema.validate(req[property], {
    abortEarly: false,
    convert: true,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/"/g, "")
      }))
    });
  }

  req[property] = value;
  return next();
};

module.exports = validate;
