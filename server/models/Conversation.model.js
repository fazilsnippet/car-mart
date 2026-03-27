// file: models/Conversation.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" }
  },
  { timestamps: true }
);

conversationSchema.index({ user: 1, car: 1 }, { unique: true });

export const Conversation = mongoose.model("Conversation", conversationSchema);