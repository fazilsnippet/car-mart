import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },

variant  :{
      type: String,
      required: true,
      index: true
    },

brand: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Brand",
  required: true,
  index: true
},
   slug: {
      type: String,
      index: true
    },

    year: {
      type: Number,
      required: true,
      index: true
    },

    price: {
      type: Number,
      required: true,
      index: true
    },

    kmDriven: {
      type: Number,
      required: true,
      index: true
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG", "Other"],
      index: true
    },

    transmission: {
      type: String,
      enum: ["MT", "AT", "CVT", "DCT", "AMT", "IMT", "E-CVT","SINGLE-SPEED", "OTHERS"],
    required: true,
  index: true},

    gears:Number,
    driveType: {
      type: String,
      enum: ["FWD", "RWD", "AWD", "4WD"]
    },

    ownerCount: {
      type: Number,
      default: 1,
      index: true
    },

    location: {
      city: String,
      state: String
    },

    images: [
      {
        url: String,
        publicId: String
      }
    ],

    features: {
  type: [String],
  default: [],
}, 

    lifecycleStatus: {
      type: String,
      enum: ["ACTIVE", "SOLD", "INACTIVE"],
      default: "ACTIVE",
      index: true
    },

  },
  { timestamps: true }
);

// compound index to avoid duplicate cars (title+brand+year+variant)
carSchema.index(
  { title: 1, brand: 1, year: 1, variant: 1 },
  { unique: true }
);

export const Car = mongoose.model("Car", carSchema);  