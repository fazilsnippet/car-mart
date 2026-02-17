import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "SALES", "MANAGER"],
      default: "SALES"
    },

    permissions: {
      canCreateCar: { type: Boolean, default: true },
      canUpdateCar: { type: Boolean, default: true },
      canDeleteCar: { type: Boolean, default: false },
      canViewBookings: { type: Boolean, default: true }
    },

    lastLoginAt: Date,

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
