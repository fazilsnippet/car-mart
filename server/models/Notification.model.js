import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null = broadcast
 type: {
  type: String,
  enum: [
    "broadcast",
    "price_drop",
    "car_sold", 
    "car_booked",
    "car_inactive",
      "new-message",
    "system"
  ],
  required: true
},
  title: String,
  message: String,
data: {
  carId: mongoose.Schema.Types.ObjectId,
  oldPrice: Number,
  newPrice: Number
},
  status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },

    attempts: {
      type: Number,
      default: 0,
    },
      read: { type: Boolean, default: false },


    lastAttemptAt: Date,
  },
 { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);

