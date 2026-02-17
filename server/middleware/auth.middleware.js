import { User } from "../models/User.model";

export const authorize = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user || !roles.includes(user.role)) {
      return next(new ApiError(403, "Forbidden"));
    }

    next();
  };
};
