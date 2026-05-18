// export const parseRequestData = (req, res, next) => {
//   try {
//     if (req.body.data) {
//       req.body = JSON.parse(req.body.data);
//     }
//     next();
//   } catch {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid JSON payload"
//     });
//   }
// };

export const parseRequestData = (req, res, next) => {
  try {
    if (req.body.location && typeof req.body.location === "string") {
      req.body.location = JSON.parse(req.body.location);
    }

    if (req.body.features) {
      if (typeof req.body.features === "string") {
        req.body.features = JSON.parse(req.body.features);
      }

      // handle features[]
      if (!Array.isArray(req.body.features)) {
        req.body.features = [req.body.features];
      }
    }

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid multipart JSON fields",
    });
  }
};