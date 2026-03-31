

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const bearerToken = req.header("Authorization")?.startsWith("Bearer ")
    ? req.header("Authorization").split(" ")[1]?.trim()
    : null;

  const token = req.cookies?.accessToken || bearerToken;

  if (!token) {
    return next(new ApiError(401, "Unauthorized: No token provided, please login"));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken?.id) {
      return next(new ApiError(401, "Invalid token payload, please login"));
    }

    const user = await User.findById(decodedToken.id).select("-password -refreshToken");

    if (!user) {
      return next(new ApiError(401, "User not found, please login again"));
    }

    if (user.isBanned) {
      return next(new ApiError(403, "Your account has been banned"));
    }

    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token expired"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid access token"));
    }

    return next(new ApiError(401, error.message || "Token verification failed"));
  }
});

export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized: Please login"));
  }

  if (req.user.role !== "ADMIN") {
    return next(new ApiError(403, "Access denied. Admins only"));
  }

  return next();
};