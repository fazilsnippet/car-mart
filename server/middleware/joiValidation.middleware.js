export const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  req.validatedData = value;
  next();
};