import express from "express";
import {
registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,
updateAccountDetails,userProfile,sendSignupOtp,addRecentlyViewedCar,
  getRecentlyViewedCars,forgotPassword, getCurrentUser, getAllUsers, toggleUserBanStatus
} from "../controller/user.controller.js";
import { verifyJWT, verifyAdmin } from "../middleware/jwt.middleware.js";  // Assuming you have an auth middleware to verify JWT token
import { upload } from "../middleware/multer.js";

const userRouter = express.Router();

// Public Routes
userRouter.post("/register", upload.single("avatar") , registerUser);  // Register user
userRouter.post("/login", loginUser);  // Login user
userRouter.post("/register/sendotp", sendSignupOtp);

// Protected Routes (Require JWT)
userRouter.post("/logout", verifyJWT, logoutUser);  // Logout user
userRouter.post("/refreshtoken", refreshAccessToken);  // Refresh access token

userRouter.patch("/changepassword", verifyJWT, changeCurrentPassword);  // Change password
userRouter.patch("/updateaccount", verifyJWT, upload.single("avatar"), updateAccountDetails);  // Update user account details
userRouter.get("/me", verifyJWT, userProfile);  // Get user profile
userRouter.get("/all", verifyJWT, verifyAdmin, getAllUsers);
userRouter.patch("/ban/:userId", verifyJWT, verifyAdmin, toggleUserBanStatus);
// userRouter.put("/updateaddress", verifyJWT, updateUserAddress);  // Update user address
userRouter.post("/recentlyviewed/:carId", verifyJWT, addRecentlyViewedCar); 
userRouter.get("/recentlyviewedcars", verifyJWT, getRecentlyViewedCars);  // Get recently viewed products

userRouter.post("/forgotPassword", forgotPassword);  // Reset password
userRouter.get("/mount", verifyJWT, getCurrentUser);
export default userRouter;