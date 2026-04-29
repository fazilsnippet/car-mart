import mongoose from "mongoose";

const carSellSchema = new mongoose.Schema(
  {
   registrationNumber: {
  type: String,
  required: true,
  unique: true,
  uppercase: true,
  trim: true,
},

user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },

    location: {
      type: String,
      required: true, // ✅ important for admin contact
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    brand: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    year: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear(),
    },

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

    kmDriven: {
      type: Number,
      required: true,
      min: 0,
    },

    owners: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },


    expectedPrice: {
      type: Number,
      required: true,
      min: 1000,
    },

    finalPrice: {
      type: Number,
      min: 1000,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "contacted", // ✅ added
        "inspection_scheduled",
        "approved",
        "rejected",
      ],
      default: "pending",
      index: true,
    },

    features: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) =>
          arr.every((f) => typeof f === "string" && f.trim().length > 0),
        message: "Features must be non-empty strings",
      },
    },

    conditionNotes: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// 🔥 validations
carSellSchema.path("images").validate(function (arr) {
  return arr.length >= 1 && arr.length <= 12;
}, "Images must be between 1 and 12");

// 🔥 indexes
carSellSchema.index({ user: 1, createdAt: -1 });


export default mongoose.model("CarSell", carSellSchema);