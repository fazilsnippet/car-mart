export const verifyJWT = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) return next(new ApiError(401, "Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }
});
