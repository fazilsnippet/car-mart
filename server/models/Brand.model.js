import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
logo
: {
  url: String,
  publicId: String
},
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },


  },
  { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);
