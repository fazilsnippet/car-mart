// file: models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    sender: {
      type: String,
      enum: ["user", "admin"]
    },
    text: String,
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);