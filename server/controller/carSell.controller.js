import CarSell from "../models/CarSell.model.js";
import { carValidation } from "../utils/validators/car.validators.js";
import { uploadOnCloudinary, cleanupUploadsFolder, deleteFromCloudinary } from "../utils/cloudinary.js";
// ✅ Create Car
// 🔥 Custom validator function
const validateCarData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push("Title must be at least 3 characters long");
  }

  if (!data.brand || data.brand.trim().length < 2) {
    errors.push("Brand is required");
  }

  if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
    errors.push("Price must be a valid positive number");
  }

  if (!data.year || isNaN(data.year)) {
    errors.push("Year must be a valid number");
  }

  if (!data.fuelType) {
    errors.push("Fuel type is required");
  }

  if (!data.transmission) {
    errors.push("Transmission is required");
  }

  return errors;
};

// ✅ Create Car
export const createCarSell = async (req, res, next) => {
  try {
    // 🔥 Run custom validation
    const validationErrors = validateCarData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
      });
    }

    let uploadedImages = [];

    // 🔥 Upload images first
    if (req.files?.length > 0) {
      const results = await Promise.allSettled(
        req.files.map((file) => uploadOnCloudinary(file.path))
      );

      uploadedImages = results
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => ({
          url: r.value.url || r.value.secure_url,
          publicId: r.value.public_id,
        }));
    }

    // 🔥 Create car AFTER validation + images
    const car = new CarSell({
      ...req.body,
      images: uploadedImages,
    });

    await car.save();

    res.status(201).json({
      success: true,
      data: car,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate car entry detected.",
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
    const userId = req.user._id; // 🔥 from auth middleware

    const {
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [cars, total] = await Promise.all([
      CarSell.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      CarSell.countDocuments({ user: userId }),
    ]);

    res.json({
      success: true,
      data: cars,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};