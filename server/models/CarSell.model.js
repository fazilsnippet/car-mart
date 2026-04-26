import mongoose from "mongoose";

const carSellSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    // 🔥 Store full image object (matches controller)
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    brand: { type: String, required: true },

    year: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear(),
    },

    // 🔥 Match controller + frontend
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"],
      required: true,
    },

    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },

    kmDriven: { type: Number, required: true, min: 0 },

    owners: { type: Number, required: true, min: 0, max: 7 },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },


    // 🔥 Match controller + frontend
    price: { type: Number, required: true, min: 1000 },

features: {
  type: [String],
  default: [],
  validate: {
    validator: function (arr) {
      return arr.every(
        (f) => typeof f === "string" && f.trim().length > 0
      );
    },
    message: "Features must be non-empty strings",
  },
},
    conditionNotes: String,
  },
  { timestamps: true }
);

// 🔥 Keep image count validation
carSellSchema.path("images").validate(function (arr) {
  return arr.length >= 1 && arr.length <= 12;
}, "Images must be between 1 and 12");

export default mongoose.model("CarSell", carSellSchema);