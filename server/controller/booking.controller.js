import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { Car } from "../models/Car.model.js";
import {Booking} from "../models/Booking.model.js"


export const createBooking = asyncHandler(async (req, res) => {
  const { carId, bookingType, preferredDate, preferredTime, message } = req.body;

  // 1️⃣ Validate carId
  if (!mongoose.Types.ObjectId.isValid(carId)) {
    throw new ApiError(400, "Invalid car ID");
  }

  const car = await Car.findById(carId);
  if (!car) {
    throw new ApiError(404, "Car not found");
  }

  // 2️⃣ Prevent duplicate ACTIVE booking for same user + same car
  const existingBooking = await Booking.findOne({
    carId,
    userId: req.user._id,
    status: { $in: ["NEW", "CONTACTED"] }
  });

  if (existingBooking) {
    throw new ApiError(
      400,
      "You already have an active booking for this car"
    );
  }

  // 3️⃣ Validate preferred date (if provided)
  if (preferredDate) {
    const selectedDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      throw new ApiError(400, "Preferred date cannot be in the past");
    }
  }

  // 4️⃣ Create booking
  const booking = await Booking.create({
    carId,
    userId: req.user._id,
    bookingType,
    preferredDate,
    preferredTime,
    message
  });

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking created successfully"));
});


export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid booking ID");
  }

  const booking = await Booking.findById(id)
    .populate("carId", "title price images")
    .populate("userId", "fullName email phone")
    .populate("handledBy", "fullName email");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (
    booking.userId._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking fetched"));
});


export const getMyBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const bookings = await Booking.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $skip: skip
    },
    {
      $limit: limitNum
    },
    {
      $lookup: {
        from: "cars",
        localField: "carId",
        foreignField: "_id",
        as: "car"
      }
    },
    {
      $unwind: "$car"
    },
    {
      $project: {
        bookingType: 1,
        status: 1,
        createdAt: 1,
        "car._id": 1,
        "car.title": 1,
        "car.price": 1,
"car.image": {
  $ifNull: [{ $arrayElemAt: ["$car.images", 0] }, null]
}      }
    }
  ]);

  const total = await Booking.countDocuments({ userId });

  return res.status(200).json(
    new ApiResponse(200, {
      bookings,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),

    })
  );
});


export const getAllBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    bookingType,
    search
  } = req.query;

  const skip = (page - 1) * limit;

  let query = {};

  if (status) query.status = status;
  if (bookingType) query.bookingType = bookingType;

  if (search) {
    query.$or = [
      { message: { $regex: search, $options: "i" } }
    ];
  }

  const bookings = await Booking.find(query)
    .populate("carId", "title price")
    .populate("userId", "fullName email phone")
    .populate("handledBy", "fullName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Booking.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      bookings,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    })
  );
});


export const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid booking ID");
  }

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (!req.user || !req.user._id) {
  throw new ApiError(401, "Unauthorized - user missing");
}
  // Ensure user owns booking
  if (booking.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  // Only allow type update
  if (type) {
    const allowedTypes = ["TEST_DRIVE", "CALLBACK", "VISIT"];
    if (!allowedTypes.includes(type)) {
      throw new ApiError(400, "Invalid booking type");
    }
    booking.bookingType = type;
  }

  await booking.save();

  return res.status(200).json(
    new ApiResponse(200, booking, "Booking updated successfully")
  );
});


export const assignBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  booking.handledBy = adminId;
  booking.status = "CONTACTED";

  await booking.save();

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking assigned"));
});


export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  if (booking.status === "COMPLETED") {
    throw new ApiError(400, "Cannot cancel completed booking");
  }

  booking.status = "CANCELLED";
  await booking.save();

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking cancelled"));
});
