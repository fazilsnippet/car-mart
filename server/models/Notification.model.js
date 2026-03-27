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
    "system"
  ],
  required: true
},
  title: String,
  message: String,
data: {
  carId: mongoose.Schema.Types.ObjectId,
  newPrice: Number
},
  read: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);