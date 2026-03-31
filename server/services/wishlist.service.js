// call this when car is sold
import {Wishlist} from "../models/wishlist.model.js";
import {Car} from "../models/Car.model.js";


// export const markWishlistInactiveForCar = async (carId) => {
//   if (!isValidObjectId(carId)) return;

//   const now = new Date();

//   await Wishlist.updateMany(
//     { car: carId, status: "ACTIVE" },
//     {
//       status: "INACTIVE_BY_CAR",
//       carBecameInactiveAt: now,
//       hiddenAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
//     }
//   );

//   await Car.findByIdAndUpdate(carId, { wishlistCount: 0 });
// };

export const markWishlistInactiveForCar = async (carId, session) => {
  const now = new Date();

  await Wishlist.updateMany(
    { car: carId, status: "ACTIVE" },
    {
      status: "INACTIVE_BY_CAR",
      carBecameInactiveAt: now,
      hiddenAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    },
    { session } // ✅ important
  );

  await Car.findByIdAndUpdate(
    carId,
    { wishlistCount: 0 },
    { session } // ✅ important
  );
};