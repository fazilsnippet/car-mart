import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
dotenv.config("../../.env");
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { OTP } from "../models/Otp.model.js"; 
// import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/User.model.js";
import { createOtp } from "../utils/generateOtp.js";
import { verifyOtp } from "../utils/generateOtp.js";



export const generateAccessTokenAndRefreshToken = async (userId) => {
  if (!userId) {
    throw new ApiError(400, "User ID required");
  }

  const accessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  await User.findByIdAndUpdate(userId, {
    refreshToken
  });

  return { accessToken, refreshToken };
};


const sendSignupOtp = asyncHandler(async (req, res) => {
  let { email } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  email = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const otpCode = await createOtp({
    email,
    purpose: "signup",
    expiryMinutes: 5,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Signup OTP:", otpCode);
  }

  await sendEmail(email, "Signup OTP", `Your OTP is ${otpCode}`);

  return res.status(200).json(
    new ApiResponse(200, {}, "OTP sent to your email")
  );
});


const registerUser = asyncHandler(async (req, res) => {
  let { fullName, email, userName, password, phone, otp } = req.body;

  if ([fullName, email, userName, password, otp].some(field => !field?.trim())) {
    throw new ApiError(400, "All required fields must be provided");
  }

  fullName = fullName.trim();
  email = email.toLowerCase().trim();
  userName = userName.toLowerCase().trim();

  // 🔐 Verify OTP using service
  const isOtpValid = await verifyOtp({
    email,
    otp,
    purpose: "signup",
  });

  if (!isOtpValid) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Check duplicates
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  // Avatar upload (optional)
  let avatar = null;

  if (req.file) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryResult?.secure_url || !cloudinaryResult?.public_id) {
      throw new ApiError(500, "Avatar upload failed");
    }

    avatar = {
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
    };
  }

  // Create user (password auto-hashed in model)
  const user = await User.create({
    fullName,
    email,
    userName,
    password,
    phone,
    avatar,
  });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  // 🍪 Production-safe cookie config
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(
    new ApiResponse(201, {}, "User registered successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;

  if ((!email && !userName) || !password) {
    throw new ApiError(400, "Please provide both email/username and password");
  }

  const user = await User.findOne({ $or: [{ userName }, { email }] });
  if (!user) throw new ApiError(404, "Username or email does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(409, "Invalid user password");

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
  secure: true,
  sameSite: "Strict"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: "User logged in successfully",
    });
});


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  const options = {
    httpOnly: true,
  secure: true,
  sameSite: "Strict"

  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "user logged out successfully" });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request please login");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?.id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token please login");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const options = {
    httpOnly: true,
  secure: true,
  sameSite: "Strict"
  };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "accessToken refreshed..!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token please login");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await user.isPasswordCorrect(oldPassword);
  if (!isMatch) throw new ApiError(400, "Old password is incorrect");

  user.password = newPassword;
  await user.save();

  // Optional: clear refresh token
  user.refreshToken = null;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});




export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    // Optional: return success anyway to prevent email enumeration
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "If email exists, OTP sent"));
  }

  const otpCode = await createOtp({
    email,
    purpose: "forgotPassword",
  });


  await sendEmail(email, "RESET PASSWORD ", `Your OTP is ${otpCode}`);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Reset OTP sent to email"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized. Please login.");
  }

  const { fullName } = req.body;

  if (!fullName || !fullName.trim()) {
    throw new ApiError(400, "Full name is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ✅ Update full name
  user.fullName = fullName.trim();

  // ✅ If new avatar uploaded
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);

    if (!uploadResult?.secure_url || !uploadResult?.public_id) {
      throw new ApiError(500, "Failed to upload avatar");
    }

    // 🔥 Delete old avatar if exists
    if (user.avatar?.public_id) {
      await deleteFromCloudinary(user.avatar.public_id);
    }

    // ✅ Save new avatar
    user.avatar = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  }

  await user.save();

  const updatedUser = await User.findById(userId).select("-password");

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "Profile updated successfully")
  );
});





 const updateUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized  please login");
  }

  let { address } = req.body;

  if (!address) {
    throw new ApiError(400, "all the address fields are required !!!");
  }

  // If address is stringified JSON (common in multipart/form-data), parse it
  if (typeof address === "string") {
    try {
      address = JSON.parse(address);
    } catch {
      throw new ApiError(400, "Invalid address format");
    }
  }

  const updateFields = {
    ...(address.street && { "address.street": address.street }),
    ...(address.city && { "address.city": address.city }),
    ...(address.state && { "address.state": address.state }),
    ...(address.postalCode && { "address.postalCode": address.postalCode }),
    ...(address.country && { "address.country": address.country }),
    ...(address.phone && { "address.phone": address.phone }),
  };

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedUser.address, "Address updated successfully")
  );
});



const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userProfile = {
    fullName: user?.fullName,
    email: user?.email,
    userName: user?.userName,
    profilePicture: user?.avatar,
    address: user?.address,
    bookings: user?.bookingHistory || []
    
  };

  

  return res
    .status(200)
    .json(new ApiResponse(200, userProfile, "User profile fetched successfully"));
});


const MAX_RECENT = 10;
const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

 const addRecentlyViewedCar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { carId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove expired
    user.recentlyViewed = user.recentlyViewed.filter(
      (item) => Date.now() - new Date(item.viewedAt).getTime() < TEN_DAYS_MS
    );

    // Remove if exists already
    user.recentlyViewed = user.recentlyViewed.filter(
      (item) => item.carId.toString() !== carId
    );

    // Add to start
    user.recentlyViewed.unshift({ carId, viewedAt: new Date() });

    // Limit to 10
    if (user.recentlyViewed.length > MAX_RECENT) {
      user.recentlyViewed = user.recentlyViewed.slice(0, MAX_RECENT);
    }

    await user.save();

    res.status(200).json({ message: "Added to recently viewed" });
  } catch (err) {
    console.error("Recently viewed error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



 const getRecentlyViewedCars = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.recentlyViewed) {
      return res.status(404).json({ message: "User or data not found" });
    }

    const recentCars = await Promise.all(
      user.recentlyViewed
        .filter(
          (item) =>
            Date.now() - new Date(item.viewedAt).getTime() < 10 * 24 * 60 * 60 * 1000
        )
        .map(async (item) => {
          const car = await car.findById(item.carId);
          return car ? car.toObject() : null;
        })
    );

    const filtered = recentCars.filter(Boolean); // remove nulls
    res.json(filtered);
  } catch (err) {
    console.error("Get recently viewed error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export {
  sendSignupOtp,
  registerUser,
  loginUser,
  userProfile,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  addRecentlyViewedCar,
  getRecentlyViewedCars,
};