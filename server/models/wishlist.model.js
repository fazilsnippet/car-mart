

import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true
    },

    // 🔥 Current state
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE_BY_CAR"],
      default: "ACTIVE"
    },

    // ⛔ When car became sold/inactive
    carBecameInactiveAt: {
      type: Date,
      default: null
    },

    // 👤 When to hide from USER (not admin)
    hiddenAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);


// ✅ Prevent duplicates
wishlistSchema.index({ user: 1, car: 1 }, { unique: true });

// ✅ User queries
wishlistSchema.index({ user: 1, hiddenAt: 1 });

// ✅ Filtering active/inactive
wishlistSchema.index({ user: 1, status: 1 });

// ✅ Bulk updates when car becomes inactive
wishlistSchema.index({ car: 1, status: 1 });

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
