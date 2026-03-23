import { v2 as cloudinary } from "cloudinary";
import { promises as fsPromises } from "fs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config()
// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Missing Cloudinary configuration. Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in environment variables."
    );
  }
};

validateCloudinaryConfig();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteLocalFile = async (filePath) => {
  if (!filePath) return;
  try {
    await fsPromises.unlink(filePath);
    console.log(`Deleted local file: ${filePath}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Local file not found for deletion: ${filePath}`);
    } else {
      console.error(`Failed to delete local file (${filePath}):`, err.message);
    }
  }
};

export const uploadOnCloudinary = async (filePath, folder = "cars") => {
  if (!filePath) {
    throw new Error("File path is required for upload.");
  }

  let result;
  try {
    result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    throw new Error("Failed to upload image to Cloudinary");
  } finally {
    await deleteLocalFile(filePath);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

export const cleanupUploadsFolder = () => {
  const uploadDir = path.resolve("public");
  try {
    const files = fs.readdirSync(uploadDir);
    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
        console.log(`Deleted local file: ${filePath}`);
      }
    });
  } catch (error) {
    console.error("Error cleaning up uploads folder:", error.message);
  }
};
