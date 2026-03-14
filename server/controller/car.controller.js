import mongoose from "mongoose";
import { Car } from "../models/Car.model.js";
import { querySchema , updateSchema, createSchema} from "../utils/validators/car.validators.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import slugify from "slugify";
import Joi from "joi";


const buildMatch = (filters, excludeField = null) => {
  const {
    title,
    brand,
    fuelType,
    transmission,
    variant,
    ownerCount,
    minYear,
    maxYear,
    minKm,
    maxKm,
    priceBucket
  } = filters;

  const match = { lifecycleStatus: "ACTIVE" };

  if (title && excludeField !== "title") {
    match.title = { $regex: title, $options: "i" };
  }

  if (brand && excludeField !== "brand") {
    const brands = Array.isArray(brand) ? brand : [brand];
    match.brand = {
      $in: brands
        .filter(id => mongoose.Types.ObjectId.isValid(id))
        .map(id => new mongoose.Types.ObjectId(id))
    };
  }

  if (fuelType && excludeField !== "fuelType") {
    const fuels = Array.isArray(fuelType) ? fuelType : [fuelType];
    match.fuelType = { $in: fuels };
  }

  if (transmission && excludeField !== "transmission") {
    const transmissions = Array.isArray(transmission)
      ? transmission
      : [transmission];
    match.transmission = { $in: transmissions };
  }

  if (variant && excludeField !== "variant") {
    match.variant = variant;
  }

  if (ownerCount && excludeField !== "ownerCount") {
    match.ownerCount = ownerCount;
  }

  if ((minYear || maxYear) && excludeField !== "year") {
    match.year = {};
    if (minYear) match.year.$gte = minYear;
    if (maxYear) match.year.$lte = maxYear;
  }

  if ((minKm || maxKm) && excludeField !== "kmDriven") {
    match.kmDriven = {};
    if (minKm) match.kmDriven.$gte = minKm;
    if (maxKm) match.kmDriven.$lte = maxKm;
  }

  if (priceBucket && excludeField !== "price") {
    const buckets = {
      "0-5":  { $gte: 0, $lte: 500000 },
      "5-10": { $gte: 500000, $lte: 1000000 },
      "10-15":{ $gte: 1000000, $lte: 1500000 },
      "15-20":{ $gte: 1500000, $lte: 2000000 },
      "20+":  { $gte: 2000000 }
    };

    if (buckets[priceBucket]) {
      match.price = buckets[priceBucket];
    }
  }

  return match;
};

export const getCars = async (req, res, next) => {
  try {
    const { value, error } = querySchema.validate(req.query, {
      convert: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { sortBy, order, page, limit } = value;

    const sortStage = {
      [sortBy]: order === "asc" ? 1 : -1
    };

    const baseMatch = buildMatch(value);

    const result = await Car.aggregate([
      {
        $facet: {
          // FILTERED DATA
          filtered: [
            { $match: baseMatch },
            { $sort: sortStage },
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ],

          totalCount: [
            { $match: baseMatch },
            { $count: "count" }
          ],

          // DISJUNCTIVE FACETS
          priceBuckets: [
            { $match: buildMatch(value, "price") },
            {
              $bucket: {
                groupBy: "$price",
                boundaries: [
                  0,
                  500000,
                  1000000,
                  1500000,
                  2000000,
                  10000000
                ],
                default: "Other",
                output: { count: { $sum: 1 } }
              }
            }
          ],

          fuelTypes: [
            { $match: buildMatch(value, "fuelType") },
            { $group: { _id: "$fuelType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],

          transmissions: [
            { $match: buildMatch(value, "transmission") },
            { $group: { _id: "$transmission", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],

          brands: [
            { $match: buildMatch(value, "brand") },
            { $group: { _id: "$brand", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],

          // ALWAYS NEWEST (independent)
          newest: [
            { $match: { lifecycleStatus: "ACTIVE" } },
            { $sort: { createdAt: -1 } },
            { $limit: 8 }
          ]
        }
      }
    ]);

    const output = result[0];
    const total = output.totalCount[0]?.count || 0;

    // Similar items logic
    let similarItems = [];
    if (total > 0 && total < 3) {
      similarItems = await Car.find({
        lifecycleStatus: "ACTIVE",
        brand: baseMatch.brand
      })
        .sort({ createdAt: -1 })
        .limit(6);
    }

    return res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),

      filters: {
        priceBuckets: output.priceBuckets,
        fuelTypes: output.fuelTypes,
        transmissions: output.transmissions,
        brands: output.brands
      },

      data: output.filtered,
      similarItems,
      newest: output.newest
    });

  } catch (error) {
    next(error);
  }
};


const slugSchema = Joi.object({
  slug: Joi.string().trim().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12)
});

export const getCarBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const car = await Car.findOne({
      lifecycleStatus: "ACTIVE",
      slug: slug.toLowerCase()
    })
      .populate("brand", "name")
      .lean();

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    res.status(200).json({
      success: true,
      data: car
    });

  } catch (error) {
    next(error);
  }
};


export const createCar = async (req, res, next) => {
  try {

    // 🔥 Parse location if exists
    if (req.body.location) {
      req.body.location = JSON.parse(req.body.location);
    }

    // 🔥 Fix features (important!)
   // 🔥 Fix features (important!)
if (req.body.features) {

  if (!Array.isArray(req.body.features)) {
    req.body.features = [req.body.features];
  }

  // flatten comma separated values
  req.body.features = req.body.features
    .flatMap(f => typeof f === "string" ? f.split(",") : f)
    .map(f => f.trim());

  // remove duplicates
  req.body.features = [...new Set(req.body.features)];
}
    const { value, error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // 🚫 Prevent duplicates: check if a car with the same key fields already exists
    const duplicateQuery = {
      title: value.title,
      brand: value.brand,
      year: value.year,
      variant: value.variant
    };

    const existingCar = await Car.findOne(duplicateQuery).lean();
    if (existingCar) {
      return res.status(409).json({
        success: false,
        message: "A car with the same title, brand, year and variant already exists"
      });
    }

    // 2️⃣ Generate slug
    const slug = slugify(
      `${value.title}-${value.year}-${Date.now()}`,
      { lower: true, strict: true }
    );

    // 3️⃣ Handle multiple image uploads
    let uploadedImages = [];

    if (req.files && req.files.length > 0) {

      const uploadPromises = req.files.map(file =>
        uploadOnCloudinary(file.path)
      );

      const results = await Promise.all(uploadPromises);

      // Filter failed uploads
      uploadedImages = results
        .filter(result => result !== null)
        .map(result => ({
          url: result.url || result.secure_url,
          publicId: result.public_id
        }));
    }

    // 4️⃣ Create car in DB
    const car = await Car.create({
      ...value,
      slug,
      images: uploadedImages
    });

    res.status(201).json({
      success: true,
      message: "Car created successfully",
      data: car
    });

  } catch (error) {
    // handle unique constraint errors (race conditions)
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate car entry detected."
      });
    }

    next(error);
  }
};



export const updateCar = async (req, res, next) => {
  try {
    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      });
    }

    // 2️⃣ Validate request body
    const { value, error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // 3️⃣ Find car
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    // 4️⃣ Regenerate slug if title/year changed
    if (value.title || value.year) {
      const newTitle = value.title || car.title;
      const newYear = value.year || car.year;

      value.slug = slugify(
        `${newTitle}-${newYear}-${Date.now()}`,
        { lower: true, strict: true }
      );
    }

    // 5️⃣ Handle new images safely
    if (req.files && req.files.length > 0) {

      // 🔹 Step A: Upload new images first
      const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
      const uploadedResults = await Promise.allSettled(uploadPromises);

      // Filter successful uploads
      const successfulUploads = uploadedResults
        .filter(r => r.status === "fulfilled" && r.value !== null)
        .map(r => ({
          url: r.value.url || r.value.secure_url,
          publicId: r.value.public_id
        }));

      if (successfulUploads.length === 0) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload any images"
        });
      }

      // 🔹 Step B: Delete old images only after new ones succeed
      if (car.images && car.images.length > 0) {
        const deletePromises = car.images.map(img => deleteFromCloudinary(img.publicId));
        await Promise.allSettled(deletePromises);
      }

      // 🔹 Step C: Replace images in car
      car.images = successfulUploads;
    }

    // 6️⃣ Update other fields
    Object.assign(car, value);

    await car.save();

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      data: car
    });

  } catch (error) {
    next(error);
  }
};



export const deleteCar = async (req, res, next) => {
  try {
    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID"
      });
    }

    // 2️⃣ Find car
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    // 3️⃣ Delete images safely
    if (car.images && car.images.length > 0) {
      const deleteResults = await Promise.allSettled(
        car.images.map(img => deleteFromCloudinary(img.publicId))
      );

      // Optional: log failed deletions
      const failedDeletes = deleteResults.filter(r => r.status === "rejected");
      if (failedDeletes.length > 0) {
        console.warn(`Failed to delete ${failedDeletes.length} images from Cloudinary`);
      }
    }

    // 4️⃣ Soft delete car
    car.images = [];
    car.lifecycleStatus = "INACTIVE";
    car.deletedAt = new Date(); // optional timestamp for auditing

    await car.save();

    res.status(200).json({
      success: true,
      message: "Car deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


export const getCarById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const car = await Car.findById(req.params.id)
      .populate("brand", "name")
      .lean();

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    res.status(200).json({
      success: true,
      data: car
    });

  } catch (error) {
    next(error);
  }
};
