import CarSell from "../models/CarSell.model.js";
import {
  uploadOnCloudinary,
  cleanupUploadsFolder,
} from "../utils/cloudinary.js";
import { notificationQueue } from "../services/notification.queue.js";


// 🔥 Central validation (single source of truth)
const validateCarInput = (data) => {
  const errors = [];
if (!data.phoneNumber)
  errors.push("Phone number is required");

if (!data.location)
  errors.push("Location is required");

  if (!data.title || data.title.trim().length < 3)
    errors.push("Title must be at least 3 characters");

  if (!data.brand || data.brand.trim().length < 2)
    errors.push("Brand is required");

  if (!data.year || isNaN(data.year))
    errors.push("Valid year is required");

  if (!data.fuelType)
    errors.push("Fuel type is required");

  if (!data.transmission)
    errors.push("Transmission is required");

  if (!data.kmDriven || isNaN(data.kmDriven))
    errors.push("KM driven is required");

  if (!data.owners || isNaN(data.owners))
    errors.push("Owners count is required");

  if (!data.registrationNumber)
    errors.push("Registration number is required");

  if (!data.expectedPrice || isNaN(data.expectedPrice))
    errors.push("Expected price is required");

  return errors;
};

// ✅ CREATE CAR
export const createCarSell = async (req, res, next) => {
  try {
    // 🔥 Validate input
    const errors = validateCarInput(req.body);
    if (errors.length) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    // 🔥 Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // 🔥 Upload images
    const uploadResults = await Promise.allSettled(
      req.files.map((file) => uploadOnCloudinary(file.path))
    );

    const uploadedImages = uploadResults
      .filter((r) => r.status === "fulfilled" && r.value)
      .map((r) => ({
        url: r.value.secure_url || r.value.url,
        publicId: r.value.public_id,
      }));

    if (uploadedImages.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    // 🔥 Whitelist fields (NO spreading)
    const {
      title,
      brand,
      year,
      fuelType,
      transmission,
      kmDriven,
      owners,
      registrationNumber,
      expectedPrice,
      features,
      conditionNotes,
       phoneNumber,
  location,
    } = req.body;

    const car = await CarSell.create({
      title,
      brand,
      year,
      fuelType,
      transmission,
      kmDriven,
      owners,
      registrationNumber: registrationNumber.toUpperCase(),
      expectedPrice,
      features,
      conditionNotes,
      images: uploadedImages,
       user: req.user._id,        // 🔥 REQUIRED
  phoneNumber,               // 🔥 REQUIRED
  location,            
    });
 notificationQueue.add("new-car-sell", {
  carId: car._id,
  title: car.title,
  year: car.year,
  phoneNumber: car.phoneNumber,
  location: car.location,
});

  notificationQueue.add("email-admin", {
  to: process.env.EMAIL_USER ,
  subject: "New Car Submission",
  html: `
    <h3>New Car Submitted</h3>
    <p><b>${car.title}</b> (${car.year})</p>
    <p>Price: ₹${car.expectedPrice}</p>
    <p>Phone: ${car.phoneNumber}</p>
    <p>Location: ${car.location}</p>
  `,
});
    return res.status(201).json({
      success: true,
      data: car,
    });

  } catch (error) {
    // 🔥 Duplicate handling
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Car with this registration number already exists",
      });
    }

    next(error);
  } finally {
    cleanupUploadsFolder();
  }
};

// ✅ Get All Cars
export const getCarsSell = async (req, res, next) => {
  try {
    // 🔥 Parse numbers safely
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10); // cap limit

    const {
      brand,
      fuelType,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    // 🔥 Filtering
    if (brand) query.brand = brand;
    if (fuelType) query.fuelType = fuelType;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 🔥 Safe sorting (whitelist)
    const allowedSortFields = ["price", "year", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    // 🔥 Pagination
    const skip = (page - 1) * limit;

    const [cars, total] = await Promise.all([
      CarSell.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),

      CarSell.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: cars,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Get Car By ID
export const getCarSellById = async (req, res) => {
  try {
    const car = await CarSell.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Car
export const updateCarSell = async (req, res, next) => {
  try {
    const car = await CarSell.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // 🔥 Validate ONLY provided fields (partial update)
    const validationErrors = validateCarData({
      ...car.toObject(),
      ...req.body,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    let updatedImages = car.images;

    // 🔥 If new images are uploaded → replace old ones
    if (req.files?.length > 0) {
      // delete old images from Cloudinary
      if (car.images?.length > 0) {
        await Promise.all(
          car.images.map((img) =>
            deleteFromCloudinary(img.publicId)
          )
        );
      }

      // upload new images
      const results = await Promise.allSettled(
        req.files.map((file) => uploadOnCloudinary(file.path))
      );

      updatedImages = results
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => ({
          url: r.value.url || r.value.secure_url,
          publicId: r.value.public_id,
        }));
    }

    // 🔥 Merge updates safely
    const updatedData = {
      ...req.body,
      images: updatedImages,
    };

    const updatedCar = await CarSell.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedCar,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate registration number",
      });
    }
    next(err);
  } finally {
    cleanupUploadsFolder();
  }
};

// ✅ Delete Car
export const deleteCarSell = async (req, res) => {
  try {
    const car = await CarSell.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyCars = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const cars = await CarSell.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean(); // 🔥 important

    res.json({
      success: true,
      cars, // 🔥 direct, no "data"
    });
  } catch (err) {
    next(err);
  }
};