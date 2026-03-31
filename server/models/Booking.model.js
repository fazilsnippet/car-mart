import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    },

    bookingType: {
      type: String,
      enum: ["TEST_DRIVE", "CALLBACK", "VISIT"],
      required: true
    },

    preferredDate: Date,
    preferredTime: String,

    message: {
      type: String,
      maxlength: 500
    },

    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "COMPLETED", "CANCELLED"],
      default: "NEW",
      index: true
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
