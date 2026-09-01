// // Step 1: Import required dependencies
// import slugify from "slugify";
// import { Car } from "../../../models/Car.model.js";
// import { uploadOnCloudinary , cleanupUploadsFolder} from "../../../utils/cloudinary.js";
// import { indexCar } from "../../indexing/car.index.service.js";

// export const createCar = async (req, res, next) => {
  //   try {
    //     // Step 2: Read validated request data
    //     const value = req.validatedData;
    
    //     // Step 3: Generate a unique slug
    //     const slug = slugify(
      //       `${value.title}-${value.year}-${Date.now()}`,
      //       {
        //         lower: true,
        //         strict: true,
        //       }
        //     );
        
        //     // Step 4: Upload images to Cloudinary
        //     let uploadedImages = [];
        
        //     if (req.files?.length) {
          //       const uploadResults = await Promise.allSettled(
//         req.files.map((file) => uploadOnCloudinary(file.path))
//       );

//       uploadedImages = uploadResults
//         .filter(
  //           (result) => result.status === "fulfilled" && result.value
  //         )
  //         .map((result) => ({
    //           url: result.value.url || result.value.secure_url,
    //           publicId: result.value.public_id,
//         }));
//     }

//     // Step 5: Save the car into MongoDB
//     const createdCar = await Car.create({
//       ...value,
//       slug,
//       images: uploadedImages,
//     });

//     // Step 6: Load the complete car with populated brand
//     const indexedCar = await Car.findById(createdCar._id)
//       .populate("brand", "name slug")
//       .lean();

//     // Step 7: Generate embedding and store the vector in Chroma Cloud
//     await indexCar(indexedCar);

//     // Step 8: Return the created car
//     return res.status(201).json({
  //       success: true,
  //       message: "Car created successfully.",
  //       data: createdCar,
  //     });
  //   } catch (error) {
    //     // Step 9: Handle duplicate key errors
    //     if (error?.code === 11000) {
      //       return res.status(409).json({
        //         success: false,
//         message: "Duplicate car entry detected.",
//       });
//     }

//     next(error);
//   } finally {
  //     // Step 10: Clean temporary uploaded files
  //     cleanupUploadsFolder();
  //   }
  // };
  
  import mongoose from "mongoose";
  import { semanticSearch } from "../../retrieval/semanticSearch.service.js";
  
  import slugify from "slugify";
import { Car } from "../../../models/Car.model.js";

import { uploadOnCloudinary , cleanupUploadsFolder} from "../../../utils/cloudinary.js";
import { indexCar } from "../../indexing/car.index.service.js";

export const createCar = async (req, res, next) => {
  try {
    // Step 2: Read validated request data
    const value = req.validatedData;

    // Step 3: Generate a unique slug
    const slug = slugify(`${value.title}-${value.year}-${Date.now()}`, {
      lower: true,
      strict: true,
    });

    // Step 4: Upload images to Cloudinary
    let uploadedImages = [];

    if (req.files?.length > 0) {
      const results = await Promise.allSettled(
        req.files.map((file) => uploadOnCloudinary(file.path))
      );

      uploadedImages = results
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result) => ({
          url: result.value.url || result.value.secure_url,
          publicId: result.value.public_id,
        }));
    }

    // Step 5: Save the car into MongoDB
    const createdCar = await Car.create({
      ...value,
      slug,
      images: uploadedImages,
    });

    // Step 6: Fetch the complete document with populated brand
    const indexedCar = await Car.findById(createdCar._id)
      .populate("brand", "name slug")
      .lean();

    // Step 7: Index the car into Chroma Cloud
    await indexCar(indexedCar);

    // Step 8: Send the response
    return res.status(201).json({
      success: true,
      message: "Car created successfully.",
      data: createdCar,
    });
  } catch (error) {
    // Step 9: Handle duplicate key errors
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate car entry detected.",
      });
    }

    next(error);
  } finally {
    // Step 10: Clean up temporary uploads
    cleanupUploadsFolder();
  }
};


// Step 1: Import dependencies

// Step 2: Semantic AI Search Controller
// export const aiSearchCars = async (req, res, next) => {
//   try {
//     // Step 3: Read request body
// const {
//   query,
//   limit = 10,
//   brand,
//   city,
//   state,
//   fuelType,
//   transmission,
//   driveType,
//   lifecycleStatus,
// } = req.query;

//     if (!query?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Search query is required.",
//       });
//     }


// const cars = await hybridSearch({
//   query,
//   limit: Number(limit),
//   filters,
// });

//     // Step 5: Extract MongoDB IDs
//     const ids = result.ids?.[0] ?? [];

//     // Step 6: Return empty response if nothing found
//     if (!ids.length) {
//       return res.status(200).json({
//         success: true,
//         total: 0,
//         data: [],
//       });
//     }

//     // Step 7: Convert IDs to ObjectIds
//     const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

//     // Step 8: Fetch complete cars
//     const cars = await Car.find({
//       _id: { $in: objectIds },
//     }).populate("brand");

//     // Step 9: Preserve Chroma ranking
//     const carMap = new Map(
//       cars.map((car) => [car._id.toString(), car])
//     );

//     const orderedCars = ids
//       .map((id) => carMap.get(id))
//       .filter(Boolean);

//     // Step 10: Return response
//     return res.status(200).json({
//       success: true,
//       query,
//       total: orderedCars.length,
//       data: orderedCars,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// Step 1: Import dependencies
import { hybridSearch } from "../../retrieval/hybridSearch.service.js"
// Step 2: AI Hybrid Search Controller
export const aiSearchCars = async (req, res, next) => {
  try {
    // Step 3: Read query parameters
    const {
      query,
      limit = 10,
      brand,
      city,
      state,
      fuelType,
      transmission,
      driveType,
      lifecycleStatus,
    } = req.query;

    // Step 4: Validate query
    if (!query?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required ai car controller.",
      });
    }

    // Step 5: Build metadata filters
    const filters = {
      brand,
      city,
      state,
      fuelType,
      transmission,
      driveType,
      lifecycleStatus,
    };

    // Step 6: Perform Hybrid Search
    const cars = await hybridSearch({
      query,
      limit: Number(limit),
      filters,
    });

    // Step 7: Return response
    return res.status(200).json({
      success: true,
      query,
      total: cars.length,
      data: cars,
    });

  } catch (error) {
    next(error);
  }
};
