import {OTP} from "../models/Otp.model.js"
import { User } from '../models/User.model.js';
import { sendEmail } from "../utils/sendEmail.js";
import { createOtp } from "../utils/generateOtp.js";


export const sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // ✅ Correct way
    const otpCode = await createOtp({
      email,
      purpose: "signup",
      expiryMinutes: 5,
    });

    await sendEmail(email, "Signup OTP", `Your OTP is ${otpCode}`);

    res.json({ message: "OTP sent for registration" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const otpRecord = await OTP.findOne({ email, otp, purpose: "signup" });

    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
    if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    await OTP.deleteMany({ email, purpose: "signup" });

    const user = new User({ email, password });
    await user.save();

    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // ✅ Correct usage with purpose
    const otpCode = await createOtp({
      email,
      purpose: "forgotPassword",
      expiryMinutes: 5,
    });

    await sendEmail(
      email,
      "Forgot Password OTP",
      `Your OTP is ${otpCode}`
    );

    res.json({ message: "OTP sent for password reset" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      purpose: "forgotPassword",
    });

    if (!otpRecord)
      return res.status(400).json({ message: "Invalid OTP" });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = otpRecord.compareOtp(otp);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid OTP" });

    await OTP.findOneAndDelete({
      email,
      purpose: "forgotPassword",
    });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const sendUpdatePasswordOtp = async (req, res) => {
  try {
    const email = req.user.email;

    const otpCode = await createOtp({
      email,
      purpose: "updatePassword",
      expiryMinutes: 5,
    });

    await sendEmail(
      email,
      "Password Update OTP",
      `Your OTP is ${otpCode}`
    );

    res.json({ message: "OTP sent for password update" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updatePasswordAfterLogin = async (req, res) => {
  try {
    const email = req.user.email;
    const { otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      purpose: "updatePassword",
    });

    if (!otpRecord)
      return res.status(400).json({ message: "Invalid OTP" });

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const isMatch = otpRecord.compareOtp(otp);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid OTP" });

    await OTP.findOneAndDelete({
      email,
      purpose: "updatePassword",
    });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};