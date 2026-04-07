import slugify from "slugify";
import { Brand } from "../models/Brand.model.js";
import { createBrandSchema, updateBrandSchema } from "../utils/validators/brand.validator.js";

export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({}).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req, res, next) => {
  try {
    // 1️⃣ Validate body
    const { value, error } = createBrandSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // 2️⃣ Check duplicate name (case-insensitive)
    const existingBrand = await Brand.findOne({
      name: { $regex: `^${value.name}$`, $options: "i" }
    });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists"
      });
    }

    // 3️⃣ Generate slug
    const slug = slugify(value.name, {
      lower: true,
      strict: true
    });

    // 4️⃣ Handle logo upload
    // let uploadedLogo = {};

    // if (req.file) {
    //   const result = await uploadOnCloudinary(req.file.path);

    //   if (result) {
    //     uploadedLogo = {
    //       url: result.secure_url,
    //       publicId: result.public_id
    //     };
    //   }
    // }

    const brand = await Brand.create({
      name: value.name,
      slug,
    });

    // // 5️⃣ Create brand
    // const brand = await Brand.create({
    //   name: value.name,
    //   slug,
    //   logo: uploadedLogo
    // });

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand
    });

  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value, error } = updateBrandSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (value.name) {
      const existingBrand = await Brand.findOne({
        _id: { $ne: id },
        name: { $regex: `^${value.name}$`, $options: "i" }
      });

      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: "Brand already exists"
        });
      }

      value.slug = slugify(value.name, {
        lower: true,
        strict: true
      });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(id, value, {
      new: true
    });

    if (!updatedBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: updatedBrand
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
      data: deletedBrand
    });
  } catch (error) {
    next(error);
  }
};

