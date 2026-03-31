export const parseRequestData = (req, res, next) => {
  try {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload"
    });
  }
};