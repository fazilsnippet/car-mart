
// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
  sender: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
    text: {
      type: String,
      required: true
    },
        read: { type: Boolean, default: false }

  },
  { timestamps: true }
);

// ✅ critical index
messageSchema.index({ conversation: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);