// import mongoose from "mongoose";
// import { Wishlist } from "../models/wishlist.model";
// import { Car } from "../models/Car.model";
// import { isValidObjectId } from "../utils/validators/validate";

// export const addToWishlist = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { carId } = req.body;
//     const userId = req.user._id;

//     // ✅ 1. Validate IDs format
//     if (!isValidObjectId(carId) || !isValidObjectId(userId)) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: "Invalid userId or carId"
//       });
//     }

//     // ✅ 2. Check if car exists
//     const carExists = await Car.exists({ _id: carId }).session(session);
//     if (!carExists) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: "Car not found"
//       });
//     }

//     // ✅ 3. Prevent duplicate
//     const existing = await Wishlist.findOne({ user: userId, car: carId }).session(session);
//     if (existing) {
//       await session.abortTransaction();
//       return res.status(200).json({
//         success: true,
//         message: "Already in wishlist"
//       });
//     }

//     // ✅ 4. Create wishlist + increment count
//     await Wishlist.create([{ user: userId, car: carId }], { session });

//     await Car.findByIdAndUpdate(
//       carId,
//       { $inc: { wishlistCount: 1 } },
//       { session }
//     );

//     await session.commitTransaction();

//     res.json({
//       success: true,
//       message: "Added to wishlist"
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   } finally {
//     session.endSession();
//   }
// };

// export const removeFromWishlist = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { carId } = req.params;
//     const userId = req.user._id;

//     // ✅ Validate IDs
//     if (!isValidObjectId(carId) || !isValidObjectId(userId)) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: "Invalid userId or carId"
//       });
//     }

//     const deleted = await Wishlist.findOneAndDelete({
//       user: userId,
//       car: carId
//     }).session(session);

//     if (!deleted) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: "Not in wishlist"
//       });
//     }

//     await Car.findByIdAndUpdate(
//       carId,
//       { $inc: { wishlistCount: -1 } },
//       { session }
//     );

//     await session.commitTransaction();

//     res.json({
//       success: true,
//       message: "Removed from wishlist"
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   } finally {
//     session.endSession();
//   }
// };

// //This is what real apps use (single API for add/remove)
// export const toggleWishlist = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { carId } = req.body;
//     const userId = req.user._id;

//     // ✅ Validate IDs
//     if (!isValidObjectId(carId) || !isValidObjectId(userId)) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: "Invalid userId or carId"
//       });
//     }

//     const carExists = await Car.exists({ _id: carId }).session(session);
//     if (!carExists) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: "Car not found"
//       });
//     }

//     const existing = await Wishlist.findOne({ user: userId, car: carId }).session(session);

//     if (existing) {
//       await existing.deleteOne({ session });

//       await Car.findByIdAndUpdate(
//         carId,
//         { $inc: { wishlistCount: -1 } },
//         { session }
//       );

//       await session.commitTransaction();

//       return res.json({ success: true, action: "removed" });
//     }

//     await Wishlist.create([{ user: userId, car: carId }], { session });

//     await Car.findByIdAndUpdate(
//       carId,
//       { $inc: { wishlistCount: 1 } },
//       { session }
//     );

//     await session.commitTransaction();

//     res.json({ success: true, action: "added" });

//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   } finally {
//     session.endSession();
//   }
// };

// export const getWishlist = async (req, res) => {
//   try {
//     const wishlist = await Wishlist.find({
//       user: req.user._id
//     })
//       .populate("car")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: wishlist.length,
//       data: wishlist
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// //Needed for heart icon state
// export const isWishlisted = async (req, res) => {
//   try {
//     const { carId } = req.params;

//     const exists = await Wishlist.exists({
//       user: req.user._id,
//       car: carId
//     });

//     res.json({
//       success: true,
//       isWishlisted: !!exists
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// export const clearWishlist = async (req, res) => {
//   try {
//     await Wishlist.deleteMany({
//       user: req.user._id
//     });

//     res.json({
//       success: true,
//       message: "Wishlist cleared"
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// //for sorting the cars based on the number of wishlists of all the users
// export const getWishlistCount = async (req, res) => {
//   try {
//     const { carId } = req.params;

//     const count = await Wishlist.countDocuments({ car: carId });

//     res.json({
//       success: true,
//       count
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// export const removeWishlistForDeletedCarByAdmin = async (carId) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Count how many wishlists exist for this car
//     const count = await Wishlist.countDocuments({ car: carId }).session(session);

//     // Delete all wishlist entries
//     await Wishlist.deleteMany({ car: carId }).session(session);

//     // No need to decrement count since car is deleted

//     await session.commitTransaction();

//     return {
//       success: true,
//       removedCount: count
//     };

//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

// import mongoose from "mongoose";
// import { Wishlist } from "../models/wishlist.model";
// import { Car } from "../models/Car.model";
// import { isValidObjectId } from "../utils/validators/validate";

// export const toggleWishlist = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { carId } = req.body;
//     const userId = req.user._id;

//     // ✅ Validate IDs
//     if (!isValidObjectId(carId) || !isValidObjectId(userId)) {
//       throw new Error("Invalid userId or carId");
//     }

//     // ✅ Check car availability (CRITICAL)
//     const car = await Car.findOne({
//       _id: carId,
//       status: "available",
//       lifecycleStatus: { $ne: "INACTIVE" }
//     }).session(session);

//     if (!car) {
//       throw new Error("Car is not available");
//     }

//     const existing = await Wishlist.findOne({
//       user: userId,
//       car: carId
//     }).session(session);

//     // 🔴 REMOVE
//     if (existing && !existing.removedAt) {
//       existing.removedAt = new Date();
//       await existing.save({ session });

//       await Car.findByIdAndUpdate(
//         carId,
//         { $inc: { wishlistCount: -1 } },
//         { session }
//       );

//       await session.commitTransaction();
//       return res.json({ success: true, action: "removed" });
//     }

//     // 🟢 ADD / RESTORE
//     if (existing && existing.removedAt) {
//       existing.removedAt = null;
//       await existing.save({ session });

//       await Car.findByIdAndUpdate(
//         carId,
//         { $inc: { wishlistCount: 1 } },
//         { session }
//       );

//       await session.commitTransaction();
//       return res.json({ success: true, action: "added" });
//     }

//     // 🟢 NEW ENTRY
//     await Wishlist.create([{ user: userId, car: carId }], { session });

//     await Car.findByIdAndUpdate(
//       carId,
//       { $inc: { wishlistCount: 1 } },
//       { session }
//     );

//     await session.commitTransaction();

//     res.json({ success: true, action: "added" });

//   } catch (error) {
//     await session.abortTransaction();
//     res.status(400).json({
//       success: false,
//       message: error.message
//     });
//   } finally {
//     session.endSession();
//   }
// };

// export const getWishlist = async (req, res) => {
//   try {
//     const wishlist = await Wishlist.find({
//       user: req.user._id
//     })
//       .populate("car")
//       .sort({ createdAt: -1 });

//     // ✅ Remove broken references
//     const filtered = wishlist.filter(item => item.car);

//     res.json({
//       success: true,
//       count: filtered.length,
//       data: filtered
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// export const clearWishlist = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const items = await Wishlist.find({
//       user: req.user._id,
//       removedAt: null
//     }).session(session);

//     const carIds = items.map(i => i.car);

//     await Wishlist.updateMany(
//       { user: req.user._id },
//       { removedAt: new Date() },
//       { session }
//     );

//     await Car.updateMany(
//       { _id: { $in: carIds } },
//       { $inc: { wishlistCount: -1 } },
//       { session }
//     );

//     await session.commitTransaction();

//     res.json({
//       success: true,
//       message: "Wishlist cleared"
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   } finally {
//     session.endSession();
//   }
// };

// export const markWishlistRemovedForCar = async (carId) => {
//   await Wishlist.updateMany(
//     { car: carId, removedAt: null },
//     { removedAt: new Date() }
//   );
// };

import mongoose from "mongoose";
import {Wishlist} from "../models/Wishlist.model.js"
import { Car } from "../models/Car.model.js";
import { isValidObjectId } from "../utils/validators/validate.js";

// -------------------------
// Toggle / Add / Remove
// -------------------------
// export const toggleWishlist = async (req, res) => {
//   const session = await mongoose.startSession();

//   try {
//     await session.withTransaction(async () => {
//       const { carId } = req.body;
//       const userId = req.user._id;

//       // Validate IDs
//       if (!isValidObjectId(carId)) throw new Error("Invalid carId");

//       // Check car availability
//       const car = await Car.findOne({
//         _id: carId,
//         lifecycleStatus: "ACTIVE"
//       }).session(session);

//       if (!car) throw new Error("Car not available");

//       const existing = await Wishlist.findOne({ user: userId, car: carId }).session(session);

//       // If exists → remove (hard delete)
//       if (existing) {
//         await Wishlist.deleteOne({ _id: existing._id }).session(session);

//         await Car.findOneAndUpdate(
//           { _id: carId, wishlistCount: { $gt: 0 } },
//           { $inc: { wishlistCount: -1 } },
//           { session }
//         );

//         return res.json({ success: true, action: "removed" });
//       }

//       // Otherwise → add
//       await Wishlist.create([{ user: userId, car: carId }], { session });

//       await Car.findByIdAndUpdate(
//         carId,
//         { $inc: { wishlistCount: 1 } },
//         { session }
//       );

//       res.json({ success: true, action: "added" });
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   } finally {
//     session.endSession();
//   }
// };
export const toggleWishlist = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const { carId } = req.body;
      const userId = req.user._id;

      if (!isValidObjectId(carId)) {
        throw new Error("Invalid carId");
      }

      const car = await Car.findOne({
        _id: carId,
        lifecycleStatus: "ACTIVE",
      }).session(session);

      if (!car) throw new Error("Car not available");

      const existing = await Wishlist.findOne({
        user: userId,
        car: carId,
      }).session(session);

      if (existing) {
        await Wishlist.deleteOne({ _id: existing._id }).session(session);

        await Car.updateOne(
          { _id: carId, wishlistCount: { $gt: 0 } },
          { $inc: { wishlistCount: -1 } },
          { session }
        );

        return { action: "removed" };
      }

      await Wishlist.create([{ user: userId, car: carId }], { session });

      await Car.updateOne(
        { _id: carId },
        { $inc: { wishlistCount: 1 } },
        { session }
      );

      return { action: "added" };
    });

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// -------------------------
// Get User Wishlist
// -------------------------
export const getWishlist = async (req, res) => {
  try {
    const now = new Date();

    const wishlist = await Wishlist.find({
      user: req.user._id,
      $or: [
        { hiddenAt: null },
        { hiddenAt: { $gt: now } } // visible if hiddenAt > now
      ]
    })
      .populate({
        path: "car",
        select:
          "title price lifecycleStatus slug year fuelType transmission kmDriven location images brand variant",
        populate: {
          path: "brand",
          select: "name slug logo"
        }
      })
      .sort({ createdAt: -1 });

    // Remove broken references
    const filtered = wishlist.filter(item => item.car);

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------
// Clear Wishlist
// -------------------------
// export const clearWishlist = async (req, res) => {
//   const session = await mongoose.startSession();

//   try {
//     await session.withTransaction(async () => {
//       const userId= req.user._id;
//       const items = await Wishlist.find({ user: userId }).session(session);
//       const carIds = items.map(i => i.car);

//       // Hard delete user wishlist entries
//       await Wishlist.deleteMany({ user:userId}).session(session);

//       // Decrement wishlistCount safely
//       // if (carIds.length > 0) {
//       //   await Car.updateMany(
//       //     { _id: { $in: carIds }, wishlistCount: { $gt: 0 } },
//       //     { $inc: { wishlistCount: -1 } },
//       //     { session }
//       //   );
//       // }
//       for (const carId of carIds){
//         await Car.findOneAndUpdate(
//           {_id: carId, wishlistCount:{$gt: 0}},
//           {$inc:{wishlistCount:-1}},
//           {session}
//         )
//       }
//     });

//     res.json({ success: true, message: "Wishlist cleared" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   } finally {
//     session.endSession();
//   }
// };
export const clearWishlist = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const userId = req.user._id;

      const items = await Wishlist.find({ user: userId }).session(session);
      const carIds = items.map((i) => i.car);

      await Wishlist.deleteMany({ user: userId }).session(session);

      if (carIds.length > 0) {
        await Car.updateMany(
          { _id: { $in: carIds }, wishlistCount: { $gt: 0 } },
          { $inc: { wishlistCount: -1 } },
          { session }
        );
      }
    });

    res.json({ success: true, message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};
// -------------------------
// Mark Wishlist Inactive When Car Sold
// -------------------------
// export const markWishlistInactiveForCar = async (carId) => {
//   if (!isValidObjectId(carId)) throw new Error("Invalid carId");
//   // if (!isValidObjectId(carId)) return;

//   const now = new Date();

//   await Wishlist.updateMany(
//     { car: carId, status: "ACTIVE" },
//     {
//       status: "INACTIVE_BY_CAR",
//       carBecameInactiveAt: now,
//       hiddenAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days visibility
//     }
//   );

//   // Optionally reset wishlistCount
//   await Car.findByIdAndUpdate(carId, { wishlistCount: 0 });
// };
// call this when car is sold
export const markWishlistInactiveForCar = async (carId) => {
  if (!isValidObjectId(carId)) return;

  const now = new Date();

  await Wishlist.updateMany(
    { car: carId, status: "ACTIVE" },
    {
      status: "INACTIVE_BY_CAR",
      carBecameInactiveAt: now,
      hiddenAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    }
  );

  await Car.findByIdAndUpdate(carId, { wishlistCount: 0 });
};

export const getWishlistAdmin = async(req, res)=>{
  try {
    const wishlist =await Wishlist.find({})
    .populate("car")
    .sort({createdAt: -1})

res.json({
  success:true,
  count:wishlist.length,
  data:wishlist
})
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}