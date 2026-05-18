// import { OTP } from "../models/Otp.model.js";
// export const createOtp = async ({ email, purpose, expiryMinutes = 10 } = {}) => {
//   if ( !purpose) {
//   throw new Error(" purpose are required to create OTP");
// }
//   if (!email || !purpose) {
//     throw new Error("Email are required to create OTP");
//   }

//   const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//   await OTP.findOneAndDelete({ email, purpose });

//   await OTP.create({
//     email,
//     otp: otpCode,
//     purpose,
//     expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
//   });

//   return otpCode;
// };

// utils/generateOtp.js

import crypto from "crypto";
import { OTP } from "../models/Otp.model.js";


// ==============================
// GENERATE RANDOM OTP
// ==============================

const generateRandomOtp = () => {
  return crypto
    .randomInt(100000, 999999)
    .toString();
};


// ==============================
// CREATE OTP
// ==============================

export const createOtp = async ({
  email,
  purpose,
  expiryMinutes = 5,
}) => {

  // ==============================
  // DELETE OLD OTPs
  // ==============================

  await OTP.deleteMany({
    email,
    purpose,
  });

  const otp =
    generateRandomOtp();

  const expiresAt = new Date(
    Date.now() +
      expiryMinutes *
        60 *
        1000
  );

  await OTP.create({
    email,
    otp,
    purpose,
    expiresAt,
  });

  return otp;
};
export const verifyOtp = async ({ email, otp, purpose }) => {
  const otpRecord = await OTP.findOne({ email, purpose });

  if (!otpRecord) return false;

  if (otpRecord.expiresAt < new Date()) return false;

  if (otpRecord.attempts >= 5) return false;

  const isMatch = otpRecord.compareOtp(otp);

  if (!isMatch) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    return false;
  }

  await OTP.findOneAndDelete({ email, purpose });

  return true;
};