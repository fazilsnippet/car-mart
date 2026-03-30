// // file: queue/notification.worker.js
// import { Worker } from "bullmq";
// import mongoose from "mongoose";
// import { Notification } from "../models/Notification.model.js";
// import { User } from "../models/User.model.js";
// import { Wishlist } from "../models/Wishlist.model.js";
// import connectDB from "../db/index.js";

// await connectDB();

// console.log("✅ Worker started...");

// export const notificationWorker = new Worker(
//   "notifications",
//   async (job) => {
//     try {
//       console.log("🔥 JOB RECEIVED:", job.name, job.data);

//      // file: services/notification.worker.js

// // file: services/notification.worker.js

//       if (job.name === "price-drop") {
//         const { carId, newPrice } = job.data;

//         const users = await Wishlist.find({
//           car: new mongoose.Types.ObjectId(carId)
//         }).select("user");

//         console.log("📌 WISHLIST USERS:", users);

//         if (!users.length) {
//           console.log("❌ NO USERS FOUND");
//           return;
//         }

//         const notifications = users.map((u) => ({
//           user: u.user,
//           type: "price_drop",
//           title: "Price Dropped!",
//           message: `Car price is now ₹${newPrice}`,
//           data: { carId }
//         }));

//         await Notification.insertMany(notifications);

//         console.log("✅ NOTIFICATIONS INSERTED");
//       }
//     } catch (error) {
//       console.error("❌ WORKER ERROR:", error);
//     }
//   },
//   {
//     connection: { host: "127.0.0.1", port: 6379 }
//   }
// );


// 2nd attempt:
// export const notificationWorker = new Worker(
//   "notifications",
//   async (job) => {
//     console.log("🔥 JOB RECEIVED:", job.name, job.data);

//     const { carId } = job.data;

//     // Get all users who care about this car
//     const users = await Wishlist.find({
//       car: new mongoose.Types.ObjectId(carId)
//     }).select("user");

//     if (!users.length) {
//       console.log("❌ NO USERS FOUND IN WISHLIST");
//       return;
//     }

//     let notifications = [];

//     switch (job.name) {
//       case "price_drop": {
//         const { newPrice } = job.data;

//         notifications = users.map((u) => ({
//           user: u.user,
//           type: "price_drop",
//           title: "Price Dropped!",
//           message: `Car price is now ₹${newPrice}`,
//           data: { carId }
//         }));
//         break;
//       }

//       case "car_sold": {
//         notifications = users.map((u) => ({
//           user: u.user,
//           type: "car_sold",
//           title: "Car Sold",
//           message: "This car has been sold",
//           data: { carId }
//         }));
//         break;
//       }

//       case "car_inactive": {
//         notifications = users.map((u) => ({
//           user: u.user,
//           type: "car_inactive",
//           title: "Listing Removed",
//           message: "This car is no longer available",
//           data: { carId }
//         }));
//         break;
//       }

//       case "car_booked": {
//         notifications = users.map((u) => ({
//           user: u.user,
//           type: "car_booked",
//           title: "Car Booked",
//           message: "This car has been booked by someone",
//           data: { carId }
//         }));
//         break;
//       }
//     }

//     if (notifications.length) {
//       await Notification.insertMany(notifications);
//       console.log("✅ NOTIFICATIONS INSERTED");
//     }
//   },
//   {
//     connection: { host: "127.0.0.1", port: 6379 }
//   }
// );

// file: queue/notification.worker.js
// file: queue/notification.worker.js
import { Worker } from "bullmq";
import mongoose from "mongoose";
import { Notification } from "../models/Notification.model.js";
import { Wishlist } from "../models/Wishlist.model.js";
import { Booking } from "../models/Booking.model.js";
import { Conversation } from "../models/Conversation.model.js";

console.log("✅ Notification Worker Started...");

const ADMIN_ID = process.env.ADMIN_ID;

export const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    console.log("🔥 JOB RECEIVED:", job.name, job.data);

    const { carId } = job.data;

    let finalUserSet = new Set();

    try {
      // =========================
      // 🎯 HANDLE JOB TYPES
      // =========================
      switch (job.name) {

        // =========================
        // 💬 NEW MESSAGE
        // =========================
        case "new-message": {
          if (!job.data.userId) {
            console.log("❌ Missing userId for new-message");
            return;
          }

          finalUserSet.add(job.data.userId.toString());
          break;
        }

        // =========================
        // 🚗 CAR EVENTS
        // =========================
        case "price_drop":
        case "car_sold":
        case "car_inactive": {

          if (!carId) {
            console.log("❌ Missing carId");
            return;
          }

          const objectCarId = new mongoose.Types.ObjectId(carId);

          // 🔥 Fetch only when needed
          const [wishlistUsers, bookingUsers, conversations] = await Promise.all([
            Wishlist.find({ car: objectCarId }).select("user"),
            Booking.find({ car: objectCarId }).select("user"),
            Conversation.find({ car: objectCarId }).select("user")
          ]);

          const wishlistSet = new Set(wishlistUsers.map(u => u.user.toString()));
          const bookingSet = new Set(bookingUsers.map(u => u.user.toString()));

          const enquirySet = new Set(
            conversations
              .map(conv => conv.user.toString())
              .filter(id => !ADMIN_ID || id !== ADMIN_ID)
          );

          if (job.name === "price_drop") {
            // ❌ exclude booking users
            [...wishlistSet, ...enquirySet].forEach(id => finalUserSet.add(id));
          } else {
            [...wishlistSet, ...bookingSet, ...enquirySet].forEach(id =>
              finalUserSet.add(id)
            );

          
            // ❗ exclude buyer if exists
            if (job.data.boughtBy) {
              finalUserSet.delete(job.data.boughtBy.toString());
            }
          }

          break;
        }

        // =========================
        // ⚠️ UNKNOWN JOB
        // =========================
        default:
          console.log("⚠️ Unknown job type:", job.name);
          return;
      }

      // =========================
      // 🚫 NO USERS
      // =========================
      if (!finalUserSet.size) {
        console.log("❌ No users to notify");
        return;
      }

      console.log("👥 Users to notify:", finalUserSet);

      // =========================
      // 🧱 BUILD NOTIFICATIONS
      // =========================
      const notifications = Array.from(finalUserSet).map((userId) => ({
        user: userId,
        type: job.name,
        title: getTitle(job.name),
        message: getMessage(job.name, job.data),
        data: {
          carId: carId || null,
           conversationId: job.data.conversationId,
          ...(job.name === "price_drop" && {
            oldPrice: job.data.oldPrice,
            newPrice: job.data.newPrice
          })
        }
      }));

      // =========================
      // 💾 INSERT INTO DB
      // =========================
      await Notification.insertMany(notifications);

      console.log(`✅ ${notifications.length} notifications inserted`);

    } catch (err) {
      console.error("❌ Worker error:", err);
    }
  },
  {
    connection: { host: "127.0.0.1", port: 6379 }
  }
);

// =========================
// 🔧 HELPERS
// =========================

function getTitle(event) {
  switch (event) {
    case "price_drop":
      return "Price Dropped!";
    case "car_sold":
      return "Car Sold";
    case "car_inactive":
      return "Listing Removed";
    case "new-message":
      return "New Message";
    default:
      return "Update";
  }
}

function getMessage(event, data) {
  switch (event) {
    case "price_drop":
      return `Car price is now ₹${data.newPrice}`;
    case "car_sold":
      return "This car has been sold";
    case "car_inactive":
      return "This car is no longer available";
    case "new-message":
      return data.message || "You have a new message";
    default:
      return "";
  }
}