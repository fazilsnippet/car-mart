
import { Worker } from "bullmq";
import mongoose from "mongoose";
import { Notification } from "../models/Notification.model.js";
import { Booking } from "../models/Booking.model.js";
import { Conversation } from "../models/Conversation.model.js";
import { Wishlist } from "../models/wishlist.model.js";

console.log("✅ Notification Worker Started...");

const ADMIN_ID = process.env.ADMIN_ID;
const redisConnection = {
  host: process.env.REDIS_HOST ,
  port: Number(process.env.REDIS_PORT) 
  // ...(process.env.REDIS_USERNAME
  //   ? { username: process.env.REDIS_USERNAME }
  //   : {}),
  // ...(process.env.REDIS_PASSWORD
  //   ? { password: process.env.REDIS_PASSWORD }
  //   : {}),
};

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
    connection: redisConnection,
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