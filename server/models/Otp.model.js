import mongoose from "mongoose";
import crypto from "crypto";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["signup", "forgotPassword", "updatePassword"],
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

  expiresAt: {
  type: Date,
  required: true,
  expires: 0,  // ✅ cleaner way
},
  },
  { timestamps: true }
);


// 🔐 HASH OTP BEFORE SAVE
otpSchema.pre("save", function () {
  if (!this.isModified("otp")) return;

  this.otp = crypto
    .createHash("sha256")
    .update(this.otp)
    .digest("hex");
});


// 🔎 COMPARE METHOD
otpSchema.methods.compareOtp = function (candidateOtp) {
  const hashed = crypto
    .createHash("sha256")
    .update(candidateOtp)
    .digest("hex");

  return this.otp === hashed;
};


// ⚡ INDEX FOR FAST LOOKUP
otpSchema.index({ email: 1, purpose: 1 });


export const OTP = mongoose.model("OTP", otpSchema);