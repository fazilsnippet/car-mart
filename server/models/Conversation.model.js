// file: models/Conversation.js

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
   participants: {
  type: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  validate: {
    validator: function (arr) {
      return arr.length === 2 && arr.every(Boolean);
    },
    message: "Conversation must have exactly 2 valid participants"
  }
},

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true
    },

    // 🔥 deterministic uniqueness key
    uniqueKey: {
      type: String,
      required: true,
      unique: true
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null
    },

    // 🔥 unread count system
    unreadCounts: {
      type: Map,
      of: Number,
      default: {}
    }

  },
  { timestamps: true }
);

// =========================
// ✅ INDEXES
// =========================

// fast sorting (admin dashboard)
conversationSchema.index({ updatedAt: -1 });

// fast user queries
conversationSchema.index({ participants: 1 });

// optional: car-based queries
conversationSchema.index({ car: 1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);